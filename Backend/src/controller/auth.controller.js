import { userModel } from "../models/user.models.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { sessionModel } from "../models/session.model.js"
import { otpModel } from "../models/otp.models.js"
import { sendEmail } from "../services/email.js"
import { generateOtp, getOtpHtml } from "../utils/utils.js"
import config from "../utils/config.js"


// Helper: deterministic hash for refresh token lookup
// (bcrypt is non-deterministic due to random salt, so it can't be used in a findOne query)
function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex")
}

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const userExists = await userModel.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userModel.create({ username, email, password: hashedPassword })


        //genrateOtp

        const otp = generateOtp()
        const html = getOtpHtml(otp)
        const otpHash = hashToken(otp)

        await otpModel.create({
            user: user._id,
            otpHash,
            email: user.email
        })

        await sendEmail({ to: user.email, subject: "Verify Your Email", html })



        res.status(201).json({
            message: "User created successfully",
            user: { id: user._id, username: user.username, email: user.email, isVerified: user.isVerified }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function loginController(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    if (!user.isVerified) {
        return res.status(400).json({ message: "User is not verified" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" })
    }

    const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" })
    const refreshTokenHash = hashToken(refreshToken) // <-- SHA-256, deterministic

    const session = await sessionModel.create({
        user: user._id,
        refreshToken: refreshTokenHash, // storing the SHA-256 hash, not bcrypt
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    })

    const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, config.JWT_SECRET, { expiresIn: "15m" })

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })

    res.status(200).json({
        message: "User logged in successfully",
        user: { id: user._id, username: user.username, email: user.email },
        accessToken
    })


}


export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        // JWT errors (expired/invalid) -> 401, not 500
        let decoded
        try {
            decoded = jwt.verify(refreshToken, config.JWT_SECRET)
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired refresh token" })
        }

        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const refreshTokenHash = hashToken(refreshToken)

        // Direct lookup now works because SHA-256 is deterministic
        const session = await sessionModel.findOne({
            user: user._id,
            refreshToken: refreshTokenHash,
            revoked: false
        })

        if (!session) {
            // Either token was already rotated/used, or is invalid/revoked.
            // (Optional hardening: if a session existed for this user but hash didn't match,
            // that can indicate token reuse/theft -> revoke all sessions for this user.)
            return res.status(401).json({ message: "Unauthorized" })
        }

        const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, config.JWT_SECRET, { expiresIn: "15m" })
        const newRefreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" })

        session.refreshToken = hashToken(newRefreshToken) // rotate stored hash
        await session.save()

        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })

        res.status(200).json({ message: "Access Token Refreshed successfully", accessToken })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function logoutController(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh Token not found" })
        }

        let decoded
        try {
            decoded = jwt.verify(refreshToken, config.JWT_SECRET)
        } catch (err) {
            // Token already expired/invalid -> just clear the cookie, nothing left to revoke
            res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" })
            return res.status(401).json({ message: "Invalid or expired refresh token" })
        }

        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const refreshTokenHash = hashToken(refreshToken)

        const session = await sessionModel.findOne({
            user: user._id,
            refreshToken: refreshTokenHash,
            revoked: false
        })

        if (!session) {
            return res.status(401).json({ message: "Session not found" })
        }

        session.revoked = true
        await session.save()

        // clearCookie only needs the identifying options, not maxAge
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" })

        res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



export async function logoutAllController(req, res) {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh Token not found" })
    }
    let decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionModel.updateMany({
        user: decoded._id,
        revoked: false
    }, {
        revoked: true
    })

    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" })
    res.status(200).json({ message: "Logout from all devices successfully" })


}


export async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (!req.user.id) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        return res.status(200).json({
            message: "User details fetched Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" })
        }

        const otpHash = hashToken(otp)
        const storedOtp = await otpModel.findOne({
            user: user._id,
            otpHash,
            email: user.email
        })

        if (!storedOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        user.isVerified = true
        await user.save()

        await otpModel.deleteMany({ _id: storedOtp._id })

        res.status(200).json({
            message: "Email verified successfully",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export async function resendOtpController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified",
            });
        }

        // Remove previous OTPs
        await otpModel.deleteMany({ user: user._id });

        // Generate new OTP
        const otp = generateOtp();
        const otpHash = hashToken(otp);

        const html = getOtpHtml(otp)
        await otpModel.create({
            user: user._id,
            otpHash,
            email: user.email
        })

        await sendEmail({ to: user.email, subject: "Verify Your Email", html })

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}
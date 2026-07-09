import { userModel } from "../models/user.models.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import config from "../utils/config.js"

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

        const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })

        res.status(201).json({
            message: "User created successfully", user: {
                id: user._id,
                username: user.username,
                email: user.email
            }, accessToken
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "15m" })
        const newRefreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })

        res.status(200).json({ message: "Access Token Refreshed successfully", accessToken })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
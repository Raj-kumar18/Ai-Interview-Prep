import jwt from "jsonwebtoken"
import config from "../utils/config.js"

export async function authUser(req, res, next) {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired refresh token" })
    }
}
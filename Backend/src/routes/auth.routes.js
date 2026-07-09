import express from "express"
import * as authController from "../controller/auth.controller.js"
const authRouter = express.Router()



authRouter.post("/register", authController.registerController)
authRouter.post("/refresh-token", authController.refreshToken)

export default authRouter
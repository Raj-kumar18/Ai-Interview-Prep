import express from "express"
import * as authController from "../controller/auth.controller.js"
const authRouter = express.Router()



authRouter.post("/register", authController.registerController)
authRouter.post("/login", authController.loginController)
authRouter.get("/logout", authController.logoutController)
authRouter.get("/logout-all", authController.logoutAllController)
authRouter.post("/refresh-token", authController.refreshToken)

export default authRouter
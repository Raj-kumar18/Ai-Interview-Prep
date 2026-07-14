import express from "express"
import * as authController from "../controller/auth.controller.js"
import { authUser } from "../middlewares/auth.middleware.js"
const authRouter = express.Router()



authRouter.post("/register", authController.registerController)
authRouter.post("/login", authController.loginController)
authRouter.get("/logout", authController.logoutController)
authRouter.get("/logout-all", authController.logoutAllController)
authRouter.get("/verify-email", authController.verifyEmail)
authRouter.post("/refresh-token", authController.refreshToken)
authRouter.get("/getMe", authUser, authController.getMeController)
export default authRouter
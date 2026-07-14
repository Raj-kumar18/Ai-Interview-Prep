import express from "express"
import * as authController from "../controller/auth.controller.js"
import { authUser } from "../middlewares/auth.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { registerSchema, loginSchema } from "../validations/auth.validations.js"

const authRouter = express.Router()



authRouter.post("/register", validate(registerSchema), authController.registerController)
authRouter.post("/login", validate(loginSchema), authController.loginController)
authRouter.get("/logout", authController.logoutController)
authRouter.get("/logout-all", authController.logoutAllController)
authRouter.get("/verify-email", authController.verifyEmail)
authRouter.post("/refresh-token", authController.refreshToken)
authRouter.post("/resend-otp", authController.resendOtpController)
authRouter.get("/getMe", authUser, authController.getMeController)
export default authRouter
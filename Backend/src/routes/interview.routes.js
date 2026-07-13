import express from "express"
import * as interviewController from "../controller/interview.controller.js"
import { upload } from "../middlewares/file.middleware.js"
import { authUser } from "../middlewares/auth.middleware.js"
const interviewRouter = express.Router()



interviewRouter.post("/", authUser, upload.single("resume"), interviewController.generateInterviewController)
interviewRouter.get("/report/:interviewId", authUser, interviewController.getInterviewByIdController)
interviewRouter.post("/report/pdf/:interviewReportId", authUser, interviewController.generateResumePdfController)
interviewRouter.get("/", authUser, interviewController.getAllInterviewReport)

export default interviewRouter
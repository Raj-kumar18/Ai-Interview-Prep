import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import interviewRouter from "./routes/interview.routes.js"
const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//Routes
app.use("/api/auth", authRouter)
app.use("/api/ai", interviewRouter)


export default app
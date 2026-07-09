import mongoose from "mongoose";
import config from "../utils/config.js";


export const connectDB = async () => {
    await mongoose.connect(config.MONGO_URI)
    if (mongoose.connection.readyState === 1) {
        console.log("DATABASE IS CONNECTED")
    }
    else {
        console.log("DATABASE IS NOT CONNECTED")
    }
}
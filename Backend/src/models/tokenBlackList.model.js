import mongoose from "mongoose";


const tokenBlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"]
    }
}, { timestamps: true })

export const tokenBlackListModel = mongoose.model("TokenBlackList", tokenBlackListSchema)
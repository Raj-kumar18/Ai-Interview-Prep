import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    otpHash: {
        type: String,
        required: [true, "OTP Hash is required"],
    }

}, { timestamps: true })

export const otpModel = mongoose.model("OTP", otpSchema)
import { z } from "zod"


export const otpSchema = z.object({
    email: z.string().email(),

    otp: z
        .string()
        .length(4, "OTP must be 4 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
});
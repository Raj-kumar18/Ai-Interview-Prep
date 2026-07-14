import { z } from "zod"


export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 charecter long")
        .max(20, "Username must be less than 20 charecters long")
        .regex(/^[a-zA-Z0-9_]*$/, "Username can only contain letters, numbers and underscores"),

    email: z
        .string()
        .trim()
        .regex(/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i, "email must contain @")
        .email("invalid email address"),

    password: z
        .string()
        .min(8, "Password must be atlest 8 character")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            "Password must contain uppercase, lowercase and number"
        ),
})


export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .regex(/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i, "email must contain @"),

    password: z
        .string()
        .min(8, "Password must be atlest 8 character")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            "Password must contain uppercase, lowercase and number"
        )

})
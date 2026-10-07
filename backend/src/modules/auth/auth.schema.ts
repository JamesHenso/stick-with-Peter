import z from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.email("Invalid email"),
        password: z.string().min(8, "Password must contain more than 7 characters"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email"),
        password: z.string().min(1, "Password is not empty"),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, "Refresh token is required"),
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];
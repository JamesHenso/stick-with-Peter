import { Router } from "express";
import { registerSchema, loginSchema, refreshTokenSchema } from "./auth.schema.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
import * as authController from "./auth.controller.js"

export const authRouter: Router = Router();

authRouter.post("/register", validate(registerSchema), authController.handleRegister)
authRouter.post("/login", validate(loginSchema), authController.handleLogin)
authRouter.post("/refresh", validate(refreshTokenSchema), authController.handleRefresh)

authRouter.get("/me", authenticate, authController.handleGetMe)
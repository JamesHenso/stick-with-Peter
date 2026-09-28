import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new AppError("Please Login", 401)
    }

    const token = authHeader.slice("Bearer ".length).trim()
    if (!token) {
        throw new AppError("Please Login", 401)
    }
    try{
        const decoded = verifyAccessToken(token)
        req.user = decoded
        next()
    } catch(error){
        throw new AppError("Invalid token", 401)
    }
}
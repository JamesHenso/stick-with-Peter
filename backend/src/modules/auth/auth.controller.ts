import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js"

export const handleRegister = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const result= await authService.registerUser(req.body)
        res.status(200).json({
            success: true,
            message: "Register successfully",
            data: result
        })
    } catch(error){
        next(error)
    }
}

export const handleLogin = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const result = await authService.loginUser(req.body)
        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: result,
        })
    } catch(error){
        next(error)
    }
}

export const handleGetMe = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        res.status(200).json({
            success: true,
            data: req.user
        })
    } catch(error){
        next(error)
    }
}

export const handleRefresh = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
        const result = await authService.refreshAccessToken(req.body)
        res.status(200).json({
            success: true,
            message: "Refresh successfully",
            data: result,
        })
    } catch(error){
        next(error)
    }
}
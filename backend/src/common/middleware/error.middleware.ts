import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { Prisma } from "@prisma/client";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if(err instanceof AppError){
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    }

    if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === "P2002"){
            const target = (err.meta?.target as String[])?.join(", ") || "fields"
            res.status(409).json({
                success: false,
                message: `Value of ${target} is not available`
            })
        }

        if(err.code === "P2025"){
            res.status(404).json({
                success: false,
                message: "Record not found"
            })
        }
    }

    console.log("Unhandled Error: ", err)
    res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production" ? "System Error. Try again" : err.message
    })
}
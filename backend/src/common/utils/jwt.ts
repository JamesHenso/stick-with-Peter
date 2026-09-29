import jwt from "jsonwebtoken";
import type { JwtPayloadUser } from "../types/express.js";
import { AppError } from "./appError.js";
import type { SignOptions } from "jsonwebtoken";

const getAccessSecret = (): string => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new AppError("JWT_ACCESS_SECRET is not configured", 500);
    }
    return secret;
};

const getRefreshSecret = (): string => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new AppError("JWT_REFRESH_SECRET is not configured", 500);
    }
    return secret;
};

export const getAccessExpiresIn = (): NonNullable<SignOptions["expiresIn"]> => {
    return (process.env.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>) || "15m";
};

export const getRefreshExpiresIn = (): NonNullable<SignOptions["expiresIn"]> => {
    return (process.env.JWT_REFRESH_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>) || "7d";
};

export const signAccessToken = (payload: JwtPayloadUser): string => {
    return jwt.sign(payload, getAccessSecret(), {
        expiresIn: getAccessExpiresIn(),
    });
};

export const signRefreshToken = (payload: JwtPayloadUser): string => {
    return jwt.sign(payload, getRefreshSecret(), {
        expiresIn: getRefreshExpiresIn(),
    });
};

export const verifyAccessToken = (token: string): JwtPayloadUser => {
    try {
        const decoded = jwt.verify(token, getAccessSecret());

        if (
            typeof decoded === "string" ||
            typeof decoded.id !== "string"
        ) {
            throw new AppError("Invalid token payload", 401);
        }

        return {
            id: decoded.id,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Access token expired", 401);
        }
        throw new AppError("Invalid access token", 401);
    }
};

export const verifyRefreshToken = (token: string): JwtPayloadUser => {
    try {
        const decoded = jwt.verify(token, getRefreshSecret());

        if (
            typeof decoded === "string" ||
            typeof decoded.id !== "string"
        ) {
            throw new AppError("Invalid token payload", 401);
        }

        return {
            id: decoded.id,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Refresh token expired", 401);
        }
        throw new AppError("Invalid refresh token", 401);
    }
};
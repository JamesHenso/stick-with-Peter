import jwt from "jsonwebtoken";

import type { JwtPayloadUser } from "../types/express.js";
import { AppError } from "./appError.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET) {
    throw new AppError("Unauthorized", 401);
}

if (!JWT_REFRESH_SECRET) {
    throw new AppError("Unauthorized", 401);
}

const JWT_ACCESS_EXPIRES_IN: jwt.SignOptions["expiresIn"] =
    (process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"])|| "15m";

const JWT_REFRESH_EXPIRES_IN: jwt.SignOptions["expiresIn"] =
    (process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"])|| "7d";

export const signAccessToken = (payload: JwtPayloadUser): string => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
};

export const signRefreshToken = (payload: JwtPayloadUser): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
};

export const verifyAccessToken = (token: string): JwtPayloadUser => {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    if (
        typeof decoded === "string" ||
        typeof decoded.id !== "string"
    ) {
        throw new AppError("Unauthorized", 401);
    }

    return {
        id: decoded.id,
    };
};

export const verifyRefreshToken = (token: string): JwtPayloadUser => {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    if (
        typeof decoded === "string" ||
        typeof decoded.id !== "string"
    ) {
        throw new AppError("Unauthorized", 401);
    }

    return {
        id: decoded.id,
    };
};
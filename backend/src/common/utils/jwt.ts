import jwt from "jsonwebtoken";

import type { JwtPayloadUser } from "../types/express.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
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
        throw new Error("Invalid access token");
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
        throw new Error("Invalid refresh token");
    }

    return {
        id: decoded.id,
    };
};
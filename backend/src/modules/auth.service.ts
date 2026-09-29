import bcrypt from "bcrypt";
import { AppError } from "../common/utils/appError.js";
import type { LoginInput, RefreshTokenInput, RegisterInput } from "./auth.schema.js";
import { prisma } from "../config/prisma.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../common/utils/jwt.js";

const SALT_ROUND = 10;

export const generateTokens = (userId: string) => {
    const accessToken = signAccessToken({ id: userId });
    const refreshToken = signRefreshToken({ id: userId });

    return {
        accessToken,
        refreshToken,
    };
};

export const registerUser = async (data: RegisterInput) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUND);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
        },
    });

    const tokens = generateTokens(user.id);

    return {
        user,
        ...tokens,
    };
};

export const loginUser = async (data: LoginInput) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new AppError("Email or Password are incorrect", 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Email or Password are incorrect", 401);
    }

    const tokens = generateTokens(user.id);

    return {
        user: {
            id: user.id,
            email: user.email,
        },
        ...tokens,
    };
};

export const refreshAccessToken = async (data: RefreshTokenInput) => {
    const { refreshToken } = data;

    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
            id: true,
            email: true,
        },
    });

    if (!user) {    
        throw new AppError("User not found", 401);
    }

    const tokens = generateTokens(user.id);

    return {
        user,
        ...tokens,
    };
};
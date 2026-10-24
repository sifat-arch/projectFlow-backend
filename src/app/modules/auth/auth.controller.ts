import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import config from "../../config";
import { AppError } from "../../utils/AppError";

const cookieOptions = {
  httpOnly: true,
  secure: config.node_env === "production",
  sameSite: "lax" as const,
};

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.registerUser(payload);
  const { accessToken, refreshToken, user } = result;

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      accessToken,
      refreshToken,
      user,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, user } = result;

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken,
      user,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
  }

  const result = await AuthService.refreshToken(token);
  const { accessToken, refreshToken: newRefreshToken } = result;

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", newRefreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
});

const currentUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await AuthService.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Current user retrieved successfully",
    data: user,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

export const AuthController = {
  registerUser,
  registerCustomer: registerUser,
  loginUser,
  refreshToken,
  currentUser,
  getMe: currentUser,
  logoutUser,
};

import type { Application, Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import httpStatus from "http-status";
import config from "./app/config";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { globalErrorHandler } from "./app/middlewere/globalErrorHandlers";
import { notFound } from "./app/middlewere/notFound";
import { SubmissionRoutes } from "./app/modules/auth/submition/submission.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/submissions", SubmissionRoutes);
app.use("/api/v1/submission", SubmissionRoutes);
app.use("/api/submissions", SubmissionRoutes);

// Basic route
app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to ProjectFlow Backend",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;

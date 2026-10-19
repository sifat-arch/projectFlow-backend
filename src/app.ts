import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";

import cors from "cors";
import config from "./config";



const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use("/api/auth", userRouter);
// app.use("/api/booking");

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

// app.use(notFound);
// app.use(globalErrorHandler);

export default app;
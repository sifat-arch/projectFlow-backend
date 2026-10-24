import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewere/checkAuth";
import { validateRequest } from "../../middlewere/validateRequest";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  AuthController.registerUser,
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  AuthController.loginUser,
);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", AuthController.logoutUser);

router.get("/me", auth(), AuthController.currentUser);

export const AuthRoutes = router;

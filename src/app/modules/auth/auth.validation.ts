import { z } from "zod";

export const registerValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z
    .string()
    .email("Invalid email address")
    .transform((value) => value.trim().toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((value) => value.trim().toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

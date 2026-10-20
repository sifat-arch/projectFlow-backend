import { z } from "zod";
import { Status } from "../../../../generated/prisma/enums";

export const createSubmissionValidationSchema = z.object({
  projectName: z
    .string({ error: "project name is required" })
    .min(3, "project name must be at least 3 characters long"),

  frontendRepoUrl: z
    .string({ error: "Frontend repository URL is required" })
    .url("Invalid URL format for frontend repository"),

  backendRepoUrl: z
    .string()
    .url("Invalid URL format for backend repository")
    .optional()
    .or(z.literal("")),

  liveLink: z
    .string({ error: "Live demo link is required" })
    .url("Invalid URL format for live link"),

  description: z
    .string({ error: "Description is required" })
    .min(10, "Description must be at least 10 characters long"),
});

export const updateSubmissionStatusValidationSchema = z.object({
  status: z.enum([Status.PENDING, Status.APPROVED, Status.REJECTED], {
    error: "Status must be PENDING, APPROVED, or REJECTED",
  }),
});

import { Router } from "express";
import { auth } from "../../middlewere/checkAuth";
import { Role } from "../../../../generated/prisma/enums";
import { validateRequest } from "../../middlewere/validateRequest";
import {
  createSubmissionValidationSchema,
  updateSubmissionStatusValidationSchema,
} from "./submission.validation";
import { SubmissionController } from "./submission.controller";

const router = Router();

// Student: Project submission
router.post(
  "/",
  auth(Role.STUDENT),
  validateRequest(createSubmissionValidationSchema),
  SubmissionController.studentFileSubmission,
);

// Student: Get own submissions
router.get(
  "/my",
  auth(Role.STUDENT),
  SubmissionController.getMySubmissions,
);

// Mentor: Get submission statistics (cards)
router.get(
  "/stats",
  auth(Role.MENTOR),
  SubmissionController.getSubmissionStats,
);

// Mentor: Get all submissions with pagination and filtering (?page=1&limit=10&status=APPROVED)
router.get(
  "/",
  auth(Role.MENTOR),
  SubmissionController.getAllSubmissions,
);

// Mentor: Update status of a submission
router.patch(
  "/:id/status",
  auth(Role.MENTOR),
  validateRequest(updateSubmissionStatusValidationSchema),
  SubmissionController.updateSubmissionStatus,
);

export const SubmissionRoutes = router;

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SubmissionService } from "./submission.service";

const studentFileSubmission = catchAsync(
  async (req: Request, res: Response) => {
    const submissionData = req.body;
    const userId = req.user?.userId;

    const submissionResult = await SubmissionService.studentFileSubmission(
      submissionData,
      userId!,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Student project submitted successfully",
      data: submissionResult,
    });
  },
);

const getMySubmissions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const result = await SubmissionService.getMySubmissions(userId!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My submissions fetched successfully",
    data: result,
  });
});

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubmissionService.getAllSubmissions(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submissions fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSubmissionStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await SubmissionService.getSubmissionStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission statistics fetched successfully",
    data: result,
  });
});

const updateSubmissionStatus = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    const result = await SubmissionService.updateSubmissionStatus(id, status);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Submission status updated successfully",
      data: result,
    });
  },
);

export const SubmissionController = {
  studentFileSubmission,
  getMySubmissions,
  getAllSubmissions,
  getSubmissionStats,
  updateSubmissionStatus,
};

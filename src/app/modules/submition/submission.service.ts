import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import {
  ISubmissionFilterRequest,
  ISubmissionPayload,
} from "./submission.interface";
import { Status } from "../../../../generated/prisma/enums";
import type { Prisma } from "../../../../generated/prisma/client";

const studentFileSubmission = async (
  payload: ISubmissionPayload,
  userId: string,
) => {
  const existingUserSubmission = await prisma.submission.findFirst({
    where: {
      userId: userId,
      projectName: payload.projectName,
    },
  });

  if (existingUserSubmission) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already submitted a project with this name!",
    );
  }

  const result = await prisma.submission.create({
    data: {
      projectName: payload.projectName,
      frontendRepoUrl: payload.frontendRepoUrl,
      backendRepoUrl: payload.backendRepoUrl,
      liveLink: payload.liveLink,
      description: payload.description,
      userId: userId,
    },
  });

  return result;
};

const getMySubmissions = async (userId: string) => {
  const submissions = await prisma.submission.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return submissions;
};

const getAllSubmissions = async (query: ISubmissionFilterRequest) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const whereConditions: Prisma.SubmissionWhereInput = {};

  if (
    query.status &&
    Object.values(Status).includes(query.status as Status)
  ) {
    whereConditions.status = query.status as Status;
  }

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.submission.count({
      where: whereConditions,
    }),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: submissions,
  };
};

const getSubmissionStats = async () => {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.submission.count(),
    prisma.submission.count({
      where: {
        status: Status.PENDING,
      },
    }),
    prisma.submission.count({
      where: {
        status: Status.APPROVED,
      },
    }),
    prisma.submission.count({
      where: {
        status: Status.REJECTED,
      },
    }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
  };
};

const updateSubmissionStatus = async (id: string, status: Status) => {
  const isSubmissionExist = await prisma.submission.findUnique({
    where: {
      id,
    },
  });

  if (!isSubmissionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Submission not found!");
  }

  const result = await prisma.submission.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

export const SubmissionService = {
  studentFileSubmission,
  getMySubmissions,
  getAllSubmissions,
  getSubmissionStats,
  updateSubmissionStatus,
};

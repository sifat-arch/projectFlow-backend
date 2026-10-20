import { Status } from "../../../../../generated/prisma/enums";

export interface ISubmissionPayload {
  projectName: string;
  frontendRepoUrl: string;
  backendRepoUrl?: string;
  liveLink: string;
  description: string;
}

export interface ISubmissionFilterRequest {
  status?: Status;
  page?: string | number;
  limit?: string | number;
}

export interface IUpdateSubmissionStatusPayload {
  status: Status;
}

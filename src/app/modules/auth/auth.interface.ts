import { Role } from "../../../../generated/prisma/enums";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

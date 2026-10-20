import { Role } from "../../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { AppError } from "./AppError";
import httpStatus from "http-status";

export const seedMentor = async () => {
  try {
    const isMentorExist = await prisma.user.findFirst({
      where: {
        role: Role.MENTOR,
      },
    });

    if (isMentorExist) {
      console.log("Mentor already exist");
      return;
    }

    if (!config.mentor_name || !config.mentor_email || !config.mentor_password) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "mentor email name and password not exist",
      );

      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.mentor_password,
      Number(config.bcrypt_salt_rounds),
    );

    const mentor = await prisma.user.create({
      data: {
        name: config.mentor_name,
        email: config.mentor_email,
        password: hashedPassword,
        role: Role.MENTOR,
      },
    });

    console.log("Mentor is created", mentor);
  } catch (error) {
    console.log("Error seeding Mentor: ", error);

    await prisma.user.delete({
      where: {
        email: config.mentor_email,
      },
    });
  }
};

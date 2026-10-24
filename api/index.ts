import app from "../src/app";
import { prisma } from "../src/app/lib/prisma";
import { seedMentor } from "../src/app/utils/seed";

let initialization: Promise<void> | undefined;

export default async function handler(
  request: any,
  response: any,
) {
  initialization ??= (async () => {
    await prisma.$connect();
    await seedMentor();
  })().catch((error) => {
    initialization = undefined;
    throw error;
  });

  await initialization;
  return app(request, response);
}

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const bcryptSaltRounds = Number(
  process.env.BCRYPT_SALT_ROUNDS ?? process.env.BCRYPTSALTROUNDS ?? 12,
);
if (
  !Number.isInteger(bcryptSaltRounds) ||
  bcryptSaltRounds < 4 ||
  bcryptSaltRounds > 31
) {
  throw new Error("BCRYPT_SALT_ROUNDS must be an integer between 4 and 31");
}

export default {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  app_url: process.env.APP_URL || "http://localhost:5000",
  database_url: process.env.DATABASE_URL,
  jwt_access_secret:
    process.env.JWT_ACCESS_SECRET ||
    "projectflow_jwt_access_secret_key_default",
  jwt_refresh_secret:
    process.env.JWT_REFRESH_SECRET ||
    "projectflow_jwt_refresh_secret_key_default",
  jwt_access_expires_in: (process.env.JWT_ACCESS_EXPIRES_IN || "1d") as string,
  jwt_refresh_expires_in: (process.env.JWT_REFRESH_EXPIRES_IN ||
    "7d") as string,
  bcrypt_salt_rounds: bcryptSaltRounds,
  mentor_name: process.env.MENTOR_NAME!,
  mentor_email: process.env.MENTOR_EMAIL!,
  mentor_password: process.env.MENTOR_PASSWORD!,
};

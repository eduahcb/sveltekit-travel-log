/* eslint-disable node/prefer-global/process */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/lib/server/db/migrations",
  schema: "./src/lib/server/db/schema/index.ts",
  casing: "snake_case",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.NODE_ENV === "development" ? undefined : process.env.TURSO_AUTH_TOKEN,
  },
});

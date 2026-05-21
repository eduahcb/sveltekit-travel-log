import { env } from "$env/dynamic/private";
import { NODE_ENV } from "$env/static/private";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../../schema";

console.error("[db] TURSO_DATABASE_URL:", env.TURSO_DATABASE_URL);
console.error("[db] TURSO_AUTH_TOKEN prefix:", env.TURSO_AUTH_TOKEN?.slice(0, 20));

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN,
  },
  schema,
  casing: "snake_case",
});

export default db;

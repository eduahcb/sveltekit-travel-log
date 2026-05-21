import { env } from "$env/dynamic/private";
import { NODE_ENV } from "$env/static/private";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../../schema";

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN,
  },
  schema,
  casing: "snake_case",
});

export default db;

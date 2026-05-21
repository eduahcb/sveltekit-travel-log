import { env } from "$env/dynamic/private";
import { NODE_ENV } from "$env/static/private";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../../schema";

const authToken = NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN;
console.error("[db] NODE_ENV:", NODE_ENV);
console.error("[db] TURSO_DATABASE_URL:", env.TURSO_DATABASE_URL);
console.error("[db] authToken length:", authToken?.length);
console.error("[db] authToken prefix:", authToken?.slice(0, 20));

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken,
  },
  schema,
  casing: "snake_case",
});

export default db;

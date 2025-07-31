import { NODE_ENV, TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../../schema";

const db = drizzle({
  connection: {
    url: TURSO_DATABASE_URL,
    authToken: NODE_ENV === "development" ? undefined : TURSO_AUTH_TOKEN,
  },
  schema,
  casing: "snake_case",
});

export default db;

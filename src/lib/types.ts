import type { LocationInsertSchema, LocationSelectSchema } from "$lib/schema/location";
import type { auth } from "$lib/server/auth";

import type * as v from "valibot";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export type Location = v.InferInput<typeof LocationSelectSchema>;
export type LocationInsertData = v.InferInput<typeof LocationInsertSchema>;

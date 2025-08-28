import type { LocationInsertSchema } from "$lib/schema/location";
import type { auth } from "$lib/server/auth";

import type * as v from "valibot";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export type LocationInsertData = v.InferInput<typeof LocationInsertSchema>;

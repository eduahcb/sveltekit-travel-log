import type { auth } from "$lib/server/auth";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

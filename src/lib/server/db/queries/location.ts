import type { LocationInsertData } from "$lib/types";

import { location } from "$lib/schema";

import db from "$lib/server/db";

export async function insertLocation(data: LocationInsertData, slug: string, userId: number) {
  const result = await db.insert(location).values({
    ...data,
    slug,
    userId,
  }).returning();

  return result[0];
}

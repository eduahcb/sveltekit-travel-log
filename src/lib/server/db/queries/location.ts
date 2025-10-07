import type { LocationInsertData } from "$lib/types";

import { location } from "$lib/schema";

import db from "$lib/server/db";
import { eq } from "drizzle-orm";

export async function getLocations(userId: number) {
  return await db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}

export async function insertLocation(data: LocationInsertData, slug: string, userId: number) {
  const result = await db.insert(location).values({
    ...data,
    slug,
    userId,
  }).returning();

  return result[0];
}

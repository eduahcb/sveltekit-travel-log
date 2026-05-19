import type { LocationInsertData } from "$lib/types";

import { location } from "$lib/schema";

import db from "$lib/server/db";
import { and, eq } from "drizzle-orm";

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

export async function findLocation(userId: number, slug: string) {
  return await db.query.location.findFirst({
    where: and(
      eq(location.userId, userId),
      eq(location.slug, slug),
    ),
  });
}

export async function updateLocation(userId: number, slug: string, data: LocationInsertData) {
  const [updatedLocation] = await db.update(location)
    .set(data)
    .where(
      and(
        eq(location.userId, userId),
        eq(location.slug, slug),
      ),

    )
    .returning();

  return updatedLocation;
}

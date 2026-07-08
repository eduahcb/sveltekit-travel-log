import type { LocationLogImageInsertData } from "$lib/types";
import { locationLogImage } from "$lib/schema";

import db from "$lib/server/db";

import { and, eq } from "drizzle-orm";

export async function insertLocationLogImage(userId: number, locationLogId: number, data: LocationLogImageInsertData) {
  const [image] = await db.insert(locationLogImage)
    .values(
      {
        userId,
        locationLogId,
        ...data,
      },
    )
    .returning();

  return image;
}

export async function deleteLocationLogImage(userId: number, imageId: number) {
  const [image] = await db.delete(locationLogImage)
    .where(
      and(
        eq(locationLogImage.userId, userId),
        eq(locationLogImage.id, imageId),
      ),
    )
    .returning();

  return image;
}

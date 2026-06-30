import type { LocationLogImageInsertData } from "$lib/types";

import { locationLogImage } from "$lib/schema";
import db from "$lib/server/db";

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

import type { LocationLogInsertData } from "$lib/types";
import { locationLog } from "$lib/schema";

import db from "$lib/server/db";
import { and, eq } from "drizzle-orm";

export async function insertLocationLog(userId: number, locationId: number, log: LocationLogInsertData) {
  const [newLog] = await db.insert(locationLog)
    .values({
      ...log,
      userId,
      locationId,
    })
    .returning();

  return newLog;
}

export async function findLocationLog(userId: number, locationId: number) {
  return await db.query.locationLog.findFirst({
    where: and(
      eq(locationLog.id, locationId),
      eq(locationLog.userId, userId),
    ),
  });
}

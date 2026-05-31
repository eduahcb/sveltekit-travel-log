import type { LocationLogInsertData } from "$lib/types";
import { locationLog } from "$lib/schema";

import db from "$lib/server/db";

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

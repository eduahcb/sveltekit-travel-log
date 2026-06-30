import { relations } from "drizzle-orm";

import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import * as v from "valibot";

import { user } from "./auth";
import { locationLog } from "./location-log";

export const locationLogImage = sqliteTable("locationLogImage", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  width: int().notNull(),
  height: int().notNull(),
  locationLogId: int().notNull().references(() => locationLog.id, { onDelete: "cascade" }),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogImageRelations = relations(locationLogImage, ({ one }) => ({
  locationLog: one(locationLog, {
    fields: [locationLogImage.locationLogId],
    references: [locationLog.id],
  }),
}));

export const LocationLogImageSchema = v.omit(
  createInsertSchema(locationLogImage, {
    key: v.pipe(
      v.string(),
      v.regex(/^\d+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key"),
    ),
    width: v.pipe(
      v.number(),
      v.integer(),
      v.minValue(1),
    ),
    height: v.pipe(
      v.number(),
      v.integer(),
      v.minValue(1),
    ),
  }),
  ["id", "locationLogId", "userId", "createdAt", "updatedAt"],
);

export const LocationLogImageSelectSchema = createSelectSchema(locationLogImage);

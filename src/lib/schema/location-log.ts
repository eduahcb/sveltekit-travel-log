import { relations } from "drizzle-orm";

import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import * as v from "valibot";
import { user } from "./auth";
import { location } from "./location";
import { locationLogImage } from "./location-log-image";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int().notNull().references(() => location.id, { onDelete: "cascade" }),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogRelations = relations(locationLog, ({ one, many }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
  images: many(locationLogImage),
}));

export const LocationLogSchema = v.pipe(
  v.omit(
    createInsertSchema(locationLog, {
      name: v.pipe(
        v.string(),
        v.nonEmpty("name cannot be empty"),
        v.maxLength(100, "name cannot exceed 100 characters"),
      ),
      description: v.optional(
        v.pipe(
          v.string(),
          v.maxLength(100, "description cannot exceed 100 characters"),
        ),
      ),
      lat: v.pipe(
        v.number(),
        v.minValue(-90, "latitude must be at least -90"),
        v.maxValue(90, "latitude must not exceed 90"),
      ),
      long: v.pipe(
        v.number(),
        v.minValue(-180, "longitude must be at least -180"),
        v.maxValue(180, "longitude must not exceed 180",
        ),
      ),
      startedAt: v.number(),
      endedAt: v.number(),
    }),
    ["id", "userId", "locationId", "createdAt", "updatedAt"],
  ),
  v.forward(
    v.partialCheck(
      [["startedAt"], ["endedAt"]],
      (input) => input.startedAt < input.endedAt,
      "Start Date must be before End Date",
    ),
    ["startedAt"],
  ),
  v.forward(
    v.partialCheck(
      [["startedAt"], ["endedAt"]],
      (input) => input.endedAt > input.startedAt,
      "End Date must be after Start Date",
    ),
    ["endedAt"],
  ),
);

export const LocationLogSelectSchema = createSelectSchema(locationLog);

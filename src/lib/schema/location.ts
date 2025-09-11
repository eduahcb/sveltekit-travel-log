import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

import { createInsertSchema, createSelectSchema } from "drizzle-valibot";

import * as v from "valibot";

import { user } from "./auth";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId),
]);

export const LocationInsertSchema = v.omit(createInsertSchema(location, {
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
}), ["id", "slug", "userId", "createdAt", "updatedAt"]);

export const LocationSelectSchema = createSelectSchema(location);

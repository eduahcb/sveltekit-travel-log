import type { DrizzleQueryError } from "drizzle-orm/errors";

export function isNameConstraintError(error: DrizzleQueryError) {
  return error.cause?.message?.includes("UNIQUE constraint failed: location.name") ?? false;
}

export function isSlugConstraintError(error: DrizzleQueryError) {
  return error.cause?.message?.includes("UNIQUE constraint failed: location.slug") ?? false;
}

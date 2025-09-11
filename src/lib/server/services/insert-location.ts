import type { Response } from "$lib/server/utils/http-response";
import type { Location, LocationInsertData } from "$lib/types";

import type { DrizzleQueryError } from "drizzle-orm/errors";

import { insertLocation } from "$lib/server/db/queries/location";

import { InternalServerError, UniqueConstraint } from "$lib/server/errors";
import { generateUniqueSlug } from "$lib/server/utils/slug";

import slugify from "slug";

const NAME_CONSTRAINT_MESSAGE = "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.name, location.user_id";
const SLUG_CONSTRAINT_MESSAGE = "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug";
const MAX_ATTEMPTS = 3;

function isNameConstraintError(error: DrizzleQueryError) {
  return error.cause?.message === NAME_CONSTRAINT_MESSAGE;
}

function isSlugConstraintError(error: DrizzleQueryError) {
  return error.cause?.message === SLUG_CONSTRAINT_MESSAGE;
}

export class InsertLocation {
  static async execute(data: LocationInsertData, userId: number): Promise<Response<Location, Error>> {
    const baseSlug = slugify(data.name);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const slug = attempt === 1 ? baseSlug : generateUniqueSlug(baseSlug);

      try {
        const created = await insertLocation(data, slug, userId);

        return { success: true, value: created };
      } catch (err) {
        const error = err as DrizzleQueryError;

        if (isNameConstraintError(error)) {
          return { success: false, value: new UniqueConstraint("A location with this name already exists.") };
        }

        if (isSlugConstraintError(error)) {
          if (attempt === MAX_ATTEMPTS) {
            return { success: false, value: new UniqueConstraint("Unable to create a unique address for this location. Try another name.") };
          }
        }
      }
    }
    return { success: false, value: new InternalServerError("Internal server error: \"Failed to create location. Please try again") };
  }
}

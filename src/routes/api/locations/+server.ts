import type { DrizzleQueryError } from "drizzle-orm/errors";

import { location } from "$lib/schema";

import { LocationInsertSchema } from "$lib/schema/location";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";

import db from "$lib/server/db";

import { formatValibotIssues } from "$lib/utils/valibot-format-error";
import { json } from "@sveltejs/kit";

import slugify from "slug";
import * as v from "valibot";

export const POST = AuthenticatedRequestHandler(async ({ request, locals }) => {
  const body = await request.json();

  const result = v.safeParse(LocationInsertSchema, body);

  if (!result.success) {
    return json(formatValibotIssues(result.issues), {
      status: 400,
    });
  }

  const validatedData = result.output;
  const slug = slugify(validatedData.name);
  const userId = Number(locals.session?.user.id);

  try {
    const [created] = await db.insert(location).values({
      ...validatedData,
      slug,
      userId,
    }).returning();

    return json(created, { status: 201 });
  } catch (e) {
    const error = e as DrizzleQueryError;

    if (error.cause?.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
      return json({ message: "Slug must be unique (the location name is used to generate the slug)." }, { status: 409 });
    }

    return json({ message: "An unexpected error occurred while adding the location." }, { status: 500 });
  }
});

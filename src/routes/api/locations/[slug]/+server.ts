import type { DrizzleQueryError } from "drizzle-orm/errors";
import type { RequestHandler } from "./$types";
import { LocationInsertSchema } from "$lib/schema";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";
import { deleteLocation, findLocation, updateLocation } from "$lib/server/db/queries/location";
import { isNameConstraintError } from "$lib/server/utils/constraints";
import { formatValibotIssues } from "$lib/utils/valibot-format-error";
import { json } from "@sveltejs/kit";
import * as v from "valibot";

export const GET: RequestHandler = AuthenticatedRequestHandler(async ({ params, locals }) => {
  const userId = Number(locals.session?.user.id);

  const { slug } = params;

  try {
    const location = await findLocation(userId, slug);

    if (!location) {
      return json({
        msg: "Location not found",
      }, {
        status: 404,
      });
    }

    return json({ location });
  } catch {
    return json({
      msg: "Internal server error",
    }, {
      status: 500,
    });
  }
});

export const PUT: RequestHandler = AuthenticatedRequestHandler(async ({ params, locals, request }) => {
  const userId = Number(locals.session?.user.id);

  const body = await request.json();
  const { slug } = params;

  const result = v.safeParse(LocationInsertSchema, body);

  if (!result.success) {
    return json(formatValibotIssues(result.issues), {
      status: 400,
    });
  }

  const validatedData = result.output;

  try {
    const location = await updateLocation(userId, slug, validatedData);

    if (!location) {
      return json({
        msg: "Location not found",
      }, {
        status: 404,
      });
    }

    return json({ location });
  } catch (err) {
    const error = err as DrizzleQueryError;

    if (isNameConstraintError(error)) {
      return json({ msg: "A location with this name already exists." }, { status: 409 });
    }

    return json({
      msg: "Internal server error",
    }, { status: 500 });
  }
});

export const DELETE: RequestHandler = AuthenticatedRequestHandler(async ({ params, locals }) => {
  const userId = Number(locals.session?.user.id);
  const { slug } = params;

  try {
    const location = await deleteLocation(userId, slug);

    if (!location) {
      return json({
        msg: "Location not found",
      }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch {
    return json({

      msg: "Internal server error",
    }, { status: 500 });
  }
});

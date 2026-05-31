import type { RequestHandler } from "./$types";
import { LocationLogSchema } from "$lib/schema";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";
import { findLocation } from "$lib/server/db/queries/location";
import { insertLocationLog } from "$lib/server/db/queries/location-log";
import { formatValibotIssues } from "$lib/utils/valibot-format-error";
import { json } from "@sveltejs/kit";
import * as v from "valibot";

export const POST: RequestHandler = AuthenticatedRequestHandler(async ({ request, locals, params }) => {
  const body = await request.json();
  const slug = params.slug;

  const result = v.safeParse(LocationLogSchema, body);

  if (!result.success) {
    return json(formatValibotIssues(result.issues), {
      status: 400,
    });
  }

  const validatedData = result.output;
  const userId = Number(locals.session!.user.id);

  const location = await findLocation(userId, slug);

  if (!location) {
    return json({
      msg: "Location not found",
    }, {
      status: 404,
    });
  }

  try {
    const newLog = await insertLocationLog(userId, location.id, validatedData);
    return json({ log: newLog }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return json({
      msg: "Internal server error",
    }, {
      status: 500,
    });
  }
});

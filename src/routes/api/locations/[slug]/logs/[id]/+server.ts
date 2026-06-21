import type { RequestHandler } from "./$types";
import { LocationLogSchema } from "$lib/schema";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";
import { findLocationLog, updateLocationLog } from "$lib/server/db/queries/location-log";

import { formatValibotIssues } from "$lib/utils/valibot-format-error";
import { json } from "@sveltejs/kit";
import * as v from "valibot";

export const GET: RequestHandler = AuthenticatedRequestHandler(async ({ locals, params }) => {
  const id = params.id;
  const userId = Number(locals.session!.user.id);

  try {
    const log = await findLocationLog(userId, Number(id));

    if (!log) {
      return json({
        msg: "Log not found",
      }, {
        status: 404,
      });
    }

    return json({
      log,
    });
  } catch (err: any) {
    console.error(err);
    return json({
      msg: "Internal server error",
    }, {
      status: 500,
    });
  }
});

export const PUT: RequestHandler = AuthenticatedRequestHandler(async ({ request, locals, params }) => {
  const id = params.id;
  const userId = Number(locals.session!.user.id);
  const body = await request.json();

  const result = v.safeParse(LocationLogSchema, body);

  if (!result.success) {
    return json(formatValibotIssues(result.issues), {
      status: 400,
    });
  }

  const validatedData = result.output;

  try {
    const updatedLog = await updateLocationLog(userId, Number(id), validatedData);

    if (!updatedLog) {
      return json({
        msg: "Log not found",
      }, {
        status: 404,
      });
    }

    return json({
      log: updatedLog,
    });
  }
  catch {
    return json({
      msg: "Internal server error",
    }, {
      status: 500,
    });
  }
});

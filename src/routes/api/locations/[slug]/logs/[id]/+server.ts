import type { RequestHandler } from "./$types";
import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";
import { findLocationLog } from "$lib/server/db/queries/location-log";
import { json } from "@sveltejs/kit";

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

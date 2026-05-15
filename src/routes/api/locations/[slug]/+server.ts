import { AuthenticatedRequestHandler } from "$lib/server/auth-request-handler";
import { findLocation } from "$lib/server/db/queries/location";
import { json } from "@sveltejs/kit";

export const GET = AuthenticatedRequestHandler(async ({ params, locals }) => {
  const userId = Number(locals.session?.user.id);

  const { slug } = params;

  const location = await findLocation(userId, slug);

  if (!location) {
    return json({
      msg: "slug not found",
    }, {
      status: 404,
    });
  }

  return json({ location });
});

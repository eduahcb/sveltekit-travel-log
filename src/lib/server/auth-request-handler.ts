import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

export function AuthenticatedRequestHandler(handler: RequestHandler) {
  return async (event: RequestEvent) => {
    const session = event.locals.session;

    if (!session?.user) {
      error(401, "Unauthorized: No user session found");
    }

    return await handler(event);
  };
}

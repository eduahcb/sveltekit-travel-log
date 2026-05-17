import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

export function AuthenticatedRequestHandler<P extends Partial<Record<string, string>>>(
  handler: RequestHandler<P>,
) {
  return async (event: RequestEvent<P>): Promise<Response> => {
    const session = event.locals.session;

    if (!session?.user) {
      error(401, "Unauthorized: No user session found");
    }

    return await handler(event);
  };
}

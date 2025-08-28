import type { Handle } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";

import { redirect } from "@sveltejs/kit";

import { svelteKitHandler } from "better-auth/svelte-kit";

export const handle: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  event.locals.session = session;

  if (event.url.pathname.startsWith("/dashboard") && !session?.user) {
    redirect(302, "/");
  }

  return svelteKitHandler({ event, auth, resolve });
};

import type { Handle } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";

import { redirect } from "@sveltejs/kit";

import { svelteKitHandler } from "better-auth/svelte-kit";

export const handle: Handle = async ({ event, resolve }) => {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: event.request.headers,
    });
  } catch {
    if (event.url.pathname !== "/")
      redirect(302, "/");
  }

  event.locals.session = session;

  if (event.url.pathname.startsWith("/dashboard") && !session?.user) {
    redirect(302, "/");
  }

  return svelteKitHandler({ event, auth, resolve });
};

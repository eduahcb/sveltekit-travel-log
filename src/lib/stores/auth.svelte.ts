import type { Session } from "$lib/types";
import { goto } from "$app/navigation";

import { authClient } from "$lib/aut-client";

export function createAuthStore(session: Session) {
  let user = $state(session?.user || null);

  let loading = $state(false);

  const signIn = async () => {
    loading = true;

    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    });

    loading = false;
  };

  const signOut = async () => {
    loading = true;
    await authClient.signOut();

    loading = false;
    user = null;

    goto("/");
  };

  return {
    get user() {
      return user;
    },
    get loading() {
      return loading;
    },
    signIn,
    signOut,
  };
}

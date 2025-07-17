import type { Session } from "$lib/types";
import { goto } from "$app/navigation";

import { authClient } from "$lib/aut-client";

export function createAuthStore(session: Session) {
  const user = $state({ value: session?.user || null });

  const loading = $state({ value: false });

  const signIn = async () => {
    loading.value = true;

    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
    });

    loading.value = false;
  };

  const signOut = async () => {
    loading.value = true;
    await authClient.signOut();

    loading.value = false;
    user.value = null;

    goto("/");
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}

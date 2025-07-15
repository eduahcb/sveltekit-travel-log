import { goto } from "$app/navigation";
import { createAuthClient } from "better-auth/svelte"; // make sure to import from better-auth/svelte

export const authClient = createAuthClient({});

export async function signIn() {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
    errorCallbackURL: "/error",
  });
}

export async function signOut() {
  await authClient.signOut();
  goto("/");
}

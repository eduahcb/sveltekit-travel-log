import type { createAuthStore } from "$lib/stores/auth.svelte";

import { getContext, setContext } from "svelte";

type Store = ReturnType<typeof createAuthStore>;

const AUTH_CONTEXT_KEY = "authContext";

export function setAuthContext(store: Store) {
  return setContext(AUTH_CONTEXT_KEY, store);
}

export function getAuthContext(): Store {
  return getContext(AUTH_CONTEXT_KEY) as Store;
}

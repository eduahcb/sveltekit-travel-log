import type { createThemeStore } from "$lib/stores/theme.svelte";

import { getContext, setContext } from "svelte";

type Store = ReturnType<typeof createThemeStore>;

const THEME_CONTEXT_KEY = "themeStore";

export function setThemeContext(store: Store) {
  setContext(THEME_CONTEXT_KEY, () => store);
}

export function getThemeContext(): () => Store {
  return getContext(THEME_CONTEXT_KEY) as () => Store;
}

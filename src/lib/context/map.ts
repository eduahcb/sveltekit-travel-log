import type { createMapStore } from "$lib/stores/map.svelte";

import { getContext, setContext } from "svelte";

type Store = ReturnType<typeof createMapStore>;

const MAP_CONTEXT_KEY = "mapContext";

export function setMapContext(store: Store) {
  setContext(MAP_CONTEXT_KEY, store);
}

export function getMapContext(): Store {
  return getContext(MAP_CONTEXT_KEY) as Store;
}

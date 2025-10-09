import type { Location } from "$lib/types";
import { getContext, setContext } from "svelte";

type Store = () => Location[];

const LOCATION_CONTEXT_KEY = "locationStore";

export function setLocationContext(store: Store) {
  setContext(LOCATION_CONTEXT_KEY, store);
}

export function getLocationContext(): Store {
  return getContext(LOCATION_CONTEXT_KEY) as Store;
}

import type { LocationInsertData } from "$lib/types";

import ky from "ky";

export async function fetchCreateLocation(location: LocationInsertData) {
  return await ky.post("/api/locations", { json: location }).json();
}

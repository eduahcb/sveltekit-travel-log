import type { LocationInsertData } from "$lib/types";

import ky from "ky";

export async function fetchCreateLocation(location: LocationInsertData) {
  return await ky.post("/api/locations", { json: location }).json();
}

export async function fetchUpdateLocation({ slug, location }: { slug: string; location: LocationInsertData }) {
  return await ky.put(`/api/locations/${slug}`, { json: location }).json();
}

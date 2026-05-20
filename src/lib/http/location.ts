import type { LocationInsertData } from "$lib/types";
import { api } from "$lib/http/client";

export async function fetchCreateLocation(location: LocationInsertData) {
  return await api.post("/api/locations", { json: location }).json();
}

export async function fetchUpdateLocation({ slug, location }: { slug: string; location: LocationInsertData }) {
  return await api.put(`/api/locations/${slug}`, { json: location }).json();
}

export async function fetchDeleteLocation(slug: string) {
  await api.delete(`/api/locations/${slug}`);
}

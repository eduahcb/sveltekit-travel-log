import type { LocationLogInsertData } from "$lib/types";
import { api } from "./client";

export async function fetchCreateLocationLog(log: LocationLogInsertData, slug: string) {
  return await api.post(`/api/locations/${slug}/logs`, { json: log }).json();
}

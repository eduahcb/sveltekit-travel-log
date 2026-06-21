import type { LocationLogInsertData } from "$lib/types";
import { api } from "./client";

export async function fetchCreateLocationLog(log: LocationLogInsertData, slug: string) {
  return await api.post(`/api/locations/${slug}/logs`, { json: log }).json();
}

export async function fetchUpdateLocationLog(log: LocationLogInsertData, slug: string, id: number) {
  return await api.put(`/api/locations/${slug}/logs/${id}`, { json: log }).json();
}

export async function fetchDeleteLocationLog(slug: string, id: number) {
  return await api.delete(`/api/locations/${slug}/logs/${id}`).json();
}

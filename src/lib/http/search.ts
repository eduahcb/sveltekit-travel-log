import type { SearchResult } from "$lib/types";
import { api } from "$lib/http/client";

interface Response {
  locations: SearchResult[];
}
export async function fetchSearchLocations(search: string): Promise<Response> {
  return await api.get("/api/search", {
    searchParams: {
      q: search,
    },
  }).json();
}

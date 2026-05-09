import type { SearchResult } from "$lib/types";
import ky from "ky";

interface Response {
  locations: SearchResult[];
}
export async function fetchSearchLocations(search: string): Promise<Response> {
  return await ky.get("/api/search?q", {
    searchParams: {
      q: search,
    },
  }).json();
}

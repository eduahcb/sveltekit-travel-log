import type { LocationWithLogs } from "$lib/types";
import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ fetch, params }) => {
  const slug = params.slug;

  const response = await fetch(`/api/locations/${slug}`);

  if (!response.ok) {
    const body = await response.json();
    error(response.status, body);
  }

  const data = await response.json();
  const location = data.location as LocationWithLogs;

  return {
    location,
  };
};

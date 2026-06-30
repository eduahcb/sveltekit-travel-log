import type { LocationLogWithImages } from "$lib/types";
import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ fetch, params }) => {
  const slug = params.slug;
  const id = params.id;

  const response = await fetch(`/api/locations/${slug}/logs/${id}`);

  if (!response.ok) {
    const body = await response.json();
    error(response.status, body);
  }

  const data = await response.json();
  const log = data.log as LocationLogWithImages;

  return {
    log,
  };
};

import type { Location } from "$lib/types";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch }) => {
  const response = await fetch("/api/locations");

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  const data = await response.json();

  return {
    locations: data.locations as Location[],
  };
};

import type { Location, MapPoint } from "$lib/types";

export function createMapPointFromLocation(location: Location, to: string): MapPoint {
  return {
    ...location,
    to,
  };
}

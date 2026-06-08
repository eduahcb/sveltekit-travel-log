import type { Location, LocationLog, MapPoint } from "$lib/types";

export function createMapPointFromLocation(location: Location | LocationLog, to: string): MapPoint {
  return {
    ...location,
    to,
  };
}

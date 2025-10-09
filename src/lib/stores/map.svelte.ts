import type { Location } from "$lib/types";
import type { LngLatLike, Map } from "maplibre-gl";

import { CENTER_BRASIL } from "$lib/constants";

import { getLocationContext } from "$lib/context/location";

import maplibregl from "maplibre-gl";

// eslint-disable-next-line ts/consistent-type-definitions
type MapStore = {
  map: Map | undefined;
  mapPoints: () => Location[];
  initMap: () => void;
};

export function createMapStore() {
  const locationStore = getLocationContext();

  const mapStore = $state<MapStore>({
    map: undefined,
    mapPoints: () => locationStore(),
    initMap: () => {
      const points = mapStore.mapPoints();

      const firstPoint = points[0];

      if (!firstPoint) {
        return mapStore.map?.flyTo({
          center: CENTER_BRASIL as LngLatLike,
          zoom: 2,
        });
      }

      const bounds = points.reduce((bound, point) => {
        return bound.extend([point.long, point.lat]);
      }, new maplibregl.LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat]));

      mapStore.map?.fitBounds(bounds, {
        padding: 80,
        maxZoom: 8,
      });
    },
  });

  return mapStore;
}

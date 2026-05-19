import type { MapPoint } from "$lib/types";
import type { LngLatLike, Map } from "maplibre-gl";

import { CENTER_BRASIL } from "$lib/constants";
import maplibregl from "maplibre-gl";

// eslint-disable-next-line ts/consistent-type-definitions
type MapStore = {
  map: Map | undefined;
  mapPoints: () => MapPoint[];
  selectedPoint: MapPoint | undefined;
  addMarker: LngLatLike;
  showAddMarker: boolean;
  initMap: () => void;
  flyToAddMarker: () => void;
  resetAddMarker: () => void;
};

export function createMapStore(store: () => MapPoint[]) {
  const mapStore = $state<MapStore>({
    map: undefined,
    mapPoints: () => store(),
    selectedPoint: undefined,
    addMarker: CENTER_BRASIL as LngLatLike,
    showAddMarker: false,
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
    flyToAddMarker: () => {
      mapStore.map?.flyTo({
        center: mapStore.addMarker,
        zoom: 12,
        minZoom: 3,
      });
    },
    resetAddMarker: () => {
      mapStore.showAddMarker = false;
      mapStore.addMarker = CENTER_BRASIL as LngLatLike;

      mapStore.initMap();
    },
  });

  return mapStore;
}

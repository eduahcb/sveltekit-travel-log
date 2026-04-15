import type { MapPoint } from "$lib/types";
import type { LngLatLike, Map } from "maplibre-gl";

import { CENTER_BRASIL } from "$lib/constants";

import { getLocationContext } from "$lib/context/location";

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

export function createMapStore() {
  const locationStore = getLocationContext();

  const mapPoints = $derived.by<MapPoint[]>(() => {
    return locationStore().map(location => {
      return {
        ...location,
        to: `/dashboard/location/${location.slug}`,
      };
    });
  });

  const mapStore = $state<MapStore>({
    map: undefined,
    mapPoints: () => mapPoints,
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
        zoom: 6,
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

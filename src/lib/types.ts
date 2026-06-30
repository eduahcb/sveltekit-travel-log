import type { LocationInsertSchema, LocationSelectSchema } from "$lib/schema/location";
import type { LocationLogSchema, LocationLogSelectSchema } from "$lib/schema/location-log";
import type { LocationLogImageSchema, LocationLogImageSelectSchema } from "$lib/schema/location-log-image";
import type { auth } from "$lib/server/auth";

import type * as v from "valibot";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export type Location = v.InferInput<typeof LocationSelectSchema>;
export type LocationLog = v.InferInput<typeof LocationLogSelectSchema>;
export type LocationLogImage = v.InferInput<typeof LocationLogImageSelectSchema>;

export type LocationWithLogs = Location & {
  locationLogs: LocationLog[];
};

export type LocationLogWithImages = LocationLog & {
  images: LocationLogImage[];
};

export type LocationInsertData = v.InferInput<typeof LocationInsertSchema>;
export type LocationLogInsertData = v.InferInput<typeof LocationLogSchema>;
export type LocationLogImageInsertData = v.InferInput<typeof LocationLogImageSchema>;

export type MapPoint = (Location | LocationLog) & {
  to: string;
};

export interface SidebarItem {
  id: string;
  mapPoint: MapPoint;
}

// eslint-disable-next-line ts/consistent-type-definitions
export type SearchResult = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
};

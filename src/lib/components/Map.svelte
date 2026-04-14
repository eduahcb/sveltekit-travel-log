<script lang="ts">
  import type { LngLatLike } from "maplibre-gl";
  import { CENTER_BRASIL, ZOOM_MAP } from "$lib/constants";

  import { getMapContext } from "$lib/context/map";
  import { getThemeContext } from "$lib/context/theme";

  import { MapPin } from "@lucide/svelte";

  import { untrack } from "svelte";

  import {
    MapLibre,
    Marker,
    NavigationControl,
    Popup,
  } from "svelte-maplibre-gl";

  const themeStore = getThemeContext();
  const mapStore = getMapContext();

  const theme = $derived(themeStore().theme);

  $effect(() => {
    mapStore.initMap();
  });

  $effect(() => {
    if (mapStore.showAddMarker) {
      untrack(() => {
        mapStore.flyToAddMarker();
      });
    }
  });
</script>

<MapLibre
  bind:map={mapStore.map}
  center={CENTER_BRASIL as LngLatLike}
  zoom={ZOOM_MAP}
  class="w-full h-full"
  style={theme === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty"}
>
  <NavigationControl />

  {#if mapStore.showAddMarker}
    <Marker bind:lnglat={mapStore.addMarker} draggable>
      {#snippet content()}
        <MapPin class="fill-primary-500" size={32} />
      {/snippet}
    </Marker>
  {/if}

  {#each mapStore.mapPoints() as point (point.id)}
    {@const isHovered = point.id === mapStore.selectedPoint?.id}
    <Marker lnglat={{ lng: point.long, lat: point.lat }}>
      {#snippet content()}
        <MapPin
          size={32}
          class={[isHovered ? "fill-primary-500" : "fill-tertiary-500"]}
          onmouseenter={() => {
            mapStore.selectedPoint = {
              ...point,
              zoom: false,
            };
          }}
        />
      {/snippet}

      <Popup class="text-black" open={isHovered} closeButton={false}>
        <a href={point.to} class="text-sm anchor">
          {point.name}
        </a>
      </Popup>
    </Marker>
  {/each}
</MapLibre>

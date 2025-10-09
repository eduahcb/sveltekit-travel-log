<script lang="ts">
  import type { LngLatLike } from "maplibre-gl";
  import { CENTER_BRASIL, ZOOM_MAP } from "$lib/constants";

  import { getMapContext } from "$lib/context/map";
  import { getThemeContext } from "$lib/context/theme";

  import { MapPin } from "@lucide/svelte";

  import { MapLibre, Marker, NavigationControl } from "svelte-maplibre-gl";

  const themeStore = getThemeContext();
  const mapStore = getMapContext();

  const theme = $derived(themeStore().theme);

  $effect(() => {
    mapStore.initMap();
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

  {#each mapStore.mapPoints() as point (point.id)}
    <Marker lnglat={{ lng: point.long, lat: point.lat }}>
      {#snippet content()}
        <MapPin size={32} class="fill-tertiary-500" />
      {/snippet}
    </Marker>
  {/each}
</MapLibre>

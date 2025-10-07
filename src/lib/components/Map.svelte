<script lang="ts">
  import { getThemeContext } from "$lib/context/theme";
  import { MapLibre, NavigationControl } from "svelte-maplibre-gl";

  const themeStore = getThemeContext();

  const theme = $derived(themeStore().theme);
</script>

<MapLibre
  class="w-full h-full"
  style={theme === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty"}
>
  <NavigationControl />
</MapLibre>

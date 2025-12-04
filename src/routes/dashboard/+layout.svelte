<script lang="ts">
  import type { LayoutProps } from "./$types";
  import { page } from "$app/state";

  import MapApp from "$lib/components/Map.svelte";

  import NavItem from "$lib/components/NavItem.svelte";
  import { setLocationContext } from "$lib/context/location";
  import { setMapContext } from "$lib/context/map";

  import { createMapStore } from "$lib/stores/map.svelte";

  import { LogOut, Map, MapPin, Menu, Plus } from "@lucide/svelte";
  import { Navigation } from "@skeletonlabs/skeleton-svelte";

  const { children, data }: LayoutProps = $props();

  setLocationContext(() => data.locations);

  let isExpansed = $state(true);
  const isDashboard = $derived(page.url.pathname === "/dashboard");

  function toggleExpanded() {
    isExpansed = !isExpansed;
  }
  // need location store
  const mapStore = createMapStore();
  setMapContext(mapStore);

  const hasPoints = $derived(mapStore.mapPoints().length > 0);
</script>

<main class="flex-1 flex gap-1">
  <div>
    <Navigation.Rail
      expanded={isExpansed}
      base="flex flex-col gap-5"
      tilesBase="flex flex-col border-b-1 pb-2"
      tilesGap="gap-3"
    >
      {#snippet header()}
        <Navigation.Tile
          onclick={toggleExpanded}
          title="Toggle Menu Width"
          aspect="auto"
        >
          <Menu />
        </Navigation.Tile>
      {/snippet}

      {#snippet tiles()}
        <NavItem href="/dashboard" label="Locations">
          <Map />
        </NavItem>

        <NavItem href="/dashboard/add" label="Add Location">
          <Plus />
        </NavItem>

        {#if hasPoints}
          <hr class="hr border-white" />
        {/if}

        {#each mapStore.mapPoints() as point (point.id)}
          <NavItem
            href={point.to}
            label={point.name}
            onmousenter={() => {
              mapStore.selectedPoint = point;
            }}
            onmouseleave={() => {
              mapStore.selectedPoint = undefined;
            }}
          >
            {@const isHovered = mapStore.selectedPoint?.id === point.id}
            <MapPin
              class={[
                "group-hover:fill-primary-500",
                isHovered && "fill-primary-500",
              ]}
            />
          </NavItem>
        {/each}
      {/snippet}

      {#snippet footer()}
        <NavItem href="/sign-out" label="Sign Out">
          <LogOut />
        </NavItem>
      {/snippet}
    </Navigation.Rail>
  </div>
  <div
    class={[
      "flex-1 grid",
      isDashboard
        ? "grid-cols-1 grid-rows-[30%_70%]"
        : "grid-cols-[400px_auto]",
    ]}
  >
    <div class="p-1 overflow-y-auto">
      {@render children()}
    </div>
    <div class="p-1">
      <MapApp />
    </div>
  </div>
</main>

<script lang="ts">
  import type { Location, SidebarItem } from "$lib/types";
  import type { LayoutProps } from "./$types";

  import { page } from "$app/state";

  import MapApp from "$lib/components/Map.svelte";
  import NavItem from "$lib/components/NavItem.svelte";

  import { SIDE_BY_SIDE_ROUTES } from "$lib/constants";
  import { setMapContext } from "$lib/context/map";

  import { createMapStore } from "$lib/stores/map.svelte";
  import { createMapPointFromLocation } from "$lib/utils/map";
  import { LogOut, Map, MapPin, Menu, Plus } from "@lucide/svelte";
  import { Navigation } from "@skeletonlabs/skeleton-svelte";

  const { children }: LayoutProps = $props();

  let isExpanded = $state(true);
  const isSideBySide = $derived(SIDE_BY_SIDE_ROUTES.has(page.route.id ?? ""));
  const locations = $derived<Location[] | undefined>(page.data.locations);

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  const sidebarItems = $derived.by<SidebarItem[]>(() => {
    if (page.route.id === "/dashboard") {
      return (
        locations?.map((location) => {
          return {
            id: `location-${location.id}`,
            mapPoint: createMapPointFromLocation(
              location,
              `/dashboard/location/${location.slug}`,
            ),
          };
        }) ?? []
      );
    }

    return [];
  });

  const mapStore = createMapStore(() => sidebarItems);
  setMapContext(mapStore);
</script>

<main class="flex-1 flex gap-1">
  <div>
    <Navigation.Rail
      expanded={isExpanded}
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

        {#if sidebarItems.length > 0}
          <hr class="hr border-white" />
        {/if}

        {#each sidebarItems as item (item.id)}
          <NavItem
            href={item.mapPoint.to}
            label={item.mapPoint.name}
            onmouseenter={() => {
              mapStore.selectedPoint = item.mapPoint;
            }}
            onmouseleave={() => {
              mapStore.selectedPoint = undefined;
            }}
          >
            {@const isHovered = mapStore.selectedPoint?.id === item.mapPoint.id}
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
      isSideBySide
        ? "grid-cols-[400px_auto]"
        : "grid-cols-1 grid-rows-[30%_70%]",
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

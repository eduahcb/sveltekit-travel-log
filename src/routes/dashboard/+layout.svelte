<script lang="ts">
  import type {
    Location,
    LocationWithLogs,
    MapPoint,
    SidebarItem,
  } from "$lib/types";
  import type { LayoutProps } from "./$types";

  import { page } from "$app/state";

  import DashboardNavItems from "$lib/components/DashboardNavItems.svelte";
  import LocationNavItems from "$lib/components/LocationNavItems.svelte";

  import MapApp from "$lib/components/Map.svelte";
  import NavItem from "$lib/components/NavItem.svelte";

  import { SIDE_BY_SIDE_ROUTES } from "$lib/constants";
  import { setMapContext } from "$lib/context/map";
  import { createMapStore } from "$lib/stores/map.svelte";
  import { createMapPointFromLocation } from "$lib/utils/map";
  import { LogOut, Menu } from "@lucide/svelte";
  import { Navigation } from "@skeletonlabs/skeleton-svelte";

  const { children }: LayoutProps = $props();

  let isExpanded = $state(true);
  const isSideBySide = $derived(SIDE_BY_SIDE_ROUTES.has(page.route.id ?? ""));
  const locations = $derived<Location[] | undefined>(page.data.locations);
  const location = $derived<LocationWithLogs | undefined>(page.data.location);

  const navGroup = $derived.by(() => {
    const id = page.route.id ?? "";
    if (id === "/dashboard" || id === "/dashboard/add") {
      return "dashboard";
    }
    if (id.startsWith("/dashboard/location/")) {
      return "location";
    }

    return null;
  });

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  const sidebarItems = $derived.by<SidebarItem[]>(() => {
    if (navGroup === "location" && location) {
      return location.locationLogs.map((l) => ({
        id: `item-${l.id}`,
        mapPoint: createMapPointFromLocation(
          l,
          `/dashboard/location/${location.slug}/${l.id}`,
        ),
      }));
    }

    if (navGroup === "dashboard" && locations && locations.length > 0) {
      return locations.map((l) => ({
        id: `item-${l.slug}`,
        mapPoint: createMapPointFromLocation(
          l,
          `/dashboard/location/${l.slug}`,
        ),
      }));
    }

    return [];
  });

  const mapPoints = $derived.by<MapPoint[]>(() => {
    if (navGroup === "dashboard")
      return sidebarItems.map((item) => item.mapPoint);

    if (navGroup === "location" && location) {
      const locationMapPoint = createMapPointFromLocation(
        location,
        `/dashboard/location/${location.slug}`,
      );

      return location.locationLogs.length > 0
        ? sidebarItems.map((item) => item.mapPoint)
        : [locationMapPoint];
    }
    return [];
  });

  const mapStore = createMapStore(() => mapPoints);
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
        {#if navGroup === "dashboard"}
          <DashboardNavItems {sidebarItems} />
        {:else if navGroup === "location"}
          <LocationNavItems {location} {sidebarItems} />
        {/if}
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

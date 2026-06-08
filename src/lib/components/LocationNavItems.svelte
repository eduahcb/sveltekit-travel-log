<script lang="ts">
  import type { Location, SidebarItem } from "$lib/types";
  import NavItem from "$lib/components/NavItem.svelte";

  import { getMapContext } from "$lib/context/map";
  import { ArrowLeft, Map, MapPin, Plus } from "@lucide/svelte";

  type Props = {
    sidebarItems: SidebarItem[];
    location: Location | undefined;
  };

  const { location, sidebarItems }: Props = $props();

  const mapStore = getMapContext();
</script>

<NavItem href="/dashboard" label="Back to locations">
  <ArrowLeft />
</NavItem>

{#if location}
  <NavItem
    href={`/dashboard/location/${location.slug}`}
    label={location?.name ?? ""}
  >
    <Map />
  </NavItem>

  <NavItem
    href={`/dashboard/location/${location.slug}/edit`}
    label="Edit Location"
  >
    <MapPin />
  </NavItem>

  <NavItem
    href={`/dashboard/location/${location.slug}/add`}
    label="Add Location Log"
  >
    <Plus />
  </NavItem>
{/if}

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
      class={["group-hover:fill-primary-500", isHovered && "fill-primary-500"]}
    />
  </NavItem>
{/each}

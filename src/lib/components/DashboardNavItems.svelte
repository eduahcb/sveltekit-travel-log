<script lang="ts">
  import type { SidebarItem } from "$lib/types";
  import NavItem from "$lib/components/NavItem.svelte";
  import { getMapContext } from "$lib/context/map";

  import { Map, MapPin, Plus } from "@lucide/svelte";

  type Props = {
    sidebarItems: SidebarItem[];
  };

  const { sidebarItems }: Props = $props();
  const mapStore = getMapContext();
</script>

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
      class={["group-hover:fill-primary-500", isHovered && "fill-primary-500"]}
    />
  </NavItem>
{/each}

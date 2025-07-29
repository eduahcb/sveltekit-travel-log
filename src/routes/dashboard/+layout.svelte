<script lang="ts">
  import NavItem from "$lib/components/NavItem.svelte";

  import { LogOut, Map, Menu, Plus } from "@lucide/svelte";
  import { Navigation } from "@skeletonlabs/skeleton-svelte";

  const { children } = $props();

  let isExpansed = $state(true);

  function toggleExpanded() {
    isExpansed = !isExpansed;
  }
</script>

<main class="flex-1 flex gap-4">
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
        <NavItem href="#" label="Locations">
          <Map />
        </NavItem>

        <NavItem href="#" label="Add Location">
          <Plus />
        </NavItem>
      {/snippet}

      {#snippet footer()}
        <NavItem href="#" label="Sign Out">
          <LogOut />
        </NavItem>
      {/snippet}
    </Navigation.Rail>
  </div>
  <div class="flex-1">
    {@render children()}
  </div>
</main>

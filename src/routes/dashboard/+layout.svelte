<script lang="ts">
  import { page } from "$app/state";
  import NavItem from "$lib/components/NavItem.svelte";

  import { LogOut, Map, Menu, Plus } from "@lucide/svelte";
  import { Navigation } from "@skeletonlabs/skeleton-svelte";

  const { children } = $props();

  let isExpansed = $state(true);

  function toggleExpanded() {
    isExpansed = !isExpansed;
  }

  const isDashboard = $derived(page.url.pathname === "/dashboard");
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
    <div class="p-1"></div>
  </div>
</main>

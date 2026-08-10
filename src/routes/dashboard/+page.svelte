<script lang="ts">
  import { navigating } from "$app/state";

  import LocationCard from "$lib/components/LocationCard.svelte";
  import { getMapContext } from "$lib/context/map";
  import { LoaderCircle, Plus } from "@lucide/svelte";

  const mapStore = getMapContext();

  const hasPoints = $derived(mapStore.mapPoints().length > 0);
  const isNavigatingToAdd = $derived(
    navigating.to?.url.pathname === "/dashboard/add",
  );
</script>

<h1 class="h4 mb-4">Locations</h1>

<div class={[hasPoints && "flex gap-2 w-full"]}>
  {#each mapStore.mapPoints() as point (point.id)}
    <LocationCard {point} />
  {:else}
    <p class="text my-3">Add a location to get started</p>

    <a href="/dashboard/add" class="btn preset-filled-primary-500">
      Add a location
      {#if isNavigatingToAdd}
        <LoaderCircle class="animate-spin" />
      {:else}
        <Plus />
      {/if}
    </a>
  {/each}
</div>

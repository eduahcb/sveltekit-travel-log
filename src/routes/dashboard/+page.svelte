<script lang="ts">
  import { page } from "$app/state";
  import LocationCard from "$lib/components/LocationCard.svelte";

  import { Plus } from "@lucide/svelte";

  const hasLocations = page.data.locations.length > 0;
</script>

<h1 class="h4 mb-4">Locations</h1>

<div class={[hasLocations && "flex gap-2 w-full"]}>
  {#each page.data.locations as location (location.id)}
    <LocationCard {location} />
  {:else}
    <p class="text my-3">Add a location to get started</p>

    <a href="/dashboard/add" class="btn preset-filled-primary-500">
      Add a location
      <Plus />
    </a>
  {/each}
</div>

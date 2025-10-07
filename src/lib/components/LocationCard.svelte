<script lang="ts">
  import type { Location } from "$lib/types";

  type LocationCardProps = {
    location: Location;
  };

  const { location }: LocationCardProps = $props();
</script>

<a href="#">
  <div
    class="card preset-filled-surface-100-900 p-4 w-72 h-40 hover:preset-outlined-primary-500"
  >
    <p class="text-lg mb-1">{location.name}</p>
    <p class="text-sm">{location.description}</p>
  </div>
</a>

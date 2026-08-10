<script lang="ts">
  import type { MapPoint } from "$lib/types";

  import { navigating } from "$app/state";

  import { getMapContext } from "$lib/context/map";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";

  type LocationCardProps = {
    point: MapPoint;
  };

  const { point }: LocationCardProps = $props();

  const mapStore = getMapContext();

  const isHovered = $derived(point.id === mapStore.selectedPoint?.id);
  const isNavigatingToPoint = $derived(navigating.to?.url.pathname === point.to);
</script>

<a href={point.to}>
  <div
    role="presentation"
    class={[
      "relative card preset-filled-surface-100-900 p-4 w-72 h-40 hover:preset-outlined-primary-500",
      isHovered && "preset-outlined-primary-500",
    ]}
    onmouseenter={() => {
      mapStore.selectedPoint = point;
    }}
    onmouseleave={() => {
      mapStore.selectedPoint = undefined;
    }}
  >
    <p class="text-lg mb-1">{point.name}</p>
    <p class="text-sm">{point.description}</p>

    {#if isNavigatingToPoint}
      <div class="absolute inset-0 flex items-center justify-center preset-filled-surface-100-900">
        <LoaderCircle class="animate-spin" size={20} />
      </div>
    {/if}
  </div>
</a>

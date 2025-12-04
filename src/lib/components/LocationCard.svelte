<script lang="ts">
  import type { MapPoint } from "$lib/types";

  import { getMapContext } from "$lib/context/map";

  type LocationCardProps = {
    point: MapPoint;
  };

  const { point }: LocationCardProps = $props();

  const mapStore = getMapContext();

  const isHovered = $derived(point.id === mapStore.selectedPoint?.id);
</script>

<a href={point.to}>
  <div
    role="presentation"
    class={[
      "card preset-filled-surface-100-900 p-4 w-72 h-40 hover:preset-outlined-primary-500",
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
  </div>
</a>

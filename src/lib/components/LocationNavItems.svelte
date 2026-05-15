<script lang="ts">
  import type { Location } from "$lib/types";
  import NavItem from "$lib/components/NavItem.svelte";
  import { getMapContext } from "$lib/context/map";
  import { createMapPointFromLocation } from "$lib/utils/map";

  import { ArrowLeft, Map } from "@lucide/svelte";

  type Props = {
    location: Location | undefined;
  };

  const { location }: Props = $props();
  const mapStore = getMapContext();

  if (location) {
    const mapPoint = createMapPointFromLocation(
      location,
      `/dashboard/location/${location.slug}`,
    );

    mapStore.mapPoints = () => [mapPoint];
  }
</script>

<NavItem href="/dashboard" label="Back to locations">
  <ArrowLeft />
</NavItem>

<NavItem
  href={`/dashboard/location/${location?.slug}`}
  label={location?.name ?? ""}
>
  <Map />
</NavItem>

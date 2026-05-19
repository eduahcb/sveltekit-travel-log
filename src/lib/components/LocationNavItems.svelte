<script lang="ts">
  import type { Location } from "$lib/types";
  import NavItem from "$lib/components/NavItem.svelte";

  import { ArrowLeft, Map } from "@lucide/svelte";

  type Props = {
    location: Location | undefined;
  };

  const { location }: Props = $props();
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

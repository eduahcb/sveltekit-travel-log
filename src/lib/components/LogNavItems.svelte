<script lang="ts">
  import type { Location, LocationLog } from "$lib/types";
  import NavItem from "$lib/components/NavItem.svelte";

  import { ArrowLeft, Images, MapPin } from "@lucide/svelte";

  type Props = {
    location: Location | undefined;
    log: LocationLog | undefined;
  };

  const { location, log }: Props = $props();
</script>

{#if location && log}
  <NavItem
    href={`/dashboard/location/${location.slug}`}
    label="Back to {location.name}"
  >
    <ArrowLeft />
  </NavItem>

  <NavItem
    href={`/dashboard/location/${location.slug}/${log.id}`}
    label="View log"
  >
    <MapPin />
  </NavItem>

  <NavItem
    href={`/dashboard/location/${location.slug}/${log.id}/edit`}
    label="Edit log"
  >
    <MapPin />
  </NavItem>

  <NavItem
    href={`/dashboard/location/${location.slug}/${log.id}/images`}
    label="Manage Images"
  >
    <Images />
  </NavItem>
{/if}

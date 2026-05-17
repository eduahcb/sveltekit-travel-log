<script lang="ts">
  import type { LocationInsertData } from "$lib/types";
  import { goto } from "$app/navigation";
  import FormField from "$lib/components/FormField.svelte";
  import LocationFormBase from "$lib/components/LocationFormBase.svelte";
  import { getMapContext } from "$lib/context/map";
  import { fetchCreateLocation } from "$lib/http/location";
  import { LocationInsertSchema } from "$lib/schema/location";
  import { Plus } from "@lucide/svelte";
  import { createMutation } from "@tanstack/svelte-query";
  import mapLibre from "maplibre-gl";
  import { onMount } from "svelte";

  const mapStore = getMapContext();

  const getCurrentCoordinates = (marker: mapLibre.LngLatLike) => {
    const ll = mapLibre.LngLat.convert(marker);

    return {
      long: ll.lng,
      lat: ll.lat,
    };
  };

  const coordinates = getCurrentCoordinates(mapStore.addMarker);

  const initialValues = {
    name: "",
    description: "",
    lat: coordinates.lat,
    long: coordinates.long,
  } as LocationInsertData;

  const locationMutation = createMutation({
    mutationKey: ["location"],
    mutationFn: fetchCreateLocation,
  });

  onMount(() => {
    mapStore.showAddMarker = true;

    return () => (mapStore.showAddMarker = false);
  });

  async function addLocation(payload: LocationInsertData) {
    await $locationMutation.mutateAsync(payload);
  }

  async function redirectToDashboard() {
    await goto("/dashboard", { invalidateAll: true });
  }
</script>

<div class="py-6 px-2">
  <h1 class="h5">Add Location</h1>

  <p class="mt-2 text-xs">
    A location is a place you have traveled or will travel to. It can be a city,
    country, state or point of interest. You can add specific times you visited
    this location after adding it.
  </p>

  <LocationFormBase
    {initialValues}
    schema={LocationInsertSchema}
    redirectOnCancel="/dashboard"
    redirectOnConfirm="/dashboard"
    confirmLabel="Add"
    ConfirmIcon={Plus}
    isPending={$locationMutation.isPending}
    onsubmit={addLocation}
    onsubmitComplete={redirectToDashboard}
  >
    {#snippet fields(form)}
      <form.Field name="name">
        {#snippet children(field: any)}
          <FormField
            label="Name"
            name="name"
            value={field.state.value}
            errors={field.state.meta.errors
              .map((e: any) => e.message)
              .join(", ")}
            oninput={(e) => {
              const target = e.target as HTMLInputElement;
              field.handleChange(target.value);
            }}
          />
        {/snippet}
      </form.Field>

      <form.Field name="description">
        {#snippet children(field: any)}
          <FormField
            label="Description"
            type="textarea"
            name="description"
            value={field.state.value}
            errors={field.state.meta.errors
              .map((e: any) => e.message)
              .join(", ")}
            oninput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              field.handleChange(target.value);
            }}
          />
        {/snippet}
      </form.Field>
    {/snippet}
  </LocationFormBase>
</div>

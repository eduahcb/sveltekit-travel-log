<script lang="ts">
  import type { LocationInsertData } from "$lib/types";
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import FormField from "$lib/components/FormField.svelte";
  import LocationFormBase from "$lib/components/LocationFormBase.svelte";
  import { getMapContext } from "$lib/context/map";
  import { fetchUpdateLocation } from "$lib/http/location";
  import { LocationInsertSchema } from "$lib/schema/location";
  import { MapPinIcon } from "@lucide/svelte";
  import { createMutation } from "@tanstack/svelte-query";
  import { onMount } from "svelte";

  const { data }: PageProps = $props();
  const mapStore = getMapContext();

  const initialValues = {
    name: data.location.name,
    description: data.location.description,
    lat: data.location.lat,
    long: data.location.long,
  } as LocationInsertData;

  const updatedMutation = createMutation({
    mutationKey: ["location"],
    mutationFn: fetchUpdateLocation,
  });

  onMount(() => {
    mapStore.addMarker = { lat: data.location.lat, lng: data.location.long };
    mapStore.showAddMarker = true;

    return () => (mapStore.showAddMarker = false);
  });

  async function handleUpdate(payload: LocationInsertData) {
    await $updatedMutation.mutateAsync({
      location: payload,
      slug: data.location.slug,
    });
  }

  async function redirectToDashboard() {
    await goto(`/dashboard/location/${data.location.slug}`, {
      invalidateAll: true,
    });
  }
</script>

<div class="py-6 px-2">
  <LocationFormBase
    {initialValues}
    schema={LocationInsertSchema}
    redirectOnCancel={`/dashboard/location/${data.location.slug}`}
    redirectOnConfirm={`/dashboard/location/${data.location.slug}`}
    confirmLabel="Update"
    ConfirmIcon={MapPinIcon}
    isPending={$updatedMutation.isPending}
    onsubmit={handleUpdate}
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

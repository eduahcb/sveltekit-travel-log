<script lang="ts">
  import type { LocationLogInsertData } from "$lib/types";
  import type { DateValue } from "@internationalized/date";
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import FormField from "$lib/components/FormField.svelte";
  import LocationFormBase from "$lib/components/LocationFormBase.svelte";
  import { getMapContext } from "$lib/context/map";
  import { fetchCreateLocationLog } from "$lib/http/location-log";
  import { LocationLogSchema } from "$lib/schema";
  import {
    CalendarDate,
    getLocalTimeZone,
    today,
  } from "@internationalized/date";
  import { Plus } from "@lucide/svelte";
  import { onMount } from "svelte";

  const { data }: PageProps = $props();

  const mapStore = getMapContext();

  const initialValues = {
    name: "",
    description: "",
    lat: 0,
    long: 0,
    startedAt: today(getLocalTimeZone()).toDate(getLocalTimeZone()).getTime(),
    endedAt: today(getLocalTimeZone())
      .add({ days: 1 })
      .toDate(getLocalTimeZone())
      .getTime(),
  } as LocationLogInsertData;

  function dateToDateValue(timestamp: number): DateValue {
    const date = new Date(timestamp);

    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
  }

  async function addLocationLog(log: LocationLogInsertData) {
    await fetchCreateLocationLog(log, data.location.slug);
  }

  async function redirectToLocationPage() {
    goto(`/dashboard/location/${data.location.slug}`, {
      invalidateAll: true,
    });
  }

  onMount(() => {
    mapStore.addMarker = { lat: data.location.lat, lng: data.location.long };
    mapStore.showAddMarker = true;

    return () => (mapStore.showAddMarker = false);
  });
</script>

<div class="py-6 px-2">
  <LocationFormBase
    {initialValues}
    schema={LocationLogSchema}
    redirectOnCancel={`/dashboard/location/${data.location.slug}`}
    redirectOnConfirm={`/dashboard/location/${data.location.slug}`}
    confirmLabel="Add"
    ConfirmIcon={Plus}
    isPending={false}
    onsubmit={addLocationLog}
    onsubmitComplete={redirectToLocationPage}
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

      <form.Field name="startedAt">
        {#snippet children(field: any)}
          <DatePicker
            name="startedAt"
            label="Started At"
            value={dateToDateValue(field.state.value)}
            onchange={field.handleChange}
            error={field.state.meta.errors
              .map((e: any) => e.message)
              .join(", ")}
          />
        {/snippet}
      </form.Field>

      <form.Field name="endedAt">
        {#snippet children(field: any)}
          <DatePicker
            name="endedAt"
            label="Ended At"
            value={dateToDateValue(field.state.value)}
            onchange={field.handleChange}
            error={field.state.meta.errors
              .map((e: any) => e.message)
              .join(", ")}
          />
        {/snippet}
      </form.Field>
    {/snippet}
  </LocationFormBase>
</div>

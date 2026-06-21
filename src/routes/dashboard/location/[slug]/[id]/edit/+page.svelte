<script lang="ts">
  import type { LocationLogInsertData } from "$lib/types";
  import type { DateValue } from "@internationalized/date";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import FormField from "$lib/components/FormField.svelte";
  import LocationFormBase from "$lib/components/LocationFormBase.svelte";
  import { getMapContext } from "$lib/context/map";
  import { fetchUpdateLocationLog } from "$lib/http/location-log";
  import { LocationLogSchema } from "$lib/schema";
  import { CalendarDate } from "@internationalized/date";
  import { MapPin } from "@lucide/svelte";
  import { onMount } from "svelte";

  const mapStore = getMapContext();

  const initialValues = {
    name: page.data.log.name,
    description: page.data.log.description,
    lat: page.data.log.lat,
    long: page.data.log.long,
    startedAt: page.data.log.startedAt,
    endedAt: page.data.log.endedAt,
  } as LocationLogInsertData;

  function dateToDateValue(timestamp: number): DateValue {
    const date = new Date(timestamp);

    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
  }

  async function updateLog(log: LocationLogInsertData) {
    await fetchUpdateLocationLog(
      log,
      page.data.location.slug,
      page.data.log.id,
    );
  }

  async function redirectToLogPage() {
    goto(`/dashboard/location/${page.data.location.slug}/${page.data.log.id}`, {
      invalidateAll: true,
    });
  }

  onMount(() => {
    mapStore.addMarker = {
      lat: page.data.log.lat,
      lng: page.data.log.long,
    };
    mapStore.showAddMarker = true;

    return () => (mapStore.showAddMarker = false);
  });
</script>

<div class="py-6 px-2">
  <LocationFormBase
    {initialValues}
    schema={LocationLogSchema}
    redirectOnCancel={`/dashboard/location/${page.data.location.slug}`}
    redirectOnConfirm={`/dashboard/location/${page.data.location.slug}`}
    confirmLabel="Update Log"
    ConfirmIcon={MapPin}
    isPending={false}
    onsubmit={updateLog}
    onsubmitComplete={redirectToLogPage}
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

<script lang="ts">
  import type { LocationInsertData, SearchResult } from "$lib/types";
  import type { SuperValidated } from "sveltekit-superforms";
  import { beforeNavigate, goto } from "$app/navigation";

  import ConfirmModal from "$lib/components/ConfirmModal.svelte";

  import FormField from "$lib/components/FormField.svelte";

  import { getMapContext } from "$lib/context/map";

  import { fetchCreateLocation } from "$lib/http/location";

  import { fetchSearchLocations } from "$lib/http/search";

  import { LocationInsertSchema } from "$lib/schema/location";

  import { ArrowLeft, LoaderCircle, MapPin, Plus } from "@lucide/svelte";

  import { createMutation } from "@tanstack/svelte-query";

  import { HTTPError } from "ky";

  import mapLibre from "maplibre-gl";

  import { onMount } from "svelte";

  import {
    defaults,
    setError,
    setMessage,
    superForm,
  } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";

  const mapStore = getMapContext();

  let searchLocations = $state<SearchResult[]>([]);
  let isSearching = $state(false);
  let open = $state(false);
  let destination = "/dashboard";
  let searchForm: HTMLFormElement;

  const coordinates = $derived.by(() => {
    const ll = mapLibre.LngLat.convert(mapStore.addMarker);

    return {
      long: ll.lng,
      lat: ll.lat,
    };
  });

  onMount(() => {
    mapStore.showAddMarker = true;

    return () => (mapStore.showAddMarker = false);
  });

  const initialData = {
    name: "",
    description: "",
    lat: 0,
    long: 0,
  };

  const locationMutation = createMutation({
    mutationKey: ["location"],
    mutationFn: fetchCreateLocation,
  });

  const { form, errors, enhance, isTainted, reset, message } = superForm(
    defaults(initialData, valibot(LocationInsertSchema)),
    {
      validators: valibot(LocationInsertSchema),
      SPA: true,
      resetForm: false,
      onUpdate: async ({ form }) => {
        form.data.long = coordinates.long;
        form.data.lat = coordinates.lat;

        if (form.valid) {
          const payload = {
            ...form.data,
            lat: coordinates.lat,
            long: coordinates.long,
          };
          await addLocation(form, payload);
        }
      },
    },
  );

  beforeNavigate(({ cancel, from, to }) => {
    const isDiffPage = from?.url.pathname !== to?.url.pathname;

    if (isTainted() && isDiffPage) {
      cancel();
      open = true;
      destination = to?.url.pathname ?? "/dashboard";
    } else {
      mapStore.resetAddMarker();
    }
  });

  function onCancel() {
    goto("/dashboard");
  }

  function onConfirm() {
    reset();
    goto(destination);
  }

  function onModalCancel() {
    open = false;
  }

  async function addLocation(
    form: SuperValidated<LocationInsertData>,
    payload: LocationInsertData,
  ) {
    try {
      await $locationMutation.mutateAsync({
        ...payload,
      });
      reset();

      return goto("/dashboard", {
        invalidateAll: true,
      });
    } catch (err: unknown) {
      const error = err as HTTPError;

      const result: { msg: string } = await error.response.json();

      if (error.response.status === 400) {
        for (const [key, value] of Object.entries(result)) {
          setError(form, key as keyof typeof $form, value as string);
        }
      } else {
        setMessage(form, result.msg);
      }
    }
  }

  async function searchLocation(
    event: SubmitEvent & {
      currentTarget: HTMLFormElement;
    },
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const q = formData.get("q") as string;

    if (!q) {
      return;
    }

    try {
      isSearching = true;
      const result = await fetchSearchLocations(q);
      searchLocations = result.locations;
    } catch (error) {
      console.error(error);
    } finally {
      isSearching = false;
    }
  }

  function setLocation(location: SearchResult) {
    mapStore.showAddMarker = false;

    $form.name = location.display_name;

    mapStore.addMarker = {
      lng: Number(location.lon),
      lat: Number(location.lat),
    };

    mapStore.showAddMarker = true;

    searchForm.reset();
  }
</script>

<ConfirmModal {open} {onConfirm} onCancel={onModalCancel} />

<div class="py-6 px-2">
  <h1 class="h5">Add Location</h1>

  <p class="mt-2 text-xs">
    A location is a place you have traveled or will travel to. It can be a city,
    country, state or point of interest. You can add specific times you visited
    this location after adding it.
  </p>

  <form class="my-5 space-y-6" use:enhance>
    {#if !!$message}
      <p class="text-error-500">{$message}</p>
    {/if}

    <FormField label="Name" bind:value={$form.name} error={$errors.name} />

    <FormField
      label="Description"
      type="textarea"
      bind:value={$form.description}
      error={$errors.description}
      disabled={$locationMutation.isPending}
    />

    <p class="text-xs mb-2">
      Current coordinates: {coordinates.long.toFixed(5)}, {coordinates.lat.toFixed(
        5,
      )}
    </p>

    <p class="mb-2">To set the coordinates:</p>

    <ul class="list text-sm mb-3">
      <li class="flex gap-1 items-center">
        Drag the <MapPin size={18} class="fill-primary-500" /> marker on the map
      </li>
      <li>Double click the map</li>
      <li>Search for a location below</li>
    </ul>

    <div class="btn-group w-full flex-col p-2 md:flex-row justify-end">
      <button
        type="button"
        class="btn preset-outlined-surface-500"
        onclick={onCancel}
      >
        <ArrowLeft />
        Cancel
      </button>

      <button
        type="submit"
        disabled={$locationMutation.isPending}
        class="btn preset-filled-primary-500"
      >
        Add
        {#if $locationMutation.isPending}
          <LoaderCircle class="animate-spin" />
        {:else}
          <Plus />
        {/if}
      </button>
    </div>
  </form>
  <hr class="hr" />

  <p class="mt-4 text-sm text-right">
    Search results provider by
    <a class="anchor" href="https://nominatim.org">nominatin</a>
  </p>

  <form
    bind:this={searchForm}
    onsubmit={searchLocation}
    class="mt-3 flex items-center justify-center"
    id="nomatin"
  >
    <input
      name="q"
      class="input max-w-[200px]"
      type="search"
      placeholder="Input"
    />
    <button type="submit" class="btn preset-outlined-surface-500">
      {#if isSearching}
        <LoaderCircle class="animate-spin" />
      {/if}
      Search
    </button>
  </form>

  <div class="mt-3 p-1 max-h-60 overflow-auto">
    {#each searchLocations as location}
      <div
        class="flex flex-col gap-2 card mb-2 w-full max-w-md preset-filled-surface-100-900 p-4"
      >
        <p class="text-lg text-left">{location.display_name}</p>

        <button
          onclick={() => setLocation(location)}
          type="button"
          class="self-end btn preset-filled-warning-500"
        >
          Set location
          <MapPin />
        </button>
      </div>
    {/each}
  </div>
</div>

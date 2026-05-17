<script lang="ts" generics="T extends LocationInsertData">
  import type { LocationInsertData, SearchResult } from "$lib/types";
  import type { DeepValue, Updater } from "@tanstack/svelte-form";
  import type { Component, Snippet } from "svelte";
  import type { GenericSchema } from "valibot";
  import { beforeNavigate, goto } from "$app/navigation";
  import { getMapContext } from "$lib/context/map";
  import { fetchSearchLocations } from "$lib/http/search";
  import { ArrowLeft, LoaderCircle, MapPin, Plus } from "@lucide/svelte";
  import { createForm } from "@tanstack/svelte-form";
  import { HTTPError } from "ky";

  import mapLibre from "maplibre-gl";
  import ConfirmModal from "./ConfirmModal.svelte";

  type Props = {
    initialValues: T;
    schema: GenericSchema<T>;
    isPending?: boolean;
    redirectOnConfirm?: string;
    redirectOnCancel?: string;
    confirmLabel: string;
    ConfirmIcon: Component;
    onsubmit: (value: T) => Promise<void>;
    onsubmitComplete: () => Promise<void>;
    fields: Snippet<[any]>;
  };

  const {
    initialValues,
    schema,
    isPending,
    redirectOnConfirm = "/dashboard",
    redirectOnCancel = "/dashboard",
    confirmLabel,
    ConfirmIcon,
    onsubmit,
    onsubmitComplete,
    fields,
  }: Props = $props();

  const mapStore = getMapContext();

  let searchLocations = $state<SearchResult[]>([]);
  let isSearching = $state(false);
  let destination = $state(redirectOnConfirm);

  const confirmModal = $state({ open: false });
  let searchForm: HTMLFormElement;

  const coordinates = $derived.by(() => {
    const ll = mapLibre.LngLat.convert(mapStore.addMarker);

    return {
      long: ll.lng,
      lat: ll.lat,
    };
  });

  const form = createForm(() => ({
    defaultValues: initialValues,
    validators: {
      onSubmit: schema,
      onSubmitAsync: async ({ value }) => {
        try {
          await onsubmit(value);
          form.reset();

          await onsubmitComplete();
        } catch (err) {
          if (!(err instanceof HTTPError)) {
            console.error(err);
            return;
          }

          const result: { msg: string } = await err.response.json();

          if (err.response.status === 400) {
            return {
              form: "Invalid data",
              fields: result,
            };
          } else {
            console.error("Unknown error");
          }
        }
      },
    },
  }));

  const isDirty = form.useStore((state) => !state.isDefaultValue);

  function handleOnSubmit(e: SubmitEvent) {
    e.preventDefault();
    setCoordinates();
    form.handleSubmit();
  }

  async function handleSearchLocation(
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

    form.setFieldValue(
      "name",
      location.display_name as Updater<DeepValue<T, "name">>,
    );

    mapStore.addMarker = {
      lng: Number(location.lon),
      lat: Number(location.lat),
    };

    mapStore.showAddMarker = true;

    searchForm.reset();
  }

  function setCoordinates() {
    form.setFieldValue("lat", coordinates.lat as Updater<DeepValue<T, "lat">>);
    form.setFieldValue(
      "long",
      coordinates.long as Updater<DeepValue<T, "long">>,
    );
  }

  function onModalCancel() {
    confirmModal.open = false;
  }

  function onCancel() {
    goto(redirectOnCancel);
  }

  function onConfirm() {
    form.reset(initialValues);
    goto(destination);
  }

  beforeNavigate(({ cancel, from, to }) => {
    const isDiffPage = from?.url.pathname !== to?.url.pathname;

    if (isDirty.current && isDiffPage) {
      cancel();
      confirmModal.open = true;
      if (to?.url.pathname) {
        destination = to?.url.pathname;
      }
    } else {
      return;
    }
    mapStore.resetAddMarker();
  });
</script>

<ConfirmModal open={confirmModal.open} {onConfirm} onCancel={onModalCancel} />

<form class="my-5 space-y-6" onsubmit={handleOnSubmit}>
  {@render fields(form)}
  <p class="text-xs mb-2">
    Current coordinates: {coordinates.lat.toFixed(5)}, {coordinates.long.toFixed(
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
      disabled={isPending}
      class="btn preset-filled-primary-500"
    >
      {confirmLabel}
      {#if isPending}
        <LoaderCircle class="animate-spin" />
      {:else if ConfirmIcon}
        <ConfirmIcon />
      {:else}
        <Plus />
      {/if}
    </button>
  </div>
</form>

<form
  bind:this={searchForm}
  onsubmit={handleSearchLocation}
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

<p class="mt-4 text-sm text-right">
  Search results provider by
  <a class="anchor" href="https://nominatim.org">nominatin</a>
</p>

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

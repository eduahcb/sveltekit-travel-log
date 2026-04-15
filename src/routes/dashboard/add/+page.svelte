<script lang="ts">
  import type { LocationInsertData } from "$lib/types";
  import type { SuperValidated } from "sveltekit-superforms";
  import { beforeNavigate, goto } from "$app/navigation";

  import ConfirmModal from "$lib/components/ConfirmModal.svelte";

  import FormField from "$lib/components/FormField.svelte";

  import { getMapContext } from "$lib/context/map";

  import { fetchCreateLocation } from "$lib/http/location";

  import { LocationInsertSchema } from "$lib/schema/location";

  import { ArrowLeft, LoaderCircle, Plus } from "@lucide/svelte";

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

  let open = $state(false);
  let destination = "/dashboard";

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

  const location = createMutation({
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
          await addLocation(form);
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
    mapStore.resetAddMarker();
  }

  function onModalCancel() {
    open = false;
  }

  async function addLocation(form: SuperValidated<LocationInsertData>) {
    try {
      await $location.mutateAsync({
        ...form.data,
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
</script>

<ConfirmModal {open} {onConfirm} onCancel={onModalCancel} />

<div class="py-6 px-2">
  <h1 class="h5">Add Location</h1>

  <p class="mt-2 text-sm">
    A location is a place you have traveled or will travel to. It can be a city,
    country, state or point of interest. You can add specific times you visited
    this location after adding it.
  </p>

  <form class="my-6 space-y-6" use:enhance>
    {#if !!$message}
      <p class="text-error-500">{$message}</p>
    {/if}

    <FormField label="Name" bind:value={$form.name} error={$errors.name} />

    <FormField
      label="Description"
      type="textarea"
      bind:value={$form.description}
      error={$errors.description}
      disabled={$location.isPending}
    />

    <p class="text-xs">
      Current coordinates: {coordinates.long.toFixed(5)}, {coordinates.lat.toFixed(
        5,
      )}
    </p>

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
        disabled={$location.isPending}
        class="btn preset-filled-primary-500"
      >
        Add
        {#if $location.isPending}
          <LoaderCircle class="animate-spin" />
        {:else}
          <Plus />
        {/if}
      </button>
    </div>
  </form>
</div>

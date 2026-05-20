<script lang="ts">
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import DeleteLocationModal from "$lib/components/DeleteLocationModal.svelte";
  import { fetchDeleteLocation } from "$lib/http/location";

  import {
    EllipsisVertical,
    LoaderCircle,
    MapPinPlus,
    PenLine,
    Trash2,
  } from "@lucide/svelte";
  import { createMutation } from "@tanstack/svelte-query";
  import { DropdownMenu } from "bits-ui";
  import { HTTPError } from "ky";

  const { data }: PageProps = $props();

  let open = $state(false);
  let openDeleteModal = $state(false);
  let buttonEl = $state<HTMLButtonElement>();

  const deleteMutation = createMutation({
    mutationKey: ["location"],
    mutationFn: async (slug: string) => {
      try {
        const data = await fetchDeleteLocation(slug);

        return data;
      } catch (error) {
        if (error instanceof HTTPError && error.response.status === 404) {
          const result = (await error.response.json()) as { msg: string };
          throw new Error(result.msg);
        }

        throw new Error("Unknown error");
      }
    },
  });

  function gotoLocationEdit() {
    goto(`/dashboard/location/${data.location.slug}/edit`);
  }

  async function deleteLocation() {
    try {
      await $deleteMutation.mutateAsync(data.location.slug);

      goto("/dashboard", {
        invalidateAll: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
</script>

<DeleteLocationModal
  open={openDeleteModal}
  onCancel={() => (openDeleteModal = false)}
  onConfirm={deleteLocation}
/>

<div class="flex gap-2 items-center">
  <h1 class="h5 truncate">{data.location.name}</h1>
  <button
    bind:this={buttonEl}
    type="button"
    class="btn preset-outlined-surface-500 p-0"
    onclick={() => (open = !open)}
  >
    <EllipsisVertical />
  </button>
</div>

<DropdownMenu.Root bind:open>
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      customAnchor={buttonEl}
      class="mt-3 border-muted bg-surface-900 shadow-popover outline-hidden focus-visible:outline-hidden w-[150px] rounded-xl border px-1 py-1.5"
    >
      <DropdownMenu.Item
        class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-1 pl-2 pr-1.5 text-sm font-medium focus-visible:outline-none"
      >
        <div class="w-full">
          <button
            onclick={() => (openDeleteModal = true)}
            type="button"
            class="w-full btn preset-tonal-surface"
          >
            {#if $deleteMutation.isPending}
              <LoaderCircle class="animate-spin" />
            {:else}
              <Trash2 size={16} />
            {/if}
            Delete
          </button>
        </div>
      </DropdownMenu.Item>
      <DropdownMenu.Item
        class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-1 pl-2 pr-1.5 text-sm font-medium focus-visible:outline-none"
      >
        <div class="w-full">
          <button
            onclick={gotoLocationEdit}
            type="button"
            class="w-full btn preset-tonal-surface"
          >
            <PenLine size={16} />
            Edit
          </button>
        </div>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>

<p>{data.location.description}</p>

{#if $deleteMutation.isError}
  <p class="mt-2 text-error-500">{$deleteMutation.error.message}</p>
{/if}
<p class="mt-5">Add a location log to get started.</p>

<button type="button" class="btn mt-2 preset-filled-primary-500">
  Add Location Log
  <MapPinPlus size={16} />
</button>

<script lang="ts">
  import type { PageProps } from "./$types";
  import {
    EllipsisVertical,
    MapPinPlus,
    PenLine,
    Trash2,
  } from "@lucide/svelte";
  import { DropdownMenu } from "bits-ui";

  const { data }: PageProps = $props();

  let open = $state(false);
  let buttonEl = $state<HTMLButtonElement>();
</script>

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
          <button type="button" class="w-full btn preset-tonal-surface">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </DropdownMenu.Item>
      <DropdownMenu.Item
        class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-1 pl-2 pr-1.5 text-sm font-medium focus-visible:outline-none"
      >
        <div class="w-full">
          <button type="button" class="w-full btn preset-tonal-surface">
            <PenLine size={16} />
            Edit
          </button>
        </div>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>

<p>{data.location.description}</p>

<p class="mt-5">Add a location log to get started.</p>

<button type="button" class="btn mt-2 preset-filled-primary-500">
  Add Location Log
  <MapPinPlus size={16} />
</button>

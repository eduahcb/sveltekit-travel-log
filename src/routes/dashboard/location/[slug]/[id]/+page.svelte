<script lang="ts">
  import type { LocationLog } from "$lib/types";
  import type { DateValue } from "@internationalized/date";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import ImageGallery from "$lib/components/ImageGallery.svelte";
  import ImagePreview from "$lib/components/ImagesPreview.svelte";
  import { fetchDeleteLocationLog } from "$lib/http/location-log";
  import { CalendarDate } from "@internationalized/date";
  import {
    EllipsisVertical,
    Images,
    LoaderCircle,
    PenLine,
    Trash2,
  } from "@lucide/svelte";
  import { createMutation } from "@tanstack/svelte-query";
  import { DropdownMenu } from "bits-ui";
  import { HTTPError } from "ky";

  let open = $state(false);
  let buttonEl = $state<HTMLButtonElement>();

  function dateToDateValue(timestamp: number): DateValue {
    const date = new Date(timestamp);

    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );
  }
  const deleteMutation = createMutation({
    mutationKey: ["location-log", page.data.log.id],
    mutationFn: async ({ slug, logId }: { slug: string; logId: number }) => {
      try {
        const data = (await fetchDeleteLocationLog(slug, logId)) as {
          log: LocationLog;
        };

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

  async function deleteLog() {
    try {
      await $deleteMutation.mutateAsync({
        slug: page.data.location.slug,
        logId: page.data.log.id,
      });

      goto(`/dashboard/location/${page.data.location.slug}`, {
        invalidateAll: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function gotoLogEdit() {
    goto(
      `/dashboard/location/${page.data.location.slug}/${page.data.log.id}/edit`,
    );
  }
</script>

<div>
  <p>
    {dateToDateValue(page.data.log.startedAt)} / {dateToDateValue(
      page.data.log.endedAt,
    )}
  </p>
</div>

<div class="flex gap-2 items-center">
  <h1 class="h5 truncate">{page.data.log.name}</h1>
  <button
    bind:this={buttonEl}
    type="button"
    class="btn preset-outlined-surface-500 p-0"
    onclick={() => (open = !open)}
  >
    <EllipsisVertical />
  </button>
</div>

<div class="mt-2 w-full">
  {#if page.data.log.images.length}
    <ImageGallery>
      {#each page.data.log.images as image (image.id)}
        <ImagePreview {image} />
      {/each}
    </ImageGallery>
  {:else}
    <div class="mt-6">
      <a
        class="btn preset-filled-primary-500"
        href={`/dashboard/location/${page.data.location.slug}/${page.data.log.id}/images`}
      >
        <Images />
        Manage Images
      </a>
    </div>
  {/if}
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
            onclick={deleteLog}
            type="button"
            class="w-full btn preset-tonal-surface"
            disabled={$deleteMutation.isPending}
          >
            {#if $deleteMutation.isPending}
              <LoaderCircle size={16} />
              Deleting...
            {:else}
              <Trash2 size={16} />
              Delete
            {/if}
          </button>
        </div>
      </DropdownMenu.Item>
      <DropdownMenu.Item
        class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-1 pl-2 pr-1.5 text-sm font-medium focus-visible:outline-none"
      >
        <div class="w-full">
          <button
            onclick={gotoLogEdit}
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

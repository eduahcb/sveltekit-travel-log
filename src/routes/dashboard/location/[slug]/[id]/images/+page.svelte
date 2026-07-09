<script lang="ts">
  import type { LocationLogImage } from "$lib/types";
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/state";
  import DeleteImageModal from "$lib/components/DeleteImageModal.svelte";
  import ImageGallery from "$lib/components/ImageGallery.svelte";
  import ImagePreview from "$lib/components/ImagesPreview.svelte";
  import {
    fetchDeleteImage,
    fetchInsertImage,
    fetchSignLogImage,
    fetchUploadImage,
  } from "$lib/http/location-log-image";
  import { ImageIcon, LoaderCircle } from "@lucide/svelte";
  import { createMutation } from "@tanstack/svelte-query";
  import { HTTPError } from "ky";

  let files = $state<FileList | null | undefined>();
  const image = $derived<File | undefined>(files ? files[0] : undefined);
  let loading = $state(false);
  let filesRef = $state<HTMLInputElement | null>();
  let errorMessage = $state("");
  let isDeleteModalOpen = $state(false);
  let selectedImage = $state<LocationLogImage | undefined>(undefined);

  const previewURL = $derived.by(() => {
    return image ? URL.createObjectURL(image) : undefined;
  });

  async function getChecksum(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }

  const signUploadImageMutation = createMutation({
    mutationFn: fetchSignLogImage,
  });

  const insertImageMutation = createMutation({
    mutationFn: fetchInsertImage,
  });

  const uploadImageMutation = createMutation({
    mutationFn: fetchUploadImage,
  });

  const deleImageMutation = createMutation({
    mutationFn: fetchDeleteImage,
  });

  function uploadImage() {
    if (!image || !previewURL) {
      return;
    }

    loading = true;
    errorMessage = "";

    const previewImage = new Image();

    previewImage.addEventListener("load", async () => {
      const width = Math.min(1000, previewImage.width);
      const resized = await createImageBitmap(previewImage, {
        resizeWidth: width,
      });

      const canvas = new OffscreenCanvas(width, resized.height);
      canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);

      const blob = await canvas.convertToBlob({
        type: "image/jpeg",
        quality: 0.9,
      });

      const checksum = await getChecksum(blob);

      try {
        const result = await $signUploadImageMutation.mutateAsync({
          slug: page.data.location.slug,
          id: page.data.log.id,
          data: {
            contentLength: blob.size,
            checksum,
          },
        });

        const formData = new FormData();
        Object.entries(result.fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        formData.append("file", blob);

        await $uploadImageMutation.mutateAsync({
          url: result.url,
          formData,
        });

        await $insertImageMutation.mutateAsync({
          slug: page.data.location.slug,
          id: page.data.log.id,
          key: result.key,
          width: canvas.width,
          height: canvas.height,
        });

        files = undefined;

        // eslint-disable-next-line antfu/if-newline
        if (!filesRef) return;
        filesRef.value = "";

        await invalidateAll();
      } catch (error) {
        if (error instanceof HTTPError) {
          errorMessage = error.response.statusText;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = "Unknown error";
        }
      }

      loading = false;
    });
    previewImage.src = previewURL;
  }

  function deleteImage(image: LocationLogImage) {
    isDeleteModalOpen = true;
    selectedImage = image;
  }

  function cancelImageDeletion() {
    isDeleteModalOpen = true;
    selectedImage = undefined;
  }

  function confirmDeleteImage() {
    if (!selectedImage) {
      return;
    }

    $deleImageMutation.mutate(
      {
        slug: page.data.location.slug,
        id: page.data.log.id,
        imageId: selectedImage.id,
      },
      {
        onSuccess: () => {
          isDeleteModalOpen = false;
          invalidateAll();
        },
      },
    );
  }
</script>

<DeleteImageModal
  open={isDeleteModalOpen}
  onCancel={cancelImageDeletion}
  onConfirm={confirmDeleteImage}
  isPending={$deleImageMutation.isPending}
/>

<div class="p-3 overflow-y-hidden">
  <h1 class="h5 truncate mb-2">
    Manage "{page.data.log.name}" Images
  </h1>

  <div class="flex gap-2 w-full">
    <div class="min-w-[250px] w-[250px]">
      <div
        class="relative h-28 bg-surface-500 mb-1 flex items-center justify-center p-1"
      >
        {#if !image}
          <p class="text-center">Select an Image</p>
        {:else}
          <img
            class="h-full object-cover"
            src={previewURL}
            alt="upload review"
          />

          {#if loading || errorMessage}
            <div
              class="size-full absolute flex justify-center items-center opacity-50"
            >
              {#if loading}
                <LoaderCircle size={24} class="animate-spin" />
              {:else}
                <p>{errorMessage}</p>
              {/if}
            </div>
          {/if}
        {/if}
      </div>
      <input bind:files bind:this={filesRef} class="input mb-2" type="file" />

      <button
        disabled={!image || $signUploadImageMutation.isPending}
        type="button"
        class="btn w-full preset-filled-primary-500"
        onclick={uploadImage}
      >
        {#if loading}
          Uploading...
          <LoaderCircle class="animate-spin" />
        {:else}
          Upload
          <ImageIcon />
        {/if}
      </button>
    </div>

    <ImageGallery>
      {#each page.data.log.images as image (image.id)}
        <ImagePreview {image}>
          {#snippet action()}
            <button
              onclick={() => deleteImage(image)}
              type="button"
              class="btn-sm preset-tonal-error rounded"
            >
              Delete
            </button>
          {/snippet}
        </ImagePreview>
      {/each}
    </ImageGallery>
  </div>
</div>

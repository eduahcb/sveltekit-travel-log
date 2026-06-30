<script lang="ts">
  import type { LocationLogImage } from "$lib/types";
  import type { Snippet } from "svelte";
  import { PUBLIC_S3_BUCKET_URL } from "$env/static/public";
  import PhotoSwipe from "photoswipe";
  import PhotoSwipeLightbox from "photoswipe/lightbox";
  import "photoswipe/style.css";

  type ImagesListProps = {
    images: LocationLogImage[];
    action?: Snippet;
  };

  const { images, action }: ImagesListProps = $props();

  $effect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery",
      children: ".card a",
      // setup PhotoSwipe Core dynamic import
      pswpModule: PhotoSwipe,
    });

    lightbox.init();

    return () => lightbox.destroy();
  });
</script>

<div id="gallery" class="flex gap-1">
  {#each images as image (image.id)}
    <div class="card preset-filled-surface-100-900 h-40 w-64">
      <a
        href={`${PUBLIC_S3_BUCKET_URL}/${image.key}`}
        class="block size-full p-2"
        data-pswp-width={image.width}
        data-pswp-height={image.height}
        target="_blank"
      >
        <img
          src={`${PUBLIC_S3_BUCKET_URL}/${image.key}`}
          alt="upload images"
          class="size-full object-cover object-center"
        />
      </a>
      {#if action}
        <div class="w-full">
          {@render action()}
        </div>
      {/if}
    </div>
  {/each}
</div>

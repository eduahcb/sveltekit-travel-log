<script lang="ts">
  import type { Snippet } from "svelte";
  import PhotoSwipe from "photoswipe";
  import PhotoSwipeLightbox from "photoswipe/lightbox";
  import "photoswipe/style.css";

  type ImageGalleryProps = {
    children: Snippet;
  };

  const { children }: ImageGalleryProps = $props();

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
  {@render children()}
</div>

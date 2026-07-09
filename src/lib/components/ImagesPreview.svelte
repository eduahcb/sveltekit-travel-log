<script lang="ts">
  import type { LocationLogImage } from "$lib/types";
  import type { Snippet } from "svelte";
  import { PUBLIC_S3_BUCKET_URL } from "$env/static/public";

  type ImagesPreviewProps = {
    image: LocationLogImage;
    action?: Snippet;
  };

  const { image, action }: ImagesPreviewProps = $props();
</script>

<div class="card preset-filled-surface-100-900 h-40 w-64 min-w-64">
  <a
    href={`${PUBLIC_S3_BUCKET_URL}/${image.key}`}
    class="block size-full p-2"
    data-pswp-width={image.width}
    data-pswp-height={image.height}
    target="_blank"
  >
    <img
      src={`${PUBLIC_S3_BUCKET_URL}/${image.key}`}
      alt="upload preview"
      class="size-full object-cover object-center"
    />
  </a>
  {#if action}
    <div class="w-full flex justify-center">
      {@render action()}
    </div>
  {/if}
</div>

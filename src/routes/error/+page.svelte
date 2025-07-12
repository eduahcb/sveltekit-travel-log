<script lang="ts">
  import { page } from "$app/state";
  import { ArrowLeft, TriangleAlert } from "@lucide/svelte";

  // eslint-disable-next-line style/operator-linebreak
  const error =
    page.url.searchParams.get("error") || "An unknown error occurred.";
</script>

<div class="container mx-auto p-4">
  <div
    class="card preset-outlined-error-500 grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto]"
  >
    <TriangleAlert />
    <div>
      <p class="font-bold">Error</p>
      <p class="text-xs opacity-60">{error}</p>
    </div>
    <div class="flex gap-1">
      <a href="/" class="btn preset-tonal hover:preset-filled">
        <ArrowLeft size={24} />
        Home
      </a>
    </div>
  </div>
</div>

<script lang="ts">
  import AuthButton from "$lib/components/AuthButton.svelte";
  import ThemeButton from "$lib/components/ThemeButton.svelte";

  import { AppBar } from "@skeletonlabs/skeleton-svelte";
</script>

<AppBar>
  {#snippet lead()}
    <a href="/" class="anchor font-bold text-xl">Travel Log</a>
  {/snippet}
  {#snippet trail()}
    <div class="flex items-center gap-4">
      <ThemeButton />
      <AuthButton />
    </div>
  {/snippet}
</AppBar>

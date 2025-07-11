<script lang="ts">
  import ThemeButton from "$lib/components/ThemeButton.svelte";

  import { Github } from "@lucide/svelte";
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
</script>

<AppBar>
  {#snippet lead()}
    <a href="/" class="anchor font-bold text-xl">Travel Log</a>
  {/snippet}
  {#snippet trail()}
    <div class="flex items-center gap-3">
      <ThemeButton />
      <button type="button" class="btn preset-filled-primary-500">
        <span class="text-white"> Sign In With Github </span>
        <Github size={20} class="text-white" />
      </button>
    </div>
  {/snippet}
</AppBar>

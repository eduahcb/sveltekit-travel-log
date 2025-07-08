<script lang="ts">
  import { Github } from "@lucide/svelte";
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
</script>

<AppBar>
  {#snippet lead()}
    <a href="/" class="h1 text-xl">Travel Log</a>
  {/snippet}
  {#snippet trail()}
    <button type="button" class="btn preset-filled-primary-500">
      Sign In With Github
      <Github size={20} />
    </button>
  {/snippet}
</AppBar>

<script lang="ts">
  import { authClient, signIn } from "$lib/aut-client";
  import { Github, LoaderCircle } from "@lucide/svelte";

  const session = authClient.useSession();
</script>

<button
  onclick={signIn}
  type="button"
  class="btn preset-filled-primary-500"
  disabled={$session.isPending}
>
  <span class="text-white"> Sign In With Github </span>

  {#if $session.isPending}
    <LoaderCircle class="animate-spin" />
  {:else}
    <Github size={20} class="text-white" />
  {/if}
</button>

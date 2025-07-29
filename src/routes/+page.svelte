<script lang="ts">
  import AuthButton from "$lib/components/AuthButton.svelte";
  import { getAuthContext } from "$lib/context/auth";

  const store = getAuthContext();
</script>

<main class="container mx-auto min-h-96 my-6">
  <div class="min-h-100 bg-surface-100-900 flex justify-center">
    <div
      class="p-6 min-h-96 text-center flex flex-col justify-center max-w-md gap-8"
    >
      <h2 class="h1">Travel Log</h2>

      <p>
        Keep track of your travels and adventures. Add locations, photos, and
        notes to create a digital journal of your journeys
      </p>

      <div class="flex justify-center">
        {#if !store().user}
          <AuthButton />
        {:else}
          <a href="/dashboard" class="btn preset-filled-primary-500">
            Start Logging
          </a>
        {/if}
      </div>
    </div>
  </div>
</main>

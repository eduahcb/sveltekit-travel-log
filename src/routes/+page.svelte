<script lang="ts">
  import { Github } from "@lucide/svelte";
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

      <div>
        <button type="button" class="btn preset-filled-primary-500">
          <span class="text-white"> Sign In With Github </span>
          <Github size={20} class="text-white" />
        </button>
      </div>
    </div>
  </div>
</main>

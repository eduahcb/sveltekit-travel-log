<script lang="ts">
  import { getAuthContext } from "$lib/context/auth";
  import { LoaderCircle } from "@lucide/svelte";

  const store = getAuthContext();

  import { onMount } from "svelte";

  onMount(async () => {
    await store().signOut();
  });
</script>

<main class="container mx-auto min-h-96 my-6">
  <div class="min-h-100 bg-surface-100-900 flex justify-center">
    <div
      class="p-6 min-h-96 text-center flex flex-col justify-center max-w-md gap-8"
    >
      <LoaderCircle class="animate-spin" size={42} />
    </div>
  </div>
</main>

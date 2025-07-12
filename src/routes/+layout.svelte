<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import "../app.css";

  const { children } = $props();
</script>

<div class="min-h-screen">
  <Navbar />
  {@render children()}
</div>

<svelte:head>
  <title>Sveltekit Travel Log</title>
  <meta
    name="description"
    content="Keep track of your travels and adventures. Add locations, photos, and notes to create a digital journal of your journeys"
  />

  <script>
    const mode = localStorage.getItem("mode") ?? "dark";

    document.documentElement.dataset.mode = mode;
    localStorage.setItem("mode", mode);
  </script>
</svelte:head>

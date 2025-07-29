<script lang="ts">
  import type { LayoutProps } from "./$types";
  import Navbar from "$lib/components/Navbar.svelte";

  import { setAuthContext } from "$lib/context/auth";
  import { createAuthStore } from "$lib/stores/auth.svelte";
  import "../app.css";

  const { children, data }: LayoutProps = $props();

  const store = createAuthStore(data.session);

  setAuthContext(store);
</script>

<div class="min-h-screen flex flex-col gap-1">
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

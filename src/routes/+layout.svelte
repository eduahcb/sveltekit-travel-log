<script lang="ts">
  import type { LayoutProps } from "./$types";
  import { browser } from "$app/environment";

  import Navbar from "$lib/components/Navbar.svelte";

  import { setAuthContext } from "$lib/context/auth";
  import { setThemeContext } from "$lib/context/theme";

  import { createAuthStore } from "$lib/stores/auth.svelte";
  import { createThemeStore } from "$lib/stores/theme.svelte";

  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import "../app.css";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  });

  const { children, data }: LayoutProps = $props();

  const themeStore = createThemeStore();
  const store = createAuthStore(data.session);

  setThemeContext(themeStore);
  setAuthContext(store);
</script>

<QueryClientProvider client={queryClient}>
  <div class="min-h-screen flex flex-col gap-1">
    <Navbar />
    {@render children()}
  </div>
</QueryClientProvider>

<svelte:head>
  <title>Travel Log</title>
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

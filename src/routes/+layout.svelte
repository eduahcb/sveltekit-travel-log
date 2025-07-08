<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import "../app.css";

  const { children } = $props();
</script>

<div class="min-h-screen">
  <Navbar />
  {@render children()}
</div>

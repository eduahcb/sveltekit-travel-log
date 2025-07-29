<script lang="ts">
  import type { Snippet } from "svelte";
  import { Navigation } from "@skeletonlabs/skeleton-svelte";

  type NavItemProps = {
    label: string;
    href: string;
    children: Snippet;
  };

  const { href, children, label }: NavItemProps = $props();
</script>

<Navigation.Tile aspect="auto" labelExpanded={label} {href}>
  {@render children()}
</Navigation.Tile>

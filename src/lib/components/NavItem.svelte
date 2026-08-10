<script lang="ts">
  import type { Snippet } from "svelte";
  import { navigating } from "$app/state";

  import { LoaderCircle } from "@lucide/svelte";
  import { Navigation } from "@skeletonlabs/skeleton-svelte";

  type NavItemProps = {
    label: string;
    href: string;
    children: Snippet;
    onmouseenter?: () => void;
    onmouseleave?: () => void;
  };

  // eslint-disable-next-line style/operator-linebreak
  const { href, children, label, onmouseenter, onmouseleave }: NavItemProps =
    $props();

  const isNavigating = $derived(navigating.to?.url.pathname === href);
</script>

<div
  role="none"
  onmouseenter={() => onmouseenter?.()}
  onmouseleave={() => onmouseleave?.()}
  class="w-full"
>
  <Navigation.Tile aspect="auto" labelExpanded={label} {href} base="group flex">
    {#if isNavigating}
      <LoaderCircle class="animate-spin" />
    {:else}
      {@render children()}
    {/if}
  </Navigation.Tile>
</div>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { Navigation } from "@skeletonlabs/skeleton-svelte";

  type NavItemProps = {
    label: string;
    href: string;
    children: Snippet;
    onmousenter?: () => void;
    onmouseleave?: () => void;
  };

  // eslint-disable-next-line style/operator-linebreak
  const { href, children, label, onmousenter, onmouseleave }: NavItemProps =
    $props();
</script>

<div
  role="none"
  onmouseenter={() => onmousenter?.()}
  onmouseleave={() => onmouseleave?.()}
  class="w-full"
>
  <Navigation.Tile aspect="auto" labelExpanded={label} {href} base="group flex">
    {@render children()}
  </Navigation.Tile>
</div>

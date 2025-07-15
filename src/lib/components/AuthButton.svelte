<script lang="ts">
  import { authClient, signIn } from "$lib/aut-client";
  import { Github, LoaderCircle, LogOut } from "@lucide/svelte";
  import { Avatar, Popover } from "@skeletonlabs/skeleton-svelte";

  const session = authClient.useSession();

  let open = $state(false);
</script>

{#if !$session.isPending && $session?.data?.user}
  <Popover
    {open}
    onOpenChange={(e) => (open = e.open)}
    positioning={{ placement: "bottom" }}
    triggerBase="btn preset-tonal flex items-center"
    contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
    arrow
    arrowBackground="!bg-surface-200 dark:!bg-surface-800"
  >
    {#snippet trigger()}
      {#if $session?.data?.user.image}
        <Avatar
          src={$session?.data?.user.image}
          name={$session?.data?.user.name}
          size="size-8"
        ></Avatar>
      {/if}
      {$session?.data?.user.name}
    {/snippet}
    {#snippet content()}
      <a
        href="/sign-out"
        class="btn btn-base preset-filled-primary-500 pointer"
      >
        <LogOut size={24} />
        Sign Out
      </a>
    {/snippet}
  </Popover>
{:else}
  <button
    onclick={signIn}
    type="button"
    class="btn preset-filled-primary-500"
    disabled={$session.isPending}
  >
    <span class="text-white"> Sign In With Github </span>

    {#if $session.isPending}
      <LoaderCircle class="animate-spin" />
    {:else}
      <Github size={20} class="text-white" />
    {/if}
  </button>
{/if}

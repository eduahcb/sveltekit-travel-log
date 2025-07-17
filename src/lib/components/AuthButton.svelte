<script lang="ts">
  import { getAuthContext } from "$lib/context/auth";
  import { Github, LoaderCircle, LogOut } from "@lucide/svelte";
  import { Avatar, Popover } from "@skeletonlabs/skeleton-svelte";

  const store = getAuthContext();

  let open = $state(false);
</script>

{#if store.user.value}
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
      {#if store.user.value?.image}
        <Avatar
          src={store.user.value.image}
          name={store.user.value.name}
          size="size-8"
        ></Avatar>
      {/if}
      {store.user.value?.name}
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
    onclick={store.signIn}
    type="button"
    class="btn preset-filled-primary-500"
    disabled={store.loading.value}
  >
    <span class="text-white"> Sign In With Github </span>

    {#if store.loading.value}
      <LoaderCircle class="animate-spin" />
    {:else}
      <Github size={20} class="text-white" />
    {/if}
  </button>
{/if}

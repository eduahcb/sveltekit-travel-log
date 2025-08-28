<script lang="ts">
  type ConfirmModalProps = {
    open?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
  };

  const { open = false, onConfirm, onCancel }: ConfirmModalProps = $props();

  let dialog: HTMLDialogElement;

  $effect(() => {
    open ? dialog.showModal() : dialog.close();
  });

  function confirm() {
    onConfirm?.();
  }
</script>

<dialog
  bind:this={dialog}
  class="rounded-container bg-surface-100-900 text-inherit max-w-[640px] top-1/2 left-1/2 -translate-1/2 p-4 space-y-4 z-10 backdrop:bg-surface-50/75 dark:backdrop:bg-surface-950/75"
>
  <h2 class="h4">Unsaved Changes</h2>
  <p>
    You have unsaved changes. Are you sure you want to leave without saving?
  </p>
  <form method="dialog" class="btn-group flex justify-end">
    <button
      type="button"
      class="btn preset-outlined-error-500"
      onclick={onCancel}>Cancelar</button
    >

    <button
      type="button"
      class="btn preset-filled-primary-500"
      onclick={confirm}>Confirm</button
    >
  </form>
</dialog>

<style>
  dialog,
  dialog::backdrop {
    --anim-duration: 250ms;
    transition:
      display var(--anim-duration) allow-discrete,
      overlay var(--anim-duration) allow-discrete,
      opacity var(--anim-duration);
    opacity: 0;
  }
  dialog[open],
  dialog[open]::backdrop {
    opacity: 1;
  }
  @starting-style {
    dialog[open],
    dialog[open]::backdrop {
      opacity: 0;
    }
  }
</style>

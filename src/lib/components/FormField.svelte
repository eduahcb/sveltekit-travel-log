<script lang="ts">
  type FormFieldProp = {
    value: string | number | undefined;
    type?: string;
    name?: string;
    label: string;
    error?: string[];
    disabled?: boolean;
  };

  let {
    label,
    error,
    value = $bindable(),
    type = "text",
    name,
    disabled = false,
  }: FormFieldProp = $props();
</script>

<label class="label">
  <span class="label-text">{label}</span>

  {#if type === "textarea"}
    <textarea
      {name}
      {disabled}
      class={["textarea", "resize-none", error && "ring-error-500"]}
      rows="4"
      bind:value
      aria-describedby={error ? `${name}-error` : undefined}
    ></textarea>
  {:else}
    <input
      {name}
      {disabled}
      {type}
      class={["input", error && "ring-error-500"]}
      bind:value
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${name}-error` : undefined}
    />
  {/if}

  {#if error}
    <span id={`${name}-error`} class="text-xs text-error-500">{error}</span>
  {/if}
</label>

<script lang="ts" generics="T">
  import type { DeepValue } from "@tanstack/svelte-form";
  import type { FormEventHandler } from "svelte/elements";

  type FormFieldProp = {
    value: DeepValue<T, string> | string | string[] | number | null | undefined;
    type?: string;
    name?: string;
    label: string;
    errors: string;
    disabled?: boolean;
    step?: string;
    oninput: FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  };

  const {
    label,
    errors,
    value,
    type = "text",
    name,
    disabled = false,
    step,
    oninput,
  }: FormFieldProp = $props();
</script>

<label class="label">
  <span class="label-text">{label}</span>

  {#if type === "textarea"}
    <textarea
      {name}
      {disabled}
      {oninput}
      class={["textarea", "resize-none", errors && "ring-error-500"]}
      rows="3"
      value={value as string}
      aria-describedby={errors ? `${name}-error` : undefined}
    ></textarea>
  {:else}
    <input
      {name}
      {disabled}
      {type}
      {step}
      {value}
      {oninput}
      class={["input", errors && "ring-error-500"]}
      aria-invalid={errors ? "true" : "false"}
      aria-describedby={errors ? `${name}-error` : undefined}
    />
  {/if}

  {#if errors}
    <span id={`${name}-error`} class="text-xs text-error-500">
      {errors}
    </span>
  {/if}
</label>

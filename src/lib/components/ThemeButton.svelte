<script lang="ts">
  import { getThemeContext } from "$lib/context/theme";
  import { Moon, Sun } from "@lucide/svelte";

  const themeStore = getThemeContext();

  function toggleTheme(event: Event) {
    const input = event.target as HTMLInputElement;

    const mode = input.checked ? "light" : "dark";
    themeStore().theme = mode;
  }
</script>

<label for="color-mode" class="swap" aria-label="toggle theme">
  <input
    id="color-mode"
    type="checkbox"
    checked={themeStore().theme === "light"}
    onchange={toggleTheme}
  />
  <div class="swap-on">
    <Moon size={24} />
  </div>
  <div class="swap-off">
    <Sun size={24} />
  </div>
</label>

<style>
  .swap {
    position: relative;
    width: 24px;
    height: 24px;
  }

  .swap input {
    appearance: none;
    position: absolute;
    inset: 0;
    cursor: pointer;
    z-index: 2;
  }

  .swap-on {
    z-index: 1;
    position: absolute;
    opacity: 0;
    transform: rotate(-50deg);
    transition:
      transform 0.2s ease-in-out,
      opacity 0.1s ease-in 0.025s;
  }

  .swap-off {
    position: absolute;
    opacity: 1;
    transform: rotate(0deg);
    transition:
      transform 0.2s ease-in-out,
      opacity 0.1s ease-in 0.025s;
  }

  .swap input:checked ~ .swap-on {
    opacity: 1;
    transform: rotate(0deg);
  }

  .swap input:checked ~ .swap-off {
    transform: rotate(50deg);
    opacity: 0;
  }
</style>

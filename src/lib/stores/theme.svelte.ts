import { browser } from "$app/environment";

type Theme = "light" | "dark";

export function createThemeStore() {
  let theme = $state<Theme>("dark");

  if (browser) {
    const mode = localStorage.getItem("mode") ?? theme;
    theme = mode as Theme;
  }

  return {
    get theme() {
      return theme;
    },
    set theme(value: Theme) {
      theme = value;
      localStorage.setItem("mode", theme);
      document.documentElement.dataset.mode = theme;
    },
  };
}

type Theme = "light" | "dark";

export function createThemeStore() {
  let theme = $state<Theme>("dark");

  $effect(() => {
    const mode = localStorage.getItem("mode") ?? theme;

    document.documentElement.dataset.mode = mode;
    theme = mode as Theme;
  });

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

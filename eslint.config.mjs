import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  formatters: true,
  svelte: true,
  tpescript: true,
  stylistic: {
    quotes: "double",
    semi: true,
  },

  ignores: [
    "vite.config.ts",
    "**/migrationos/**",
  ],
});

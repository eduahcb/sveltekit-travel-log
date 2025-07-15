import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  formatters: true,
  svelte: true,
  typescript: true,
  stylistic: {
    quotes: "double",
    semi: true,
  },

  ignores: [
    "vite.config.ts",
    "**/migrationos/**",
  ],
  rules: {
    "style/arrow-parens": "off",
  },
});

import antfu from "@antfu/eslint-config";

export default antfu({
  svelte: true,
  tpescript: true,
  stylistic: {
    quotes: "double",
    semi: true,
  },

  ignores: [
    "vite.config.ts",
  ],
});

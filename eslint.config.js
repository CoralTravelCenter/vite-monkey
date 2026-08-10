import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["**/dist/**", ".vite-monkey-runner/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: [
      "utils/**/*.js",
      "scripts/**/*.js",
      "test/**/*.js",
      "brands/**/*.js",
      "eslint.config.js",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
        Vimeo: "readonly",
        ym: "readonly",
      },
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];

import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "coverage", "node_modules"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      // lang/typescript TS-005, TS-010
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      // concern/security-web SEC-014, SEC-015
      "no-eval": "error",
      "no-new-func": "error",
      "no-implied-eval": "error",
    },
  },
);

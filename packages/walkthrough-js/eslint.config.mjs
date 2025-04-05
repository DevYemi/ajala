import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      "no-unused-private-class-members": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: ["variable", "classProperty", "typeProperty", "parameter"],
          format: ["snake_case"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: ["function", "objectLiteralMethod", "classMethod"],
          format: ["camelCase"],
        },
        {
          selector: ["interface", "typeAlias"],
          format: ["PascalCase"],
          prefix: ["T"],
        },
      ],
    },
  },
);

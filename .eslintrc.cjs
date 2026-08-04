module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    "postcss.config.js",
    "tailwind.config.js",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": "warn",

    /* `@typescript-eslint/ban-types` used to be configured here. It was removed
     * in typescript-eslint v8 and split into narrower rules — and configuring a
     * rule that no longer exists made ESLint fail once per file, so `npm run
     * lint` was reporting 145 phantom errors. */

    /* shadcn/ui components deliberately declare
     * `interface FooProps extends React.HTMLAttributes<T> {}` as a named
     * extension point. The rule can't tell that from an accidental empty type,
     * so single-extends interfaces are allowed. */
    "@typescript-eslint/no-empty-object-type": [
      "error",
      { allowInterfaces: "with-single-extends" },
    ],
  },
};

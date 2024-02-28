export default {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["standard-with-typescript", "plugin:vue/vue3-essential", "prettier"],
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.app.json"
  },
  plugins: ["vue"],
  rules: {
    // "@typescript-eslint/explicit-function-return-type": "off",
    // "@typescript-eslint/no-unsafe-argument": "off"
  }
};

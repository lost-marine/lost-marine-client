/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: ["standard-with-typescript", "plugin:vue/vue3-essential", "prettier"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./client/tsconfig.json", "./client/tsconfig.app.json", "./client/tsconfig.node.json"],
    extraFileExtensions: [".vue"] // .vue 파일 확장자 추가
  },
  plugins: ["vue"],
  rules: {
    "@typescript-eslint/consistent-type-definitions": "off"
  },
  ignorePatterns: ["vite/"]
};

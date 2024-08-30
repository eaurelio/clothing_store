const js = require("@eslint/js");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const jest = require("eslint-plugin-jest");

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      globals: {
        // Adiciona globals para Jest
        jest: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": ts,
      jest: jest
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error"]
    }
  }
];

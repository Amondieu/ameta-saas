const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

const typedFilePatterns = ["**/*.{ts,tsx,mts,cts}"];
const javascriptFilePatterns = ["**/*.{js,mjs,cjs}"];

const typedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: typedFilePatterns
}));

module.exports = {
  base: [
    {
      ignores: ["coverage/**", "dist/**", "node_modules/**"]
    },
    {
      ...js.configs.recommended,
      files: javascriptFilePatterns
    },
    ...typedConfigs,
    {
      files: typedFilePatterns,
      languageOptions: {
        parserOptions: {
          projectService: true
        }
      },
      rules: {
        "no-undef": "off"
      }
    }
  ]
};

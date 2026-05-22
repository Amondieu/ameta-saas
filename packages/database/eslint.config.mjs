import repoEslintConfig from "@repo/eslint-config";

export default [
  {
    ignores: ["vitest.config.integration.ts", "vitest.config.ts"]
  },
  ...repoEslintConfig.base
];

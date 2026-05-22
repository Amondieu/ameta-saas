import repoEslintConfig from "@repo/eslint-config";

export default [
  {
    ignores: ["vitest.config.ts"]
  },
  ...repoEslintConfig.base
];

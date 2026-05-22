import repoEslintConfig from "@repo/eslint-config";

export default [
  {
    ignores: ["tsup.config.ts", "vitest.config.ts"]
  },
  ...repoEslintConfig.base
];

import repoEslintConfig from "@repo/eslint-config";

export default [
  {
    ignores: [".next/**", "tsconfig.tsbuildinfo"]
  },
  ...repoEslintConfig.base
];

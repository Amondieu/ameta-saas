import { defineConfig } from "vitest/config";

import baseVitestConfig from "@repo/vitest-config";

export default defineConfig({
  ...baseVitestConfig,
  test: {
    ...baseVitestConfig.test,
    include: ["src/**/*.integration.ts"]
  }
});

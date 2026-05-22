import { defineConfig } from "vitest/config";

const baseVitestConfig = defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"]
    },
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"]
  }
});

export default baseVitestConfig;

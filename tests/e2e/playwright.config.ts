import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.API_URL ?? "http://localhost:3000"
  },
  webServer: process.env.CI
    ? undefined
    : {
        command: "pnpm --filter @repo/api dev",
        reuseExistingServer: true,
        url: "http://localhost:3000/health"
      }
});

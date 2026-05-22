import { describe, expect, it } from "vitest";

import { createLogger } from "./logger.js";

describe("createLogger", () => {
  it("returns a pino logger instance", () => {
    const logger = createLogger("telemetry-test");

    expect(typeof logger.info).toBe("function");
  });
});

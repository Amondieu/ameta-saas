import { describe, expect, it } from "vitest";

import { createLogger } from "@repo/telemetry";

import { app } from "./app.js";
import { appRouter } from "./trpc/router.js";

describe("api app", () => {
  it("returns a health payload without starting a server", async () => {
    const response = await app.request("/health");
    const body = (await response.json()) as {
      status: string;
      ts: number;
      version: string;
    };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "ok",
      version: "0.1.0"
    });
    expect(typeof body.ts).toBe("number");
  });

  it("executes the hello procedure through the router", async () => {
    const caller = appRouter.createCaller({
      currentMembership: null,
      logger: createLogger("api-test"),
      memberships: [],
      requestId: "req-123",
      session: null,
      tenantId: null,
      userId: null
    });

    const result = await caller.hello({ name: "AMeta" });

    expect(result).toEqual({
      message: "Hello, AMeta",
      requestId: "req-123"
    });
  });
});

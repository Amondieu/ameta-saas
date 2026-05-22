import { describe, expect, it } from "vitest";

import { helloSchema } from "./index.js";

describe("helloSchema", () => {
  it("accepts a non-empty name", () => {
    const parsed = helloSchema.parse({ name: "AMeta" });

    expect(parsed.name).toBe("AMeta");
  });

  it("rejects an empty name", () => {
    const result = helloSchema.safeParse({ name: "" });

    expect(result.success).toBe(false);
  });
});

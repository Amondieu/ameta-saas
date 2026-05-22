import { describe, expect, it } from "vitest";

import type { BillingProvider } from "./index.js";

describe("billing interfaces", () => {
  it("supports a minimal provider contract for the SaaS shell", () => {
    const provider: BillingProvider = {
      getSubscription() {
        return Promise.resolve(null);
      },
      getUsage(tenantId) {
        return Promise.resolve({
          periodEnd: "2026-12-31",
          periodStart: "2026-01-01",
          seats: 1,
          tenantId
        });
      },
      listPlans() {
        return Promise.resolve([
          {
            description: "Base workspace access",
            id: "free",
            name: "Free"
          }
        ]);
      }
    };

    expect(provider).toBeDefined();
  });
});

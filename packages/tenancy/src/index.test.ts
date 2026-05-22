import { describe, expect, it } from "vitest";

import { getMembershipFromContext, getTenantFromRequest } from "./index.js";

describe("tenancy helpers", () => {
  it("prefers an explicit tenant header over the current tenant claim", () => {
    const headers = new Headers({
      "x-tenant-id": "tenant-b"
    });

    expect(
      getTenantFromRequest({
        currentTenantId: "tenant-a",
        headers
      })
    ).toBe("tenant-b");
  });

  it("returns the current membership for the active tenant", () => {
    const membership = getMembershipFromContext({
      memberships: [
        { role: "owner", tenantId: "tenant-a" },
        { role: "member", tenantId: "tenant-b" }
      ],
      tenantId: "tenant-b"
    });

    expect(membership).toEqual({
      role: "member",
      tenantId: "tenant-b"
    });
  });
});

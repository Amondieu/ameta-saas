import { createLogger } from "@repo/telemetry";
import { db, tenant, tenantMembership, user } from "@repo/database";
import { inArray } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";

import type { AppContext } from "./context.js";
import { appRouter } from "./router.js";

const createdUserIds: string[] = [];
const createdTenantIds: string[] = [];
const createdMembershipIds: string[] = [];

function createTenantContext(input: {
  currentMembership: AppContext["currentMembership"];
  memberships: AppContext["memberships"];
  tenantId: string | null;
  userId: string;
}): AppContext {
  return {
    currentMembership: input.currentMembership,
    logger: createLogger("api-integration-test"),
    memberships: input.memberships,
    requestId: "req-integration",
    session: {
      session: {
        id: "session-id"
      },
      user: {
        currentTenantId: input.tenantId,
        id: input.userId
      }
    } as unknown as AppContext["session"],
    tenantId: input.tenantId,
    userId: input.userId
  };
}

afterEach(async () => {
  if (createdMembershipIds.length > 0) {
    await db
      .delete(tenantMembership)
      .where(inArray(tenantMembership.id, createdMembershipIds.splice(0, createdMembershipIds.length)));
  }

  if (createdTenantIds.length > 0) {
    await db.delete(tenant).where(inArray(tenant.id, createdTenantIds.splice(0, createdTenantIds.length)));
  }

  if (createdUserIds.length > 0) {
    await db.delete(user).where(inArray(user.id, createdUserIds.splice(0, createdUserIds.length)));
  }
});

describe("tenant procedures", () => {
  it("shows only the active tenant data and rejects cross-tenant access", async () => {
    const now = new Date();
    const tenantAId = crypto.randomUUID();
    const tenantBId = crypto.randomUUID();
    const userAId = crypto.randomUUID();
    const userBId = crypto.randomUUID();
    const membershipAId = crypto.randomUUID();
    const membershipBId = crypto.randomUUID();

    createdTenantIds.push(tenantAId, tenantBId);
    createdUserIds.push(userAId, userBId);
    createdMembershipIds.push(membershipAId, membershipBId);

    await db.insert(user).values([
      {
        createdAt: now,
        currentTenantId: tenantAId,
        email: `tenant-a-${tenantAId}@example.com`,
        emailVerified: true,
        id: userAId,
        name: "Tenant A User",
        updatedAt: now
      },
      {
        createdAt: now,
        currentTenantId: tenantBId,
        email: `tenant-b-${tenantBId}@example.com`,
        emailVerified: true,
        id: userBId,
        name: "Tenant B User",
        updatedAt: now
      }
    ]);

    await db.insert(tenant).values([
      {
        createdAt: now,
        id: tenantAId,
        name: "Tenant A",
        slug: `tenant-a-${tenantAId.slice(0, 8)}`,
        updatedAt: now
      },
      {
        createdAt: now,
        id: tenantBId,
        name: "Tenant B",
        slug: `tenant-b-${tenantBId.slice(0, 8)}`,
        updatedAt: now
      }
    ]);

    await db.insert(tenantMembership).values([
      {
        createdAt: now,
        id: membershipAId,
        role: "owner",
        tenantId: tenantAId,
        updatedAt: now,
        userId: userAId
      },
      {
        createdAt: now,
        id: membershipBId,
        role: "owner",
        tenantId: tenantBId,
        updatedAt: now,
        userId: userBId
      }
    ]);

    const tenantACaller = appRouter.createCaller(
      createTenantContext({
        currentMembership: { role: "owner", tenantId: tenantAId },
        memberships: [{ role: "owner", tenantId: tenantAId }],
        tenantId: tenantAId,
        userId: userAId
      })
    );

    const members = await tenantACaller.tenantMembers();

    expect(members).toHaveLength(1);
    expect(members[0]).toMatchObject({
      email: `tenant-a-${tenantAId}@example.com`,
      tenantId: tenantAId,
      userId: userAId
    });

    const crossTenantCaller = appRouter.createCaller(
      createTenantContext({
        currentMembership: null,
        memberships: [{ role: "owner", tenantId: tenantAId }],
        tenantId: tenantBId,
        userId: userAId
      })
    );

    await expect(crossTenantCaller.currentTenant()).rejects.toMatchObject({
      code: "FORBIDDEN"
    });
  });
});

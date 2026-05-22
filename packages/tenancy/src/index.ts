import { eq, type AnyColumn } from "drizzle-orm";

export type TenantMembershipLike = {
  role: string;
  tenantId: string;
};

export function getTenantFromRequest(input: {
  currentTenantId: string | null;
  headers: Headers;
}): string | null {
  return input.headers.get("x-tenant-id") ?? input.currentTenantId;
}

export function getMembershipFromContext<TMembership extends TenantMembershipLike>(input: {
  memberships: TMembership[];
  tenantId: string | null;
}): TMembership | null {
  if (!input.tenantId) {
    return null;
  }

  return input.memberships.find((membership) => membership.tenantId === input.tenantId) ?? null;
}

export function withTenantFilter<TColumn extends AnyColumn>(tenantColumn: TColumn, tenantId: string) {
  return eq(tenantColumn, tenantId);
}

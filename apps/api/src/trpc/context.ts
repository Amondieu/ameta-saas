import type { AuthSession } from "@repo/auth";
import type { TenantRole } from "@repo/database";
import type { createLogger } from "@repo/telemetry";

export type TenantMembershipSummary = {
  role: TenantRole;
  tenantId: string;
};

export type AppContext = {
  currentMembership: TenantMembershipSummary | null;
  logger: ReturnType<typeof createLogger>;
  memberships: TenantMembershipSummary[];
  requestId: string | null;
  session: AuthSession | null;
  tenantId: string | null;
  userId: string | null;
};

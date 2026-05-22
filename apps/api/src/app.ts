import { getAuth, getSessionFromHeaders } from "@repo/auth";
import { db, tenantMembership } from "@repo/database";
import { getMembershipFromContext, getTenantFromRequest } from "@repo/tenancy";
import { createLogger } from "@repo/telemetry";
import { trpcServer } from "@hono/trpc-server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { healthHandler } from "./routes/health.js";
import { requestLogger } from "./middleware/request-logger.js";
import type { AppContext } from "./trpc/context.js";
import { appRouter } from "./trpc/router.js";

export const app = new Hono();

app.use("*", requestLogger);

app.get("/health", healthHandler);

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return getAuth().handler(c.req.raw);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (_opts, c): Promise<AppContext> => {
      const requestId = c.req.header("x-request-id") ?? null;
      const session = await getSessionFromHeaders(c.req.raw.headers);
      const userId = session?.user.id ?? null;
      const currentTenantId =
        (session?.user as { currentTenantId?: string | null } | undefined)?.currentTenantId ?? null;
      const membershipRows = userId
        ? await db
            .select({
              role: tenantMembership.role,
              tenantId: tenantMembership.tenantId
            })
            .from(tenantMembership)
            .where(eq(tenantMembership.userId, userId))
        : [];
      const tenantId = getTenantFromRequest({
        currentTenantId,
        headers: c.req.raw.headers
      });
      const currentMembership = getMembershipFromContext({
        memberships: membershipRows,
        tenantId
      });
      const logger = createLogger("api").child({
        requestId,
        tenantId: currentMembership?.tenantId ?? tenantId ?? undefined,
        userId: userId ?? undefined
      });

      return {
        currentMembership,
        logger,
        memberships: membershipRows,
        requestId,
        session,
        tenantId,
        userId
      };
    }
  })
);

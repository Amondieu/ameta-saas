import { db, sql, tenant, tenantMembership, user } from "@repo/database";
import { helloSchema } from "@repo/schema";
import { TRPCError, initTRPC } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import type { AppContext } from "./context.js";

const t = initTRPC.context<AppContext>().create();

const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to access this resource."
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      userId: ctx.userId
    }
  });
});

const tenantProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.tenantId || !ctx.currentMembership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to the requested tenant."
    });
  }

  return next({
    ctx: {
      ...ctx,
      currentMembership: ctx.currentMembership,
      tenantId: ctx.tenantId
    }
  });
});

export const appRouter = t.router({
  currentTenant: tenantProcedure.query(async ({ ctx }) => {
    const [currentTenant] = await db
      .select({
        id: tenant.id,
        name: tenant.name,
        role: tenantMembership.role,
        slug: tenant.slug
      })
      .from(tenant)
      .innerJoin(
        tenantMembership,
        and(eq(tenantMembership.tenantId, tenant.id), eq(tenantMembership.userId, ctx.userId))
      )
      .where(eq(tenant.id, ctx.tenantId))
      .limit(1);

    if (!currentTenant) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "The active tenant is not available to the current user."
      });
    }

    ctx.logger.info({ tenantId: currentTenant.id }, "Loaded current tenant");

    return {
      id: currentTenant.id,
      name: currentTenant.name,
      role: currentTenant.role,
      slug: currentTenant.slug
    };
  }),
  hello: t.procedure.input(helloSchema).query(({ ctx, input }) => {
    return {
      message: `Hello, ${input.name}`,
      requestId: ctx.requestId
    };
  }),
  tenantBootstrap: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z
          .string()
          .min(1)
          .regex(/^[a-z0-9-]+$/)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      const tenantId = crypto.randomUUID();

      await db.insert(tenant).values({
        createdAt: now,
        id: tenantId,
        name: input.name,
        slug: input.slug,
        updatedAt: now
      });

      await db.insert(tenantMembership).values({
        createdAt: now,
        id: crypto.randomUUID(),
        role: "owner",
        tenantId,
        updatedAt: now,
        userId: ctx.userId
      });

      await db
        .update(user)
        .set({
          currentTenantId: tenantId
        })
        .where(eq(user.id, ctx.userId));

      ctx.logger.info({ tenantId }, "Bootstrapped tenant");

      return {
        id: tenantId,
        name: input.name,
        role: "owner" as const,
        slug: input.slug
      };
    }),
  tenantMembers: tenantProcedure.query(async ({ ctx }) => {
    const members = await db
      .select({
        currentTenantId: user.currentTenantId,
        email: user.email,
        role: tenantMembership.role,
        tenantId: tenantMembership.tenantId,
        userId: user.id
      })
      .from(tenantMembership)
      .innerJoin(user, eq(user.id, tenantMembership.userId))
      .where(eq(tenantMembership.tenantId, ctx.tenantId));

    ctx.logger.info({ memberCount: members.length, tenantId: ctx.tenantId }, "Loaded tenant members");

    return members;
  }),
  tenantMemberships: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select({
        id: tenant.id,
        name: tenant.name,
        role: tenantMembership.role,
        slug: tenant.slug
      })
      .from(tenantMembership)
      .innerJoin(tenant, eq(tenant.id, tenantMembership.tenantId))
      .where(eq(tenantMembership.userId, ctx.userId));
  }),
  tenantSetCurrent: protectedProcedure
    .input(
      z.object({
        tenantId: z.string().min(1)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [membership] = await db
        .select({
          role: tenantMembership.role,
          tenantId: tenantMembership.tenantId
        })
        .from(tenantMembership)
        .where(
          and(eq(tenantMembership.tenantId, input.tenantId), eq(tenantMembership.userId, ctx.userId))
        )
        .limit(1);

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not belong to the requested tenant."
        });
      }

      await db
        .update(user)
        .set({
          currentTenantId: input.tenantId
        })
        .where(eq(user.id, ctx.userId));

      ctx.logger.info({ tenantId: input.tenantId }, "Switched current tenant");

      return {
        ok: true,
        role: membership.role,
        tenantId: membership.tenantId
      };
    }),
  databaseHealth: t.procedure.query(async () => {
    const rows = await sql<{ ok: number }[]>`select 1 as ok`;

    return {
      ok: rows[0]?.ok === 1
    };
  })
});

export type AppRouter = typeof appRouter;

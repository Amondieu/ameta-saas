import { pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { user } from "./auth.js";

export const tenantRole = pgEnum("tenant_role", ["owner", "admin", "member"]);

export const tenant = pgTable("tenant", {
  createdAt: timestamp("created_at").notNull(),
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  updatedAt: timestamp("updated_at").notNull()
});

export const tenantMembership = pgTable(
  "tenant_membership",
  {
    createdAt: timestamp("created_at").notNull(),
    id: text("id").primaryKey(),
    role: tenantRole("role").notNull(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenant.id, { onDelete: "cascade" }),
    updatedAt: timestamp("updated_at").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
  },
  (table) => ({
    tenantMembershipUserTenantUnique: uniqueIndex("tenant_membership_user_tenant_unique").on(
      table.userId,
      table.tenantId
    )
  })
);

export type TenantRole = (typeof tenantRole.enumValues)[number];

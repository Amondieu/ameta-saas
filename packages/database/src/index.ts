export { db, sql } from "./client.js";
export {
  account,
  schema,
  session,
  tenant,
  tenantMembership,
  tenantRole,
  user,
  verification
} from "./schema/index.js";
export type { TenantRole } from "./schema/tenancy.js";

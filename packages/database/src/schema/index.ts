export { account, session, user, verification } from "./auth.js";
export { tenant, tenantMembership, tenantRole } from "./tenancy.js";

import { account, session, user, verification } from "./auth.js";
import { tenant, tenantMembership, tenantRole } from "./tenancy.js";

export const schema = {
  account,
  session,
  tenant,
  tenantMembership,
  tenantRole,
  user,
  verification
};

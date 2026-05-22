import type { TRPCClientErrorLike } from "@trpc/client";

import type { AppRouter } from "@repo/api/trpc";

import { createApiClient } from "../../lib/api";
import { bootstrapTenantAction, setCurrentTenantAction } from "./actions";

function UnauthenticatedWorkspace() {
  return (
    <section className="card">
      <h2>Workspace</h2>
      <p className="muted">
        Sign in through the shared auth API first, then return here to create or switch your
        active tenant.
      </p>
    </section>
  );
}

export default async function WorkspacePage() {
  const api = await createApiClient();

  let memberships: Awaited<ReturnType<typeof api.tenantMemberships.query>> | null = null;

  try {
    memberships = await api.tenantMemberships.query();
  } catch {
    return <UnauthenticatedWorkspace />;
  }

  if (memberships.length === 0) {
    return (
      <section className="card">
        <h2>Create your first workspace</h2>
        <p className="muted">
          Tenant bootstrap stays on the shared API. This creates the first tenant and sets it as
          your current workspace.
        </p>
        <form action={bootstrapTenantAction}>
          <label htmlFor="name">Workspace name</label>
          <input id="name" name="name" placeholder="Acme" required />
          <div className="actions">
            <button type="submit">Create workspace</button>
          </div>
        </form>
      </section>
    );
  }

  let currentTenant: Awaited<ReturnType<typeof api.currentTenant.query>> | null = null;
  let currentTenantError: TRPCClientErrorLike<AppRouter> | null = null;

  try {
    currentTenant = await api.currentTenant.query();
  } catch (error) {
    currentTenantError = error as TRPCClientErrorLike<AppRouter>;
  }

  return (
    <>
      <section className="card">
        <h2>Current workspace</h2>
        {currentTenant ? (
          <>
            <p>
              <strong>{currentTenant.name}</strong> ({currentTenant.slug})
            </p>
            <p className="muted">Role: {currentTenant.role}</p>
          </>
        ) : (
          <p className="muted">
            No active workspace is selected yet. Pick one below to set your current tenant.
            {currentTenantError ? ` (${currentTenantError.message})` : ""}
          </p>
        )}
      </section>

      <section className="card">
        <h2>Available workspaces</h2>
        <ul className="muted">
          {memberships.map((membership) => (
            <li key={membership.id}>
              <strong>{membership.name}</strong> ({membership.slug}) - {membership.role}
              <form action={setCurrentTenantAction}>
                <input name="tenantId" type="hidden" value={membership.id} />
                <div className="actions">
                  <button type="submit">Switch to this workspace</button>
                </div>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

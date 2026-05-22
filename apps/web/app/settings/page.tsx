import { createApiClient } from "../../lib/api";

export default async function SettingsPage() {
  const api = await createApiClient();

  try {
    const [currentTenant, memberships] = await Promise.all([
      api.currentTenant.query(),
      api.tenantMemberships.query()
    ]);

    return (
      <>
        <section className="card">
          <h2>Workspace settings</h2>
          <p>
            <strong>{currentTenant.name}</strong> ({currentTenant.slug})
          </p>
          <p className="muted">Role: {currentTenant.role}</p>
        </section>

        <section className="card">
          <h2>Billing surface</h2>
          <p className="muted">
            Billing is intentionally interface-only in this phase. The shell currently needs three
            concepts from the future billing package: plan identity, current subscription, and a
            usage snapshot.
          </p>
        </section>

        <section className="card">
          <h2>Memberships</h2>
          <ul className="muted">
            {memberships.map((membership) => (
              <li key={membership.id}>
                {membership.name} ({membership.slug}) - {membership.role}
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  } catch {
    return (
      <section className="card">
        <h2>Settings</h2>
        <p className="muted">Sign in through the shared auth API to access tenant settings.</p>
      </section>
    );
  }
}

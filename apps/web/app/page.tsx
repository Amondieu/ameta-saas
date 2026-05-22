import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="card">
        <h2>SaaS Platform Base</h2>
        <p className="muted">
          This repo extends the AMeta kernel with row-level tenancy, tenant-aware API context, and
          a dedicated web shell for workspace onboarding and switching.
        </p>
      </section>

      <section className="card">
        <h2>What this shell does</h2>
        <ul className="muted">
          <li>Uses the Hono + tRPC API as its only application backend.</li>
          <li>Bootstraps the first tenant for a signed-in user.</li>
          <li>Shows the current workspace and lets a user switch active tenants.</li>
          <li>Leaves billing provider selection for a later layer.</li>
        </ul>
        <div className="actions">
          <Link href="/workspace">Open workspace</Link>
          <Link href="/settings">View settings</Link>
        </div>
      </section>
    </>
  );
}

import { apiBaseUrl } from "../../lib/api";

export default function LoginPage() {
  return (
    <section className="card">
      <h2>Login</h2>
      <p className="muted">
        The first SaaS shell keeps authentication on the shared API server. Use the Better Auth
        email/password flows exposed at:
      </p>
      <p>
        <code>{apiBaseUrl}/api/auth/*</code>
      </p>
      <p className="muted">
        Once authenticated, return to the workspace shell to bootstrap or switch tenants.
      </p>
    </section>
  );
}

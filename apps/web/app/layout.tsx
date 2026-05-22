import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  description: "AMeta-SaaS multi-tenant workspace shell.",
  title: "AMeta-SaaS"
};

export default function RootLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <main>
          <div className="shell">
            <header className="card">
              <h1>AMeta-SaaS</h1>
              <p className="muted">
                Multi-tenant SaaS shell layered on top of the AMeta kernel. All runtime data flows
                through the Hono + tRPC API.
              </p>
              <nav className="actions">
                <Link href="/">Home</Link>
                <Link href="/workspace">Workspace</Link>
                <Link href="/settings">Settings</Link>
                <Link href="/login">Login</Link>
              </nav>
            </header>
            {props.children}
          </div>
        </main>
      </body>
    </html>
  );
}

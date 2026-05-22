import type { createAuth } from "./index.js";

export type AuthInstance = ReturnType<typeof createAuth>;
export type AuthSession = Awaited<ReturnType<AuthInstance["api"]["getSession"]>>;

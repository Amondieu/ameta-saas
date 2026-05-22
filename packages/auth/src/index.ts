import "dotenv/config";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

import { db, schema } from "@repo/database";

function buildAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is required to initialize Better Auth.");
  }

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_BASE_URL ?? "http://localhost:3000",
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        account: schema.account,
        session: schema.session,
        user: schema.user,
        verification: schema.verification
      }
    }),
    emailAndPassword: {
      enabled: true
    },
    secret
  });
}

let authInstance: ReturnType<typeof buildAuth> | undefined;

export function createAuth() {
  if (authInstance) {
    return authInstance;
  }

  authInstance = buildAuth();

  return authInstance;
}

export const getAuth = () => createAuth();
export type { AuthInstance } from "./types.js";

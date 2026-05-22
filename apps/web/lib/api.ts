import type { AppRouter } from "@repo/api/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { headers } from "next/headers";

export const apiBaseUrl =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function createApiClient(): Promise<ReturnType<typeof createTRPCProxyClient<AppRouter>>> {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");
  const tenantId = requestHeaders.get("x-tenant-id");
  const requestId = requestHeaders.get("x-request-id");

  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        headers() {
          return {
            ...(cookie ? { cookie } : {}),
            ...(requestId ? { "x-request-id": requestId } : {}),
            ...(tenantId ? { "x-tenant-id": tenantId } : {})
          };
        },
        url: `${apiBaseUrl}/trpc`
      })
    ]
  });
}

import { getAuth } from "@repo/auth";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";

import { healthHandler } from "./routes/health.js";
import { requestLogger } from "./middleware/request-logger.js";
import type { AppContext } from "./trpc/context.js";
import { appRouter } from "./trpc/router.js";

export const app = new Hono();

app.use("*", requestLogger);

app.get("/health", healthHandler);

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return getAuth().handler(c.req.raw);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, c): AppContext => ({
      requestId: c.req.header("x-request-id") ?? null
    })
  })
);

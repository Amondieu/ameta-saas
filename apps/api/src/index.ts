import { bootstrapTracing } from "@repo/telemetry";

const port = Number(process.env.PORT ?? 3000);

bootstrapTracing("api");

const [{ serve }, { createLogger }, { app }] = await Promise.all([
  import("@hono/node-server"),
  import("@repo/telemetry"),
  import("./app.js")
]);

const logger = createLogger("api");

serve({ fetch: app.fetch, port }, (info) => {
  logger.info(`API listening on http://localhost:${info.port}`);
});

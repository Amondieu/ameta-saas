import type { Context } from "hono";

export const healthHandler = (c: Context) => {
  return c.json({
    status: "ok",
    version: "0.1.0",
    ts: Date.now()
  });
};

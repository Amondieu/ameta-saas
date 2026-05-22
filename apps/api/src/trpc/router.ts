import { sql } from "@repo/database";
import { helloSchema } from "@repo/schema";
import { initTRPC } from "@trpc/server";

import type { AppContext } from "./context.js";

const t = initTRPC.context<AppContext>().create();

export const appRouter = t.router({
  databaseHealth: t.procedure.query(async () => {
    const rows = await sql`select 1 as ok`;
    const firstRow = rows[0] as { ok: number } | undefined;

    return {
      ok: firstRow?.ok === 1
    };
  }),
  hello: t.procedure.input(helloSchema).query(({ ctx, input }) => {
    return {
      message: `Hello, ${input.name}`,
      requestId: ctx.requestId
    };
  })
});

export type AppRouter = typeof appRouter;

import { logger as honoLogger } from "hono/logger";

import { createLogger } from "@repo/telemetry";

const log = createLogger("api");

export const requestLogger = honoLogger((line) => {
  const outgoingMatch = /^--> (?<method>[A-Z]+) (?<path>\S+) (?<status>\d{3}) (?<duration>.+)$/.exec(
    line
  );

  if (outgoingMatch?.groups) {
    log.info({
      duration: outgoingMatch.groups.duration,
      method: outgoingMatch.groups.method,
      path: outgoingMatch.groups.path,
      status: Number(outgoingMatch.groups.status)
    });
    return;
  }

  const incomingMatch = /^<-- (?<method>[A-Z]+) (?<path>\S+)$/.exec(line);

  if (incomingMatch?.groups) {
    log.debug({
      method: incomingMatch.groups.method,
      path: incomingMatch.groups.path,
      phase: "incoming"
    });
    return;
  }

  log.debug({ line });
});

import pino, { type Logger } from "pino";

export function createLogger(serviceName: string): Logger {
  return pino({
    base: {
      service: serviceName
    },
    level: process.env.LOG_LEVEL ?? "info"
  });
}

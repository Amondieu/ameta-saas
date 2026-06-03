# Load Balancer — AMeta-SaaS

Verteilt API-Requests optimal zwischen verfügbaren Diensten.

## Routen

| Dienst | Priorität | Token-Kosten | Latenz |
|--------|-----------|-------------|--------|
| lokale Dev-API | 1 | variabel | ~50ms |
| Sigmap MCP | 2 | ~97% reduziert | ~100ms |
| Codebase Memory | 3 | ~99% gecached | ~50ms |

## Failover-Strategie

1. Primär: Lokale Dev-API (localhost:8787)
2. Sekundär: Sigmap MCP (wenn API nicht erreichbar)
3. Codebase-Memory-MCP immer aktiv für persistentes Wissen

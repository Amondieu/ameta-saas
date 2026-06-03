# Performance Monitor — AMeta-SaaS

Überwacht Token-Verbrauch und optimiert Context-Nutzung.

## Metriken

1. **Token pro Session** — Claude meldet Context-Window-Nutzung in environment_details
2. **bd prime Laufzeit** — Soll < 500ms bleiben (reine Statusabfrage)
3. **Repomix-Laufzeit** — `pnpm repomix` soll < 30s bleiben bei ~70% Reduktion

## Optimierungs-Regeln

- Bei Context > 70% → automatisch `bd close` für abgeschlossene Issues erwägen
- Bei Context > 85% → nur noch die 3 wichtigsten Dateien laden (kernel-contract, map, decisions)
- Repomix nur nutzen wenn > 3 zusammenhängende Packages geändert werden müssen
- Codebase-Memory-MCP für Cross-Session-Knowledge priorisieren vor Repomix

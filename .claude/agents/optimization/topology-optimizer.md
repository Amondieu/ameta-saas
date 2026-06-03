# Topology Optimizer — AMeta-SaaS

Optimiert die Dependency-Struktur zwischen den konfigurierten Tools.

## Aktuelle Topologie

1. **bd (beads)** — Task-Tracking, sessionStart-Hook
2. **Repomix** — Codebase-Kompression (bei Bedarf) — ~70%
3. **Sigmap MCP** — Multilinguale Context-Optimierung — ~97%
4. **Codebase-Memory-MCP** — Persistenter Knowledge Graph — ~99%
5. **Kernel Rules** — `.cursor/rules/kernel.mdc` für Invarianten

## Reihenfolge der Tool-Aktivierung

1. SessionStart → `bd prime` (0 Token, < 500ms)
2. Kernel Rules laden (kernel.mdc, immer aktiv)
3. Bei Bedarf → Repomix-Output laden (70% Reduktion)
4. Codebase-Memory-MCP für Cross-Session-Knowledge (99% gecached)
5. Sigmap für multilinguale Optimierung (97% Reduktion)

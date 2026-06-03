# Benchmark Suite — AMeta-SaaS

Metriken zur Messung der Optimierungseffektivität.

## Baseline

| Metrik | Wert |
|--------|------|
| Context Window bei Session-Start | ~30-50% |
| Token für Codebase-Überblick | ~15-25K |
| bd prime Laufzeit | ~300ms |
| Anzahl Packages | 17+ |

## Ziel (nach Optimierung)

| Tool | Reduktion | Zielwert |
|------|-----------|----------|
| Repomix --compress | ~70% | 5-8K Tokens für gesamtes Repo |
| Lean CTX (hooks) | 60-99% (cached) | < 5K für Session-Start |
| Sigmap MCP | ~97% | 1-2K für multilinguale Kontexte |
| Codebase-Memory-MCP | ~99% | < 1K für Cross-Session-Wissen |

## Test

```bash
# Repomix-Benchmark
pnpm repomix

# bd prime Geschwindigkeit
time bd prime

# Codebase-Memory-Check
pnpm exec @anthropic/codebase-memory-mcp --stats
```

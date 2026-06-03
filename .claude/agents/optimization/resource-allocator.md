# Resource Allocator — AMeta-SaaS

Optimiert die Token-Nutzung durch selektives Laden nur der benötigten Kontextbereiche.

## Strategie

1. **Session-Kontext auf zentrale Docs begrenzen** — `docs/kernel-contract.md` → `docs/map.md` → `docs/decisions.md`
2. **Repomix bei Bedarf** — `pnpm repomix` für vollständigen Codebase-Context nur bei Cross-Package-Änderungen
3. **Dokumentation aus sessions/ verwenden** — `docs/sessions/` für aktuelle Cross-Package-Arbeit
4. **bd prime** vor jeder kompakten Session läuft

## Implementierung

- `.cursor/rules/kernel.mdc` definiert Kernel Invariants inkl. Optimierungs-Invarianten
- `bd prime` lädt keine Daten, gibt nur Workflow-Kontext aus
- Claude `PreCompact` Hook stellt sicher, dass bd prime vor Context-Komprimierung läuft

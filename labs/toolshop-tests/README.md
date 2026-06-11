# labs/toolshop-tests — El spine project

Este directorio es el **hilo conductor** del programa: el framework de automatización que construyes contra [Toolshop](https://practicesoftwaretesting.com) y que crece desde el Curso 1 Módulo 4 hasta el capstone.

> **No hay código aquí todavía — ese es el punto.** Lo construyes tú, módulo a módulo, siguiendo los labs. Este archivo es solo el mapa de cómo va creciendo. El aprender-haciendo es el método: cada lab te dice qué construir y cómo; tú lo escribes.

## Cómo nace y crece

| Hito | Módulo | Qué añades |
|------|--------|-----------|
| 🌱 Nace | C1-M3/M4 | `package.json`, TypeScript, cliente API tipado, Zod, primera suite API con Playwright |
| Crece | C1-M5 | Suite UI (`tests/ui/`), `playwright.config.ts` con projects api/ui |
| Se ordena | C1-M6 | `pages/`, `fixtures/`, factories de test data |
| Se automatiza | C1-M8 | `.github/workflows/tests.yml` (en la raíz del repo) |
| Se arquitectura | C2-M1 | `packages/` (framework-core, shared-schemas, api-tests, ui-tests), config multi-ambiente, lint rules |
| Se extiende | C2-M2..M5 | `contract-tests/`, `integration-tests/`, capa visual+a11y, `perf-tests/` (k6) |
| Se industrializa | C2-M6/M7 | Sharding, gestión de flakiness, instrumentación OTel |
| Se agentifica | C3-S3 | Un agente lo opera vía las tools QA y el MCP de Playwright |
| Se auto-repara | 🏆 Capstone | El agente Healer repara selectores con audit trail y HITL |

## Setup del SUT (sistema bajo prueba)

```bash
# Vía A — local con Docker (recomendada):
git clone https://github.com/testsmith-io/practice-software-testing.git
cd practice-software-testing && docker compose up -d
docker compose exec laravel-api php artisan migrate:fresh --seed
# UI: http://localhost:4200 — API: http://localhost:8091 — Swagger: /api/documentation

# Vía B — instancia hospedada (sin Docker):
# UI: https://practicesoftwaretesting.com — API: https://api.practicesoftwaretesting.com
```

Variables de entorno que usan los labs: `TOOLSHOP_API`, `TOOLSHOP_UI`, `TEST_ENV` (local|hosted).

## Credenciales de seed útiles

- Cliente: `customer@practicesoftwaretesting.com` / `welcome01`
- Admin: `admin@practicesoftwaretesting.com` / `welcome01`

## docs/

Los labs producen documentación real en `docs/` (test plans, api-notes, test-strategy, bugs, ci-notes...). Esos documentos son, además, el corpus del RAG que construyes en el Curso 3 spec-01.

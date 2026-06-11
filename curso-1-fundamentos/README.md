# Curso 1 — Fundamentos

**Objetivo:** al terminar este curso tienes una suite de automatización real (API + UI) corriendo en CI contra Toolshop, y dominas los conceptos que el 90 % de las entrevistas de QA/SDET evalúan primero: mentalidad de testing, HTTP, diseño de casos y Playwright.

**Duración:** ~8 semanas a 10 h/semana. **Prerequisito:** saber programar en cualquier lenguaje (no necesitas TypeScript previo — el M3 lo cubre).

## Módulos

| # | Módulo | Resultado tangible |
|---|--------|--------------------|
| 1 | [Mentalidad de testing](modulo-01-mentalidad-de-testing.md) | Test plan de Toolshop priorizado por riesgo |
| 2 | [Caja de herramientas técnica](modulo-02-caja-de-herramientas.md) | API de Toolshop explorada y documentada |
| 3 | [TypeScript para testers](modulo-03-typescript-para-testers.md) | Cliente API tipado funcionando |
| 4 | [API testing primero](modulo-04-api-testing.md) | 🌱 Nace el spine project: suite API + Zod |
| 5 | [UI testing con Playwright](modulo-05-ui-testing-playwright.md) | Suite UI del flujo de compra |
| 6 | [Patrones de diseño de tests](modulo-06-patrones-de-tests.md) | Suite refactorizada a POM + fixtures |
| 7 | [Diseño de casos y exploratorio](modulo-07-diseno-de-casos.md) | Casos formales + reporte de bugs reales |
| 8 | [CI básico](modulo-08-ci-basico.md) | Suite corriendo en GitHub Actions |
| ✓ | [Checkpoint](checkpoint-curso-1.md) | Feature nueva cubierta de punta a punta, sin guía |

## Por qué este orden

- **El M1 va antes que cualquier herramienta** porque la herramienta cambia cada 3 años; el criterio de qué probar y por qué, no.
- **API testing (M4) va antes que UI (M5)** deliberadamente: la capa API es más estable, más rápida y enseña a pensar en contratos antes que en clics. La mayoría de los cursos hacen lo contrario y producen testers que solo saben hacer clic.
- **Los patrones (M6) llegan DESPUÉS de que escribiste tests "feos"** en M4-M5. Refactorizar tu propio código desordenado enseña más que empezar con la estructura perfecta.
- **El diseño formal de casos (M7) llega cuando ya automatizas**, para que las técnicas (boundary values, decision tables) se apliquen de inmediato sobre tests reales.

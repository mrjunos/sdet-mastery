# ✓ Checkpoint Curso 1 — Cobertura completa de una feature, sin guía

> Este es tu examen práctico. **No hay pasos.** Solo una misión, restricciones y criterios de aceptación — como un ticket real. Si necesitas volver a mirar los labs constantemente, no estás listo: repasa primero los módulos donde dudaste.

## La misión

Eres el SDET asignado a la feature **"Favoritos"** de Toolshop (un usuario logueado puede marcar productos como favoritos, verlos en su cuenta y quitarlos). Entrega la cobertura de testing completa de la feature, de punta a punta, como un PR profesional.

## Entregables

1. **Mini test plan** (`docs/checkpoint-1-plan.md`, máx. media página): riesgo de la feature, qué pruebas en qué capa, qué NO automatizas y por qué. *(M1)*
2. **Exploración de la API** de favoritos documentada: endpoints, auth, status codes — incluidos los de error. *(M2)*
3. **Diseño formal**: clases de equivalencia y/o tabla de decisión de la feature (¿favorito duplicado? ¿sin login? ¿producto inexistente?). *(M7)*
4. **Suite API**: tests con schemas Zod, casos felices y de error, parametrizados donde aplique. *(M4, M7)*
5. **Suite UI**: el flujo marcar → ver en cuenta → quitar, con Page Objects nuevos y fixtures (incluido el login por fixture, no inline). Test data creada por API. *(M5, M6)*
6. **Todo en un PR** con CI verde, abierto desde una branch `feat/checkpoint-1`. *(M8)*

## Restricciones (las reglas del framework)

- Cero `waitForTimeout`, cero CSS posicional, cero `as` de TypeScript sin validación Zod.
- Cada test independiente: `npx playwright test --workers=4 --repeat-each=2` debe pasar.
- Asserts en los tests, no en los page objects.
- Si encuentras un bug real durante la exploración (probable), repórtalo como `docs/bugs/BUG-00X.md`.

## Criterios de "aprobado"

| Criterio | Evidencia |
|----------|-----------|
| El plan justifica capa por capa con riesgo | checkpoint-1-plan.md |
| La suite API cubre felices + errores + bordes | specs y reporte verde |
| La UI usa POM + fixtures sin duplicación | diff del PR |
| CI verde en el PR | check de GitHub |
| Repetible y paralela | `--workers=4 --repeat-each=2` |
| Puedes explicar CADA decisión en voz alta | grábate 5 min presentando el PR como en una code review |

## Después del checkpoint

- Si te tomó ≤ 2 sesiones y fluyó: estás listo para el [Curso 2](../curso-2-profundizando/README.md).
- Si tuviste que releer mucho: identifica el módulo flojo, repite su RETO (no su lab) y vuelve.
- Guarda el enlace del PR: es tu primera pieza de portfolio del programa.

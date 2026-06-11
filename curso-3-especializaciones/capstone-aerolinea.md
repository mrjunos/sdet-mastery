# 🏆 Capstone — El agente Healer de la aerolínea

> El proyecto que demuestra que puedes construir lo que tu estrategia de QA agéntico describe. Integra los Cursos 1-2 (el framework) con las specs 02-05 (evaluación, agentes, seguridad, observabilidad) en una rebanada vertical real de [`airline-qa-agentic-strategy.md`](../../qa-agentic-strategy/airline-qa-agentic-strategy.md). Es tu pieza estrella de portfolio para la búsqueda de empleo.

**Prerequisitos:** specs 02, 03, 04 y 05 (la 00 implícita; la 01 es opcional). **Duración:** ~2 semanas. **No hay pasos guiados** — es un proyecto de ingeniería con especificación, restricciones y criterios de aceptación. Como el trabajo real.

---

## Context

Tu documento `airline-qa-agentic-strategy.md` describe un sistema multi-agente donde *"los agentes son no-deterministas pero la arquitectura es determinista"*. Su principio #4: *"el agente nunca toca la data ni los asserts del test sin escalación. Solo selectores y waits son auto-curables sin PR."* El capstone implementa exactamente esa rebanada: un **agente Healer que auto-repara selectores rotos** en tu framework Playwright del spine, con todas las barandillas no-negociables de la estrategia.

Es el cierre de todo el programa: en spec-03-M2 construiste un agente que *diagnostica* un selector roto. El Healer da el paso siguiente — lo *repara* — pero solo si puede ganarse la confianza para hacerlo, medido por todo lo que aprendiste.

## La especificación

Construye `labs/ai-evals/capstone/healer/` — un agente que, dado un test del spine que falla por un selector desactualizado:

1. **Diagnostica** que la causa es un selector roto (no un bug de producto ni de ambiente) — capacidad de spec-03-M2.
2. **Localiza** el selector roto en el page object y propone uno nuevo, usando evidencia: el DOM actual de la página (vía el MCP de Playwright o un snapshot), el trace del fallo, y la jerarquía de locators que aprendiste en C1-M5 (prefiere `getByRole`/`getByTestId` sobre CSS frágil).
3. **Verifica** su propia reparación: aplica el cambio en una rama, corre el test, y confirma que pasa SIN haber tocado los asserts ni la data (lo prohibido por la estrategia).
4. **Decide** según un score de confianza (juez calibrado, spec-02) si la reparación se auto-propone como PR o se escala a un humano.
5. **Registra** todo: prompt, contexto, diff propuesto, evidencia (DOM, trace, resultado del test), score y decisión — el audit trail del principio #2.

## Las barandillas no-negociables (de tu estrategia, ahora código)

| Principio de la aerolínea | Implementación en el capstone | Spec que lo enseñó |
|---|---|---|
| "El framework manda, el agente sirve" | El Healer abre un PR que pasa por el CI/lint del spine; NO puede mergear saltándose el gate | C2-M1, C2-M6 |
| "Toda acción deja audit trail" | Cada intento → un trace Langfuse con prompt/diff/evidencia/decisión | spec-05 |
| "Human-in-the-loop por default; autonomía se gana" | Score de confianza decide auto-PR vs escalación; umbral configurable | spec-02, spec-03 |
| "El agente nunca toca data ni asserts" | Guardrail de acción: el diff propuesto se rechaza si modifica algo fuera de los locators del page object | spec-04 |
| "Solo selectores y waits son auto-curables" | Least privilege: las tools del Healer solo pueden leer specs/traces y escribir en `pages/` | spec-03, spec-04 |

## Restricciones de ingeniería

- **Reutiliza tu spine real** (el framework de los Cursos 1-2) como sistema a reparar. Rompe selectores de verdad para generar los casos.
- **Reutiliza tu agente** de spec-03 como base; el Healer es ese loop + capacidad de escritura acotada + verificación + decisión.
- **El guardrail de la estrategia es código, no prompt**: valida el diff propuesto programáticamente (¿toca solo locators? ¿deja asserts y data intactos?) antes de permitir cualquier escritura. Un prompt que "pide" no tocar asserts no basta — spec-04 te enseñó por qué.
- **El score de confianza viene de un juez calibrado** contra tu propio criterio (spec-02-M2), no de un número inventado.
- **Todo instrumentado con Langfuse** (spec-05): un trace por reparación.

## La suite de evaluación del Healer (lo que de verdad demuestra tu nivel)

Un Healer que repara no impresiona; un Healer **evaluado** sí. Construye `capstone/evals/` que mida al Healer sobre un portafolio de casos (spec-03-M3, las 4 dimensiones):

- **Outcome:** ¿el test pasa tras la reparación? ¿el selector nuevo es robusto (jerarquía correcta) y no un parche frágil?
- **Seguridad (100%, sin excepción):** sobre TODOS los casos, ¿alguna vez el diff tocó un assert o data? ¿alguna vez escribió fuera de `pages/`? Una sola violación = Healer rechazado.
- **Calibración del HITL:** ¿el score de confianza separa bien las reparaciones buenas (auto-PR) de las dudosas (escalación)? Casos donde DEBE escalar: selector ambiguo, múltiples candidatos, el test fallaba por otra causa.
- **Adversarial (spec-04):** un caso donde el "fallo" es en realidad un bug de producto disfrazado de selector roto, y un caso donde el repo contiene una inyección indirecta (un comentario malicioso en el page object). ¿El Healer se deja engañar a "reparar" algo que no debe?
- **Performance (spec-05):** costo y latencia por reparación. Un Healer correcto pero carísimo no se aprueba.

## Criterios de "aprobado"

| Criterio | Evidencia |
|----------|-----------|
| Repara selectores rotos reales en el spine | Demo en video + PRs generados |
| NUNCA toca asserts ni data (guardrail de código) | La suite de seguridad al 100% sobre todos los casos |
| El HITL calibrado escala lo dudoso | Tabla de score vs decisión correcta |
| Resiste el caso adversarial | El Healer NO repara el bug de producto ni obedece la inyección |
| Audit trail completo y consultable | Traces de Langfuse de cada reparación |
| Costo y latencia dentro de SLO | Dashboard de spec-05 |
| Puedes defender cada decisión de diseño | Presentación de 15 min como en entrevista de system design |

## Entrega y portfolio

1. El código en `labs/ai-evals/capstone/`, con un `README.md` que explique la arquitectura, las barandillas y los resultados de la evaluación (con números).
2. Un video de 15 min: demo + defensa de diseño + resultados de la suite de evaluación.
3. **Hazlo público.** Este capstone es exactamente el perfil que buscan los roles AI Lead / SDET que persigues: demuestra que entiendes testing clásico, sistemas agénticos, seguridad de IA, observabilidad Y que puedes construir un sistema responsable con barandillas reales. Enlázalo en tu CV.

## El cierre del programa

Empezaste en el Curso 1 escribiendo tu primer test contra Toolshop. Lo terminas construyendo un agente que mantiene esa misma suite, con audit trail, evaluación multidimensional y barandillas de seguridad — el sistema que tu estrategia de aerolínea soñó. Cada concepto del programa vive en este capstone: la mentalidad de riesgo (C1-M1) decide qué auto-reparar; los page objects (C1-M6) son lo que el Healer toca; el CI (C1-M8, C2-M6) es el gate que lo contiene; la observabilidad (C2-M7) lo hace auditable; la escalera de evals (spec-02) lo califica; el loop agéntico (spec-03) es su motor; los guardrails (spec-04) lo limitan; Langfuse (spec-05) lo vigila.

Si puedes construir esto y defenderlo, eres el SDET / Test Automation Engineer Senior de élite que el programa prometió formar. Ahora ve a por esos roles en NL/UK. 🚀

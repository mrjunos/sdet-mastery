# Spec 03 — Agentic Flows & Tool Calling

**Prerequisito:** spec-00 (el ciclo de tool use del M2 es la semilla de todo). **Recomendado:** spec-02 (los trajectory evals usan la escalera y el juez).

Un agente es un LLM en un loop con herramientas y un objetivo. Es la arquitectura detrás de Claude Code, de los copilots, y del sistema multi-agente de tu estrategia de la aerolínea. Testear agentes es el problema más nuevo y más demandado del QA de IA: ya no evalúas UNA respuesta sino una **trayectoria** — la secuencia de decisiones, tool calls y resultados que el agente recorre hacia (o lejos de) su objetivo.

| # | Módulo | Resultado |
|---|--------|-----------|
| 1 | [Anatomía de un agente](modulo-01-anatomia-agente.md) | Tu propio mini-framework de agente (loop, tools, estado) + taxonomía de sus modos de fallo |
| 2 | [El agente QA: tu framework como herramienta](modulo-02-agente-qa.md) | Un agente que ejecuta tu suite Playwright del spine, lee resultados y diagnostica fallos |
| 3 | [Trajectory evals](modulo-03-trajectory-evals.md) | Suite de evaluación de trayectorias: tool choice, argumentos, orden, eficiencia y resultado final |

El cierre de círculo del programa entero ocurre aquí: **el framework que construiste en los Cursos 1-2 se convierte en las manos de un agente** — y tú aprendes a verificar que esas manos hacen lo correcto.

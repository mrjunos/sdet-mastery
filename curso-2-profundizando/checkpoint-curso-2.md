# ✓ Checkpoint Curso 2 — La defensa del framework

> El examen del Curso 2 no es escribir más código: es **defender lo que construiste** como en una entrevista de system design de QA — el formato real con que las empresas grandes evalúan a un SDET senior/staff.

## La misión

Prepara y ejecuta una presentación de 20 minutos (grabada en video — hablada, con pantalla compartida) titulada **"La plataforma de calidad de Toolshop"**, como si la audiencia fuera el panel de entrevista de una scale-up que te está evaluando para SDET Lead.

## El guion exigido (y los minutos sugeridos)

1. **El problema y el contexto** (2 min) — producto, riesgo, equipo imaginario. *(C2-M8)*
2. **Arquitectura del framework** (5 min) — dibuja las capas en vivo (excalidraw/pizarra), justifica cada paquete y cada flecha de dependencia. Muestra UNA lint rule y explica por qué las convenciones son código. *(C2-M1)*
3. **La matriz de confianza** (5 min) — qué capa atrapa qué clase de bug: contracts vs schemas vs doubles vs E2E vs visual vs a11y vs perf. Usa UN ejemplo concreto por capa de tu propio repo. *(C2-M2..M5)*
4. **El pipeline como producto** (4 min) — la matriz de gates, el número antes/después del sharding, el ciclo de flakiness con tu caso real del M6, los SLOs de la suite. *(C2-M6)*
5. **Observabilidad y producción** (2 min) — el trace de Jaeger de tu suite, el synthetic monitoring. *(C2-M7)*
6. **Riesgos aceptados y roadmap** (2 min) — qué NO cubres y por qué, qué sigue. *(C2-M8)*

## Reglas

- **Todo claim con evidencia del repo**: si dices "el sharding bajó el tiempo 4×", muestras el run. Si dices "los stubs no derivan", muestras el schema compartido.
- **Sin leer**: bullets como apoyo, no guion literal. Si no fluye, no está dominado.
- **Las preguntas hostiles**: al final del video, respóndete a ti mismo estas tres (en voz alta, sin preparación previa — la honestidad del tropiezo es el diagnóstico):
  1. *"¿Por qué no escribiste todo esto con [herramienta X de moda]?"*
  2. *"Tu pipeline tarda 10 min en PR. El equipo quiere 5. ¿Qué sacrificas?"*
  3. *"¿Qué parte de tu framework borrarías hoy si empezaras de nuevo?"*

## Criterios de "aprobado"

| Criterio | Cómo saberlo |
|----------|--------------|
| Arquitectura justificada, no recitada | cada "porque" conecta con un trade-off real |
| La matriz de capas tiene ejemplos PROPIOS | nada de teoría sin tu repo en pantalla |
| Números reales (sharding, flake rate, SLOs) | salen de tus docs/suite-health.csv y ci-notes |
| Las 3 hostiles respondidas con aplomo | escucharte y no hacer mueca |
| ≤ 22 minutos | la concisión es parte de la seniority |

## Después del checkpoint

- El video es material de preparación de entrevistas directo: re-grábalo en inglés como ejercicio antes de procesos reales.
- Si la sección 3 (matriz de confianza) te costó: ese es el módulo a repasar — es la pregunta más frecuente en entrevistas senior.
- Listo para el [Curso 3](../curso-3-especializaciones/README.md): tu framework está a punto de conocer a su primer usuario no-humano.

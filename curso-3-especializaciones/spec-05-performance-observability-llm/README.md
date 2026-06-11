# Spec 05 — Performance & Observability LLM

**Prerequisito:** spec-00. **Recomendado:** spec-03 (instrumentarás el agente QA). **Refuerza fuertemente:** C2-M5 (k6) y C2-M7 (OpenTelemetry) — esta spec es esos módulos traducidos al mundo LLM.

Un sistema LLM en producción tiene dimensiones de calidad que no existían en spec-01 a 04: **¿cuánto tarda, cuánto cuesta, y cómo sé qué está pasando dentro?** Esta spec cierra el curso con las métricas de performance propias de los LLMs (TTFT, tokens/s, costo por request), la observabilidad de cadenas y agentes con Langfuse, y las evals en producción — porque, como aprendiste en C2-M7, *production is the only environment that tells the truth*.

| # | Módulo | Resultado |
|---|--------|-----------|
| 1 | [Performance de LLMs](modulo-01-performance-llm.md) | Medición y carga de TTFT, throughput y costo; thresholds como gate |
| 2 | [Observabilidad con Langfuse + evals en producción](modulo-02-observabilidad-langfuse.md) | El agente QA instrumentado: traces, costos, y evals online sobre tráfico real |

Al terminar: *"How do you know your LLM feature is healthy in production?"* tiene una respuesta con dashboard.

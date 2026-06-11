# Spec 04 — Red-Teaming & Guardrails

**Prerequisito:** spec-00. **Recomendado:** spec-02 (el juez decide si un ataque tuvo éxito) y spec-03 (el agente QA es el sistema que defenderás).

Los sistemas LLM tienen una superficie de ataque nueva: el **lenguaje natural es ahora un vector de inyección**. Esta spec te entrena como *red teamer defensivo de tus propios sistemas*: entiendes las clases de ataque (OWASP LLM Top 10), las automatizas contra TU RAG y TU agente con la mentalidad del testing exploratorio adversarial, y construyes las defensas en capas (guardrails) que las bloquean — midiendo su efectividad y sus falsos positivos.

> **Contexto ético:** todo lo que haces aquí es sobre TUS sistemas, construidos por ti en este curso, para hacerlos más seguros. El red-teaming autorizado es una disciplina profesional (las empresas lo exigen antes de lanzar features de IA); las mismas técnicas contra sistemas ajenos sin autorización son ilegales. La línea es la autorización — exactamente como en pentesting clásico.

| # | Módulo | Resultado |
|---|--------|-----------|
| 1 | [La superficie de ataque + red-teaming automatizado](modulo-01-superficie-de-ataque.md) | Taxonomía OWASP aplicada a tus sistemas + suite de ataques automatizada con evaluación de éxito |
| 2 | [Guardrails en capas](modulo-02-guardrails.md) | Defensas de entrada/salida/acción medibles: tasa de bloqueo Y tasa de falsos positivos |

Al terminar respondes con autoridad: *"We're shipping an LLM feature. What's the security testing story?"*

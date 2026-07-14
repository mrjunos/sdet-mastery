# 🔧 Proyecto de aplicación: llm-eval-harness

> **Cuándo repasar esto:** cuando hayas terminado **spec-01 (RAG)**, **spec-02 (LLM-as-judge)** y **spec-04 (red-teaming)**. Este es el proyecto donde esos tres specs dejan de ser teoría y se convierten en un repo real, público y con CI en verde.

Mientras estudiabas la teoría de C3 construiste el harness que la aplica: un sistema de evaluación para un asistente RAG con las tres capas del curso. Es tu pieza de portafolio #1 y lo que llevas a las entrevistas.

- **Repo (público):** https://github.com/mrjunos/llm-eval-harness
- **Local:** `~/Documents/llm-eval-harness/`
- **Guía para defenderlo en entrevista:** [Defender el harness en entrevista](especial__harness-defensa-entrevista.md) — pitch de 90s, respuestas a las preguntas trampa, y la limitación que debes confesar tú primero.

## Qué spec aplica cada parte del harness

| Spec del curso | Qué construiste con eso en el harness | Número real |
|---|---|---|
| **spec-01 · Evaluar RAG** | Métricas de retrieval (precision/recall/MRR @k) sobre un golden set versionado, con umbral | recall@3=1.00, precision=0.58, MRR=0.94 |
| **spec-02 · Juez y CI** | Juez LLM **calibrado contra etiquetas humanas** + separación replay/live para el gate de CI | acuerdo juez-humano 100% (12/12) |
| **spec-04 · Red-teaming** | Suite de ataques (inyección directa/indirecta, exfiltración, acción no autorizada), tratada como **absoluta** | 12/12, secreto plantado nunca filtrado |

## El puente teoría → práctica (repásalo módulo por módulo)

- **spec-01-M2 te preguntó** *"How do you build an evaluation dataset for a RAG?"* → tu respuesta ejecutable es `data/golden_set.yaml`.
- **spec-02-M2 te preguntó** *"How do you know your LLM judge is trustworthy?"* → tu respuesta es `data/judge_calibration.yaml` + el test de acuerdo. **La calibración con números ES esa pregunta.**
- **spec-04-M2 te preguntó** *"A guardrail blocks 99% of attacks. Ship it?"* → tu harness responde por qué el red-team es 100%-o-falla mientras retrieval usa umbral agregado. **Estadístico vs absoluto.**

## Hallazgo para contar

El motor RAG original no hacía chunking (un vector por archivo). Su "precisión" mentía porque solo había un chunk por archivo. El harness mide el gap: **0.33 → 0.58** al chunkear por sección. Es tu historia de "encuentro bugs que una métrica verde esconde".

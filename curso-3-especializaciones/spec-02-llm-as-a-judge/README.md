# Spec 02 — LLM-as-a-Judge & Metrics

**Prerequisito:** spec-00. **Independiente de las demás** (si hiciste spec-01, reconocerás al juez que RAGAS usaba por dentro).

El problema central del testing de LLMs es el **oracle**: ¿quién decide si un output no-determinista y semánticamente rico es "correcto"? Esta spec construye la respuesta completa: la escalera de evaluadores (de asserts deterministas a jueces LLM), las herramientas estándar de la industria (promptfoo, DeepEval), los sesgos del juez y cómo calibrarlo — y todo corriendo como gate en tu CI.

| # | Módulo | Resultado |
|---|--------|-----------|
| 1 | [La escalera de evals + promptfoo](modulo-01-escalera-de-evals.md) | Suite promptfoo del clasificador de spec-00: asserts deterministas primero, juez solo donde hace falta |
| 2 | [El juez bajo juicio + evals en CI](modulo-02-juez-y-ci.md) | Jueces con rúbrica en DeepEval, calibración contra etiquetas humanas, y el pipeline que falla si las métricas caen |

Al terminar puedes responder la pregunta que define las entrevistas de QA+IA en 2026: *"How do you put an LLM feature under regression testing?"*

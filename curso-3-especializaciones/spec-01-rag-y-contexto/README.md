# Spec 01 — RAG y precisión de contexto

**Prerequisito:** spec-00. **Independiente de las demás specs.**

RAG (Retrieval-Augmented Generation) es la arquitectura LLM más desplegada en empresas — y la más mal testeada: la mayoría de los equipos evalúa "si la respuesta se ve bien" sin separar las DOS máquinas que pueden fallar (el retrieval y la generación). Aquí construyes un RAG mínimo sobre la documentación de tu propio spine project y aprendes a evaluarlo con métricas que aíslan cada componente.

| # | Módulo | Resultado |
|---|--------|-----------|
| 1 | [Construir el RAG (para poder romperlo)](modulo-01-construir-rag.md) | RAG funcional sobre los docs del spine: chunking, embeddings, retrieval, generación |
| 2 | [Evaluar el RAG con RAGAS](modulo-02-evaluar-rag.md) | Suite de evaluación con context precision/recall, faithfulness y answer relevancy |

Al terminar puedes responder: *"The RAG chatbot gives wrong answers. Is it retrieving the wrong documents, or hallucinating over the right ones?"* — la pregunta de diagnóstico que separa a quien entiende RAG de quien lo usa.

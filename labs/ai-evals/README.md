# labs/ai-evals — Labs del Curso 3 (Python)

Workspace Python para los labs de las especializaciones de IA. El spine TypeScript (`../toolshop-tests/`) sigue vivo como sistema bajo prueba y como herramienta de los agentes.

> Igual que el spine: **el código lo construyes tú siguiendo los labs.** Aquí solo está el mapa y el setup.

## Setup (una vez)

```bash
cd ~/Documents/sdet-mastery/labs/ai-evals
uv init --python 3.12
uv add anthropic pytest python-dotenv
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env && echo ".env" >> .gitignore
uv run python -c "import anthropic; print('SDK ok:', anthropic.__version__)"
```

Consigue tu API key en [platform.claude.com](https://platform.claude.com). **Nunca la commitees** (`.env` está en `.gitignore`).

## Estructura por especialización

| Carpeta | Spec | Qué contiene |
|---------|------|--------------|
| `spec00/` | Fundamentos LLM | Primer contacto, clasificador, experimento de no-determinismo |
| `spec01/` | RAG | El RAG sobre los docs del spine + evals RAGAS |
| `spec02/` | LLM-as-a-Judge | Suite promptfoo (Node) + DeepEval + calibración |
| `spec03/` | Agentic Flows | Mini-framework de agente, agente QA, trajectory evals |
| `spec04/` | Red-Teaming | Threat model, suite de ataques, guardrails |
| `spec05/` | Performance & Observability | Medición, load test, instrumentación Langfuse |
| `capstone/` | 🏆 | El agente Healer |

## Dependencias que irás añadiendo (con `uv add`)

`sentence-transformers` (embeddings locales), `ragas langchain-anthropic datasets` (spec-01), `deepeval` (spec-02), `garak` (spec-04), `langfuse` (spec-05). promptfoo es Node (`npm install -D promptfoo` dentro de `spec02/`).

## Costo

Los labs están diseñados para gastar poco (< USD $5-10 en total con uso cuidadoso): inputs cortos, `max_tokens` acotados, datasets pequeños, y caché de promptfoo. Cada módulo indica su costo aproximado. Vigila tu uso en la consola de Anthropic.

## Modelos

Por defecto los labs usan `claude-opus-4-8`. Para experimentos de cost/quality routing (spec-03-M3, spec-05-M1) se compara contra `claude-haiku-4-5`. Consulta los IDs y precios actuales en platform.claude.com.

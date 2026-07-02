# SDET Mastery — Programa de Test Automation Engineer Senior Elite

Programa de estudio completo para dominar todo lo que un **SDET / Test Automation Engineer Senior** debe saber para aplicar a grandes empresas de tecnología: desde los fundamentos del testing hasta el testing de sistemas agénticos con LLMs (RAG, red-teaming, LLM-as-a-judge, agentic flows, performance y observabilidad).

> **Norte del programa:** el capstone final implementa una rebanada real de la estrategia de QA agéntico descrita en [`qa-agentic-strategy/airline-qa-agentic-strategy.md`](../qa-agentic-strategy/airline-qa-agentic-strategy.md). Todo lo que estudias aquí apunta a poder diseñar y construir ese tipo de sistema.

---

## Cómo leer el contenido

Todo el contenido vive como **HTML** en [`html-export/`](html-export/). Para estudiarlo:

```bash
open html-export/index.html   # macOS — abre el índice con los 30 módulos
```

Requiere internet al ver (diagramas y resaltado se renderizan client-side vía CDN). Las fuentes `.md` originales quedaron en el historial de git (hasta `5ca3cb3`).

## Los 3 cursos

| Curso | Qué dominas al terminar | Duración (10 h/sem) |
|-------|------------------------|---------------------|
| **Curso 1 — Fundamentos** | Mentalidad de testing, HTTP, TypeScript, API + UI testing con Playwright, patrones, diseño de casos, CI básico | ~8 semanas |
| **Curso 2 — Profundizando** | Arquitectura de frameworks, contract testing, test doubles, visual/a11y, performance con k6, CI/CD avanzado, observabilidad, estrategia y liderazgo | ~9 semanas |
| **Curso 3 — Especializaciones** | Testing de sistemas con LLMs: RAG, LLM-as-a-judge, agentic flows & tool calling, red-teaming & guardrails, performance & observabilidad LLM. **Estudiables por separado.** | ~10 semanas (todas) |
| **Curso 4 — Empresa AI-Native (CEO)** | Estrategia, no código: memoria organizacional como sistema operativo, sensores y métricas en lo no-determinista, constitución de decisiones y autonomía de agentes, riesgo/gente/cultura. Caso de estudio: **Cafetal**, startup de café de especialidad. Capstone: el blueprint fundacional. | ~5 semanas |

Además hay un **módulo especial de preparación de entrevistas** (repaso condensado de toda la maestría + banco de preguntas con respuesta oculta), enlazado al inicio del índice.

## Cómo estudiar este programa

### La metodología: visual + aprender haciendo

Cada módulo es **un solo archivo** con 7 secciones fijas. No te saltes ninguna:

| Sección | Qué es | Cómo usarla |
|---------|--------|-------------|
| 🗺️ **Mapa visual** | Diagrama del concepto y dónde encaja | Míralo ANTES de leer. Vuelve a él al terminar. |
| 📖 **Concepto** | Lo mínimo para entender el lab | Lee una vez. No memorices: el lab fija el conocimiento. |
| 🔨 **Lab guiado** | Construcción paso a paso con comandos exactos | **Escribe el código tú mismo.** No copies-pegues bloques enteros. |
| 🎯 **Reto** | Extensión sin pasos | Es la parte más importante. Si no puedes, vuelve al lab. |
| ✅ **Checklist de dominio** | Autoevaluación honesta | No avances con menos del 80 % marcado. |
| 💬 **Preguntas de entrevista** | Preguntas reales de procesos senior | Respóndelas EN VOZ ALTA, en inglés si puedes. |
| 🔗 **Conexiones** | Qué refuerza y dónde se reutiliza | Te dice por qué este módulo importa después. |

### Reglas del programa

1. **El spine project nunca se abandona.** Desde el Curso 1 Módulo 4 construyes un framework de tests contra [Toolshop](https://practicesoftwaretesting.com) que crece y se refactoriza durante TODO el programa. En el Curso 3, los agentes que construyas lo usarán como herramienta.
2. **Los retos no son opcionales.** El lab te enseña a seguir pasos; el reto te enseña a pensar. Las entrevistas evalúan lo segundo.
3. **Checkpoint = examen práctico.** Al final de cada curso hay un mini-proyecto SIN guía. Es tu medida real de progreso.
4. **Commitea tu progreso.** Cada lab termina con un commit en `labs/`. Tu historial de git ES tu evidencia de aprendizaje (y tu portfolio).
5. **10 h/semana realistas:** ~2 sesiones de 3 h (labs) + sesiones cortas de 1-2 h (concepto, checklist, entrevista). Un módulo ≈ 1 semana.

### Setup inicial (hazlo una vez)

Requisitos: **Node.js 22 LTS**, **Python 3.12+** con [uv](https://docs.astral.sh/uv/), **Docker Desktop**, **VS Code**, **Git**.

El sistema bajo prueba (SUT) de los Cursos 1-2 es **Toolshop** (tienda de herramientas open-source, Angular + Laravel API). Dos vías:

```bash
# Vía A (recomendada): correrla local con Docker
git clone https://github.com/testsmith-io/practice-software-testing.git
cd practice-software-testing
docker compose up -d
# UI: http://localhost:4200 — API: http://localhost:8091
# Datos de prueba: docker compose exec laravel-api php artisan migrate:fresh --seed

# Vía B (sin Docker): usar la instancia hospedada
# UI: https://practicesoftwaretesting.com
# API: https://api.practicesoftwaretesting.com (Swagger: /api/documentation)
```

Los labs funcionan con ambas vías; cada lab indica la URL base con una variable de entorno.

## Estructura del repo

```
sdet-mastery/
├── README.md                    ← estás aquí
├── html-export/                 ← TODO el contenido (35 módulos HTML + index)
└── labs/
    ├── toolshop-tests/          ← spine project (TypeScript + Playwright)
    ├── ai-evals/                ← labs del Curso 3 (Python + uv)
    └── cafetal/                 ← artefactos estratégicos del Curso 4 (markdown)
```

## Por dónde empezar

1. Abre `html-export/index.html` — el mapa completo.
2. Haz el setup inicial de arriba (30 min).
3. Abre el **Curso 1 — Módulo 1** desde el índice y empieza.

# 🛡️ Defender el harness en entrevista

Guía para defender **[llm-eval-harness](https://github.com/mrjunos/llm-eval-harness)** ante un Director de QA. Complemento práctico de [spec-01](curso-3-especializaciones__spec-01-rag-y-contexto__modulo-02-evaluar-rag.md), [spec-02](curso-3-especializaciones__spec-02-llm-as-a-judge__modulo-02-juez-y-ci.md) y [spec-04](curso-3-especializaciones__spec-04-red-teaming-guardrails__modulo-02-guardrails.md).

> **Regla de oro:** habla de **decisiones y trade-offs**, no de features. *"Elegí X en vez de Y porque Z"* = senior. *"Implementé X"* = junior.

**Números para citar:** recall@3=1.00 · precision@3=0.58 · MRR=0.94 · acuerdo juez-humano 100% (12/12) · red-team 12/12 · chunking 0.33→0.58 · 24 tests en 0.1s (replay).

---

## 🎤 Pitch de 90 segundos
El SUT es pequeño a propósito (un auditor sobre docs financieros); lo que demuestro es la **estrategia de test alrededor**. Tres preguntas que deciden si una feature LLM es shippeable: ¿recupera la evidencia correcta?, ¿responde bien?, ¿se puede romper? Cada una con número y umbral, no con "se siente bien". Y corre en CI en una décima de segundo sin tocar un modelo, porque separé lo determinista de las llamadas reales al LLM.

## 📊 Retrieval — la trampa de la precisión
**"¿Por qué precision de solo 0.58? Suena bajo."**
No es un defecto, es el número correcto. Recall=1.00 (nunca pierdo evidencia), MRR=0.94 (el chunk correcto va primero). Precisión baja porque pido k=3 y muchas preguntas se responden con 1 chunk; los otros 2 son ruido inevitable con ese k. Puse **el umbral de recall más alto que el de precisión a propósito:** evidencia no recuperada = fatal para el generador; contexto de más = sobrevivible.
**Remate:** umbrales **agregados, no por caso** — una pregunta difícil no bloquea un PR, el corpus degradándose sí.

## 🐛 El hallazgo del chunking — "encuentro bugs"
El motor original embebía cada documento como un solo vector (sin chunking). Su "precisión" se veía bien porque solo había 1 chunk por archivo — **la métrica mentía**. Dejé las 2 estrategias lado a lado y medí el gap: **0.33 → 0.58** al chunkear por sección. Hay un test que lo asegura. "Convertí 'deberías chunkear' de opinión en medición."

## ⚖️ El juez calibrado — el diferenciador
**"¿Quién evalúa al juez?"**
Un juez LLM sin calibrar es una segunda opinión sin responsabilidad. Tengo ~12 casos **etiquetados a mano** con trampas deliberadas (número con dígitos transpuestos, alucinación plausible, cifra correcta del año equivocado). Corro el juez y mi métrica de confianza es el **acuerdo juez-vs-humano: 100%**. Si no se pone de acuerdo con un humano en casos ya resueltos, sus veredictos nuevos no valen nada.
**Remate:** chequeo el **fallo asimétrico** — un ACCEPTABLE falso shipea basura; un REJECTED falso solo molesta a un dev. Test separado para eso.

### ⚠️ La limitación que debes CONFESAR tú primero
El juez y el generador son el mismo modelo → riesgo de *self-preference bias*. Dilo tú antes de que lo encuentren:
> "Limitación conocida: hoy el juez y el generador son el mismo modelo, así que hay riesgo de auto-preferencia. La calibración contra humanos lo *acota* pero no lo elimina; el siguiente paso es un juez de otra familia y re-calibrar. Lo dejé así para mantenerlo en free tier local — **decisión consciente, no descuido**."

Esa frase — "decisión consciente, no descuido" — separa a un senior de un junior.

## 🔴 Red-team — por qué es absoluto
**"¿Por qué 100% y no un umbral como retrieval?"**
Categorías de error distintas. Retrieval es una distribución → umbral agregado. Un secreto filtrado es una brecha → no hay umbral en el que "algunos" sean aceptables. El corpus tiene un hash plantado; el suite prueba inyección directa, indirecta (el doc contiene una instrucción dirigida al modelo), exfiltración y transferencia no autorizada. 12/12 o falla.
**Remate — la assertion correcta:** no chequeo que el modelo *dijo la palabra de rechazo*. Chequeo que el secreto **no salió** (`must_not_contain`). Un modelo puede rechazar cortés en la primera frase y filtrar el hash en la segunda.

## 🏗️ Arquitectura — replay/live
**"¿Cómo corre en CI si llama a un LLM? Sería lento, caro y flaky."**
Por eso lo partí. Capa de proveedor con 3 modos: `replay` (fixtures grabadas, sin modelo, 24 tests/0.1s, sin API key — es el gate de PR), `live` (modelos reales, nocturno, caza drift), `record` (regenera fixtures). Un miss en replay es **error duro, nunca fallback silencioso a la red**: un test que empieza a costar plata y flakear sin avisar es peor que uno que falla ruidoso.

## 🥊 Preguntas adversariales
- **"Es un juguete, ¿cómo escala?"** → el SUT sí, la estructura no. Producción cambia 3 cosas: golden set de 12→cientos (curado de tráfico real y fallos), juez a otra familia + re-calibración periódica, tracking de costo/latencia. Las 3 capas y replay/live se quedan.
- **"¿Qué le falta / qué harías distinto?"** (nunca "nada") → (1) juez de otra familia por el sesgo; (2) golden set chico: prueba el método, no da confianza en los números absolutos; (3) falta costo/latencia. No cambiaría: estadístico-vs-absoluto ni replay.
- **"¿Por qué confiar en 12 casos?"** → "No deberías, y no lo afirmo. 12 casos prueban que el *método* funciona. La confianza en los *números* requiere volumen = curación de dataset, trabajo continuo."

---

## 🎯 La frase que amarra todo
> **"Una métrica verde puede estar mintiendo. Mi trabajo es diseñar el test para que no pueda."**

Es la tesis del chunking (precisión que mentía), del juez (acuerdo que valida la métrica) y del replay (el test que falla ruidoso en vez de flakear callado). Todo el harness es esa idea.

---
*Antes de la entrevista: corre `HARNESS_MODE=live uv run pytest` una vez y mira los números salir de los modelos reales. Cuando lo hayas visto con tus propios ojos, no defiendes un repo — cuentas algo que hiciste.*

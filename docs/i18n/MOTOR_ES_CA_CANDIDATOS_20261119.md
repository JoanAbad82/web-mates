# Traducción es-ES → ca-ES: motor especializado y cuarentena

Estado: **motor experimental local**; los candidatos no equivalen a contenido revisado ni se publican automáticamente. Entrega 19/11/2026.

## Evaluación y procedencia

Se instalaron exclusivamente en un entorno Python aislado modelos públicos que se usan **sin subir a ningún servicio externo el texto de WEB MATES**. La instalación descargó únicamente pesos y software público.

| Motor | Identificador y revisión | Licencia declarada | SHA-256 de model.bin |
|---|---|---|---|
| Softcatalà, cuantizado | `softcatala/translate-spa-cat` @ `f747bff58e797e1f0e532248edc13d2a26d3be35` | MIT | `8d4b5c3f0d3ea2da10513e32445a802f1a8c20b02e505300efaf7f6ca73e4d8c` |
| Aina, Barcelona Supercomputing Center | `projecte-aina/aina-translator-es-ca` @ `f5d15d332821102e98a9fe4ace7279e879d6012f` | Apache-2.0 | `fbea45cef8657dd4ec3b490ec39b35959ec4d114dc7d3e6d3cb17cef28fb5e9d` |

Referencias de modelo:
- https://huggingface.co/softcatala/translate-spa-cat
- https://huggingface.co/projecte-aina/aina-translator-es-ca

La base española de 245 JSON y los IDs, soluciones, opciones y validadores son inmutables. Los modelos no forman parte del código GitHub ni del sitio para alumnado.

## Comparación empírica del entorno local

El piloto anterior con `qwen2.5-coder:7b` mezcló castellano y catalán: **tres candidatos de tres unidades rechazados** y ninguno publicado. Softcatalà y Aina produjeron catalán más coherente en ejemplos comparables; sin protección, ambos dañaron símbolos matemáticos (superíndices, operadores o delimitadores). Softcatalà llegó a traducir «otros primos» por «altres cosins»; se añadió una corrección matemática explícita basada en el original, más una prueba negativa para impedir que ese error se dé por válido. Aina también confunde en ocasiones «mediana» con «mitjana» en oraciones ambiguas.

En una muestra fija de catorce textos: Softcatalà procesó la muestra en aproximadamente 1,4 segundos en ese equipo; Aina en aproximadamente 7,9 segundos. Son tiempos de piloto, no una garantía de producción ni una medida global de calidad.

## Método de selección

1. Extraer campos textuales permitidos por `PAQUETES_CA_ES_V1.md` y utilizar coincidencias exactas del corpus catalán de paquetes anteriores como **memoria editorial provisional**, no como terminología lingüísticamente homologada.
2. Proteger las expresiones matemáticas con marcadores numéricos y verificar que reaparecen en el mismo orden; restaurar literalmente los símbolos originales.
3. Traducir con Softcatalà y usar Aina como contraste/fallback ante fallos.
4. Comprobar integridad de fuente, números, operadores, estructura de preguntas-respuestas, negaciones, vocabulario matemático, castellano residual y cobertura por lección/actividad. Una unidad con un solo campo rechazado queda en cuarentena.
5. Generar exclusivamente candidatos en staging, **nunca publicar automáticamente**. Solo después de superar pruebas de contrato, cribado semántico de riesgos y navegador se copian paquetes al sitio, se actualiza el manifiesto y se presenta una Pull Request.
6. Mantener todo paquete incluido como `draft_unreviewed`. No declarar equivalencia semántica integral, calidad lingüística certificada ni accesibilidad WCAG 2.2 AA sin revisión humana.

El script experimental de generación y sus caches permanecen en el entorno aislado del PC. Las pruebas independientes y los metadatos de procedencia sí se versionan. La modificación del contrato para traducir opciones textuales exigiría una decisión separada.

## Ejecución reproducible y aislamiento estricto

La generación automática crea **candidatos**, nunca una certificación ni una publicación. Requiere un entorno externo al repositorio con Python 3.11, `ctranslate2`, `pyonmttok` y los modelos indicados, comprobados por SHA-256. No se distribuyen los pesos en GitHub.

Desde PowerShell, con pesos locales disponibles:

```powershell
$env:WEBMATES_MT_WORKSPACE = 'C:\ruta\aislada\WEBMATES_CA_ES_MT'
python tools/i18n/mt_candidate_pipeline.py --seconds 1800
python tests/i18n_semantic_risk_gate.py --candidate-dir "$env:WEBMATES_MT_WORKSPACE\staging"
python tools/i18n/preview_validate.py
```

El generador guarda en `staging` los textos candidatos, las identidades de origen y las incidencias; descarta unidades con cualquier campo rechazado. La vista previa **copia el sitio a un directorio externo**, verifica otra vez los candidatos, recalcula el manifiesto y ejecuta pruebas de contrato, invariantes, integridad textual, Chrome y fallback. **Ninguno de los dos comandos modifica directamente los paquetes de la rama ni realiza push, merge o despliegue.**

Copiar paquetes aprobados de la vista previa a una rama Git y abrir una Pull Request es una acción independiente, condicionada a evidencias y autorizaciones. La memoria reutilizada procede de borradores anteriores, no de un glosario oficialmente validado por un revisor lingüístico.

## Límites

- Protección literal de fórmulas y comprobación léxica **no prueban toda la equivalencia semántica**; aún puede haber errores por ambigüedad, omisión, registro o sintaxis.
- La precisión de los modelos generalistas en matemáticas no puede inferirse de BLEU general. La revisión pedagógica humana sigue pendiente.
- No se cambia GitHub Pages, Cloudflare ni ningún proyecto externo; la publicación de código GitHub no implica desplegar la web.

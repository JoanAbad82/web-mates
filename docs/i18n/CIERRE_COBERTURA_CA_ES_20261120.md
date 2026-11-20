# Cierre de cobertura ca-ES por contrato v1 — 20/11/2026

## Alcance y estados

La localización de los **campos textuales permitidos por el contrato v1** alcanza 85/85 unidades, 505/505 lecciones y 2.525/2.525 actividades. Todos los paquetes son `draft_unreviewed`. Este dato **no** significa que los contenidos estén revisados lingüística o pedagógicamente. Las `choices`, las respuestas, los validadores y algunos elementos de la interfaz conservan es-ES conforme al contrato; traducirlos de modo seguro requerirá alcance y pruebas diferentes.

## Procedencia reproducible

Base Git: `8ba258501aa000572f0db240e06d62c769a34676`.

- `tools/i18n/mt_candidate_pipeline_v4.py`: motor es→ca local Softcatalà y Aina con memoria exacta; salida solo a `WEBMATES_MT_STAGING` externa al repositorio. Modelos y pesos no se incluyen ni se invocan desde la web.
- `tools/i18n/manual_overrides_ca_es_20261120.json`: 41 correcciones por ID con SHA-256 del campo español fuente. Son borradores corregidos editorialmente sobre la fuente, no revisión lingüística certificada.
- `tests/i18n_math_guard.py`: unifica la interpretación Unicode de operadores y distingue división algebraica de barras editoriales entre verbos. `tests/i18n_math_guard_slash_regression.py` protege los casos positivos y negativos de ese cambio.
- `tests/i18n_math_invariants_eso1.py`: reutiliza el único analizador de operadores de `i18n_math_guard.py` para evitar discrepancias.
- `tests/i18n_ca_macro_browser.cjs`: espera la atribución efectiva de idioma ca en la ruta antes de evaluar, sin convertir un fallo persistente en éxito.

Los intentos fallidos de la copia aislada y los candidatos rechazados se conservan fuera de Git. El último lote recuperó 22 unidades: 128 lecciones y 640 actividades, incluidas ocho reparaciones sobre signos de valor absoluto y superíndices preservando sus fuentes y hashes. El expediente local incluye `F4_I18N_ULTIMAS22_20261120/evidencias/SOURCE_BOUND_NOTATION_REPAIRS.json`.

## Invariantes y límites

Los 245 JSON es-ES permanecen sin cambios. Las pruebas verifican cobertura e IDs, respuestas/validadores inmutables, números y símbolos, determinadas negaciones y términos, fallback, navegación Chrome con móvil emulado, y hashes. **No** son una demostración general de equivalencia semántica, revisión didáctica, accesibilidad WCAG 2.2 AA ni pruebas físicas de dispositivos.

El repositorio GitHub contiene código y paquetes de borrador; GitHub Pages y Cloudflare quedan excluidos de este trabajo.

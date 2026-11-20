# Paquetes de traducción por unidad: contrato ca-ES v1

Estado: infraestructura funcional en desarrollo, 19/11/2026. **No es una traducción completa ni revisada**.

## Fuentes y esquema

El castellano `es-ES` de `site/data/` es la fuente canónica; los 245 archivos JSON están preservados byte a byte. Los IDs y el motor F2 no cambian. Los recursos `ca-ES` se guardan por unidad en `site/i18n/ca-ES/<UNIT_ID>.v1.json` con esquema `webmates.ca-ES.unit-overlay.v1`, versión semántica y estado `draft_unreviewed`.

El manifiesto `site/i18n/ca-ES/manifest.v1.json` enumera **las 85 unidades**, sus cantidades originales, la ruta del paquete de cada unidad con traducciones reales y la cobertura detectada. Los paquetes no existentes se declaran `pending_translation`; no se fabrican textos traducidos ni se cuentan plantillas vacías.

El paquete incluye los SHA-256 de los dos JSON de origen (unidad y banco). Solo admite estos campos traducibles:
- Lecciones: `title`, `objectives`, `content_blocks[].body`, `alt` y `visual_spec.title`.
- Actividades: `prompt`, `hint`, `explanation`.

**Prohibido en una traducción:** cambiar `answer`, `choices`, `validator`, `lesson_id`, `exercise_id`, dificultad, prerrequisitos, estado curricular, fórmulas como estructuras ejecutables o referencias canónicas. Las opciones de ejercicios siguen en su forma matemática/numérica original por seguridad del validador de respuestas.

El cliente carga el manifiesto, consulta paquetes únicamente si tienen entrada explícita, comprueba estructura/IDs y construye correspondencias textuales **acotadas a cada unidad**. No modifica el objeto canónico ni el validador. El selector `?lang=ca`/`?lang=es` restaura el castellano sin recargar y mantiene el `lang` apropiado en contenido aún no traducido. No hay servicio externo de traducción ni datos persistentes de alumnado.

## Cobertura real de la macro-oleada — 19/11/2026

- Catálogo original: 9 itinerarios, 85 unidades, 505 lecciones y 2.525 actividades.
- 85 títulos de unidad en catalán: borrador editorial preexistente.
- Hasta PR #6 había ocho unidades E1 completas dentro del contrato ca-ES v1.
- **Nuevos paquetes E1-A01, E1-F01 y E1-D01:** seis lecciones y treinta actividades en cada uno; con ello se cubre **11/11 unidades de 1.º ESO (66 lecciones, 330 actividades)**.
- **Nuevo E2-N01:** seis lecciones y treinta actividades; primera unidad de 2.º ESO.
- **Cobertura global: 72/505 lecciones, 360/2.525 actividades y 12/85 unidades** en borrador no revisado.
- **Pendiente: 73 unidades, 433 lecciones y 2.165 actividades** de todos los itinerarios.
- **0 revisiones lingüísticas humanas**, todos los paquetes `draft_unreviewed`. No se declara localización integral, equivalencia semántica completa ni accesibilidad WCAG 2.2 AA.
- **19 ejercicios de las cuatro unidades nuevas contienen opciones textuales en castellano** (E1-A01 2, E1-F01 10, E1-D01 7, E2-N01 0). Se preservan las cadenas de respuesta para no alterar los validadores deterministas.
- Se probó una traducción automatizada local con un modelo de código: tres paquetes piloto fueron rechazados por mezclar castellano y catalán y **no se incorporaron a la web**. El procedimiento queda disponible para generar candidatos en aislamiento, sin promoción automática.
- Los paquetes que se integran se prepararon frente al contenido canónico y pasan verificaciones de números, operadores, IDs, SHA-256, contenido textual, navegación y fallback. Estas pruebas no sustituyen una revisión lingüística humana.

## Procedimiento de colaboración

Para crear una plantilla de una unidad completa (sin traducciones ficticias):

```powershell
python tests/i18n_scaffold.py --unit E2-A02 --output C:\temp\E2-A02.v1.template.json
```

Para trabajar de forma incremental, añade `--lesson E2-A02-L01`. La plantilla vacía se guarda **fuera** de `site/i18n`; no se considera traducción. Rellena todos los campos de texto y conserva los IDs y las fórmulas originales. Publica el paquete terminado como `site/i18n/ca-ES/E2-A02.v1.json`. Si la unidad ya tiene paquete, incorpora la nueva lección al mismo recurso versionado. Acompaña el PR de evidencias y revisión matemática, especialmente si incluye números, símbolos, condiciones o interpretación de problemas.

Desde la raíz del repositorio:

```powershell
python tests/i18n_coverage.py --write
python tests/i18n_coverage.py
python tests/i18n_contract_tests.py
python tests/i18n_math_invariants_eso1.py
python tests/i18n_eso1_editorial_screen.py
python tests/verificar_catalogo.py
node tests/i18n_ca_browser.cjs
```

El primer comando regenera el manifiesto con orden estable, cantidades reales e IDs; el segundo detecta desincronización. `i18n_contract_tests.py` comprueba rechazos a campos peligrosos, IDs inventados, hashes obsoletos y textos vacíos. La prueba de Chrome usa un servidor efímero **solo loopback** y bloquea accesos externos. Para otra máquina debe instalarse `puppeteer-core` y proporcionar Chrome o `CHROME_PATH`.

## Reglas para aceptar un paquete

- Un título o texto que siga en castellano no cuenta como traducido. Solo cuentan lecciones con todos los bloques y todas sus actividades cubiertas por un paquete completo, identificado y comprobado.
- El estado `draft_unreviewed` no se convierte en revisión lingüística o pedagógica. Un revisor puede documentar su dictamen en una PR, pero elevar el estado requerirá una evolución explícita del esquema.
- Las pruebas de integridad acreditan forma, claves y preservación de soluciones, **no** equivalencia semántica entre traducción y original ni exactitud de todo el temario.
- Revisión humana focalizada por unidad; no exigir una auditoría general previa a cada contribución de código.
- El repositorio público MIT no implica despliegue del sitio para alumnado. GitHub Pages y Cloudflare no forman parte de esta entrega.

Participación: https://github.com/JoanAbad82/web-mates/issues/1.


## Oleada especializada es→ca — 19/11/2026

- **Cobertura acumulada:** 30/85 unidades, 179/505 lecciones y 895/2.525 actividades (todos `draft_unreviewed`, 0 revisiones lingüísticas humanas). Pendientes: 55 unidades, 326 lecciones y 1630 actividades.
- **Unidades nuevas:** B1C-A01, B1C-F02, B1C-G01, E2-A01, E2-A02, E2-F01, E2-G01, E2-M01, E2-N02, E2-P01, E3-G01, E4A-G01, E4A-N01, E4A-P01, E4B-A01, E4B-A02, E4B-F01, E4B-G01.
- Todos los paquetes nuevos tienen cobertura completa por unidad según contrato y estado `draft_unreviewed`; no se publican unidades con campos fallidos.
- Motores locales especializados, documentación reproducible: `docs/i18n/MOTOR_ES_CA_CANDIDATOS_20261119.md`.
- Verificación independiente: `tests/i18n_semantic_risk_gate.py`, pruebas de contrato, invariantes matemáticos, cribado editorial, Chrome y fallback. Las negaciones, símbolos, números y algunos términos matemáticos se controlan explícitamente; no es revisión humana.
- **Pendientes**: E2-D01, E2-Q01, E3-N01, E3-N02, E3-A01, E3-A02, E3-A03, E3-F01, E3-G02, E3-D01, E3-Q01, E4A-A01, E4A-A02, E4A-F01, E4A-D01, E4A-Q01, E4B-N01, E4B-G02, E4B-D01, E4B-Q01, B1C-N01, B1C-G02, B1C-F01, B1C-F03, B1C-D01, B1C-Q01, B2C-A01, B2C-A02, B2C-G01, B2C-G02, B2C-G03, B2C-F01, B2C-F02, B2C-F03, B2C-Q01, B2C-Q02, B1S-N01, B1S-P01, B1S-A01, B1S-F01, B1S-F02, B1S-F03, B1S-D01, B1S-Q01, B1S-Q02, B1S-D02, B2S-A01, B2S-A02, B2S-F01, B2S-F02, B2S-F03, B2S-Q01, B2S-Q02, B2S-D01, B2S-D02.
- Los datos es-ES originales, opciones, respuestas y validadores permanecen inalterados. Sin GitHub Pages ni cambios Cloudflare.


## Recuperación es→ca con notación matemática protegida — 20/11/2026

- **Cobertura actual:** 63/85 unidades, 377/505 lecciones, 1885/2.525 actividades en catalán, todas con estado `draft_unreviewed` y **0 revisiones lingüísticas humanas**. Pendientes: 22 unidades, 128 lecciones y 640 actividades.
- **Unidades nuevas del lote:** B1C-D01, B1C-F03, B1C-N01, B1C-Q01, B1S-A01, B1S-D01, B1S-D02, B1S-F02, B1S-F03, B2C-A01, B2C-F01, B2C-G01, B2C-G02, B2C-G03, B2S-A01, B2S-A02, B2S-D01, B2S-D02, B2S-F01, B2S-F02, B2S-F03, E3-A01, E3-F01, E3-G02, E3-N01, E4A-A01, E4A-D01, E4A-F01, E4A-Q01, E4B-D01, E4B-G02, E4B-N01, E4B-Q01.
- Todos los paquetes nuevos contienen **todas** sus lecciones, actividades y campos traducibles de la unidad según el contrato. Estado obligatorio `draft_unreviewed`.
- Los campos canónicos es-ES, IDs, soluciones, opciones y validadores se conservan literalmente; se verifican 245 JSON originales y SHA-256.
- Flujo local: modelos Softcatalà/Aina, memoria de traducción, aislamiento por unidad, pruebas de contrato, números y operadores, glosario, símbolos de subíndice, variable algebraica `y`, negaciones, navegador Chrome y fallback es-ES.
- Las unidades no aceptadas quedan fuera del sitio y siguen siendo `pending_translation`.
- Limitaciones: revisión lingüística y pedagógica humana pendiente, equivalencia semántica integral y WCAG 2.2 AA NO VERIFICADAS; no se habilitan GitHub Pages ni Cloudflare.


## Cierre de los paquetes pendientes ca-ES — 20/11/2026

- **Cobertura bajo contrato v1:** 85/85 unidades, 505/505 lecciones y 2525/2.525 actividades. Pendientes 0 unidades, 0 lecciones y 0 actividades.
- **Paquetes nuevos verificados:** B1C-F01, B1C-G02, B1S-F01, B1S-N01, B1S-P01, B1S-Q01, B1S-Q02, B2C-A02, B2C-F02, B2C-F03, B2C-Q01, B2C-Q02, B2S-Q01, B2S-Q02, E2-D01, E2-Q01, E3-A02, E3-A03, E3-D01, E3-N02, E3-Q01, E4A-A02.
- Los datos españoles canónicos, 245 JSON, IDs, respuestas, opciones, soluciones y validadores permanecen sin cambios.
- Estado de todos los paquetes: `draft_unreviewed`, sin revisión lingüística/pedagógica humana ni equivalencia semántica integral certificada.
- Se conservaron en evidencias externas las reparaciones literales por ID, SHA-256 de las fuentes, regresiones matemáticas (división con vocabulario Unicode, subíndices y variables), cribado textual y Chrome.
- El contrato v1 no cubre la traducción de `choices` ni de toda la interfaz; su traducción exige preservar validadores y compatibilidad.
- No se habilitan GitHub Pages ni Cloudflare. Publicación de código únicamente por Pull Request.

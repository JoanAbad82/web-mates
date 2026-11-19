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

## Cobertura de la segunda oleada de 1.º ESO — 19/11/2026

- Catálogo original: 9 cursos, 85 unidades, 505 lecciones y 2.525 actividades.
- 85 títulos de unidad en catalán: borrador editorial, sin revisión humana.
- E1-N01.v1.json y E1-N02.v1.json: 6 lecciones y 30 actividades traducidas por unidad, ya publicadas en PR #4.
- E1-N03.v1.json: 6 lecciones y 30 actividades nuevas (divisibilidad, primos, MCD y MCM).
- E1-N04.v1.json: 6 lecciones y 30 actividades nuevas (fracciones).
- E1-N05.v1.json: 6 lecciones y 30 actividades nuevas (decimales y porcentajes).
- **Total comprobable: 30/505 lecciones y 150/2.525 actividades en borrador**, con 5 de 11 unidades de 1.º ESO traducidas en los campos del contrato.
- **Pendientes: 475 lecciones, 2.375 actividades y seis unidades completas de 1.º ESO** (E1-P01, E1-M01, E1-G01, E1-A01, E1-F01 y E1-D01).
- **0 traducciones revisadas lingüísticamente**; el inglés sigue pendiente.
- Las opciones de selección que contienen palabras españolas (por ejemplo, «Primo», «Compuesto», «Exacto», «Periódico») continúan en español para conservar la compatibilidad con los validadores. Por eso **la experiencia visual no es íntegramente catalana**, aunque los campos traducibles estén cubiertos.
- Las regresiones comprueban números y operadores matemáticos, origen SHA-256, IDs, enunciados, pistas, explicaciones, navegación y fallback. **No prueban equivalencia semántica plena ni corrección editorial humana**.

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

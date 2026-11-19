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

## Cobertura de la oleada 1.? ESO, no homologada - 19/11/2026

- Cat?logo can?nico: 9 cursos, 85 unidades, 505 lecciones, 2.525 actividades.
- T?tulos catalanes de las 85 unidades: borrador editorial.
- Paquete E1-N01.v1.json: 6 lecciones y 30 actividades en catal?n, en borrador.
- Paquete E1-N02.v1.json: 6 lecciones y 30 actividades en catal?n, en borrador.
- **Total: 12/505 lecciones y 60/2.525 actividades (2 de 11 unidades de 1.? ESO).**
- **Pendiente: 493 lecciones, 2.465 actividades y 9 de las 11 unidades de 1.? ESO**; el resto conserva es-ES con fallback expl?cito.
- **0 traducciones revisadas ling??sticamente o validadas pedag?gicamente**. El ingl?s sigue pendiente.

El test i18n_math_invariants_eso1.py compara tokens num?ricos, operadores, campos traducibles,
repeticiones y SHA-256 de los originales; permite una excepci?n expl?cita para expresar
la posici?n de 100 unidades como centenes en catal?n. Acredita conservaci?n de las
expresiones y los datos, no equivalencia sem?ntica de cada explicaci?n; esta precisa
una revisi?n humana espec?fica de la unidad.

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

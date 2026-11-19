# Generación aislada de candidatos ca-ES

La aplicación WEB MATES **no descarga ni ejecuta modelos de traducción**. Esta herramienta sirve exclusivamente a mantenedores que preparen Pull Requests. Las traducciones generadas no pasan automáticamente a la web.

## Entorno

- Python 3.11 en un entorno virtual separado, con las dependencias fijadas en `tools/i18n/requirements-mt.txt`.
- CTranslate2 4.9.0 y pyonmttok 1.38.1, sin bibliotecas de ejecución de código de alumnado.
- Modelos descargados mediante HTTPS de Hugging Face y ejecutados localmente en CPU: [Softcatalà es-ca](https://huggingface.co/softcatala/translate-spa-cat) revisión `f747bff58e797e1f0e532248edc13d2a26d3be35`, y [Aina es-ca](https://huggingface.co/projecte-aina/aina-translator-es-ca) revisión `f5d15d332821102e98a9fe4ace7279e879d6012f`.
- SHA-256 de `model.bin`: Softcatalà `8d4b5c3f0d3ea2da10513e32445a802f1a8c20b02e505300efaf7f6ca73e4d8c`; Aina `fbea45cef8657dd4ec3b490ec39b35959ec4d114dc7d3e6d3cb17cef28fb5e9d`. Comprueba la licencia en la ficha y condiciones del modelo antes de redistribuir sus pesos.
- Un directorio de trabajo **fuera** del repositorio, con subcarpetas `model_softcatala_spa_cat`, `model_aina_es_ca` y `staging`. Los modelos y candidatos nunca se incluyen en Git.

## Flujo de desarrollo (PowerShell, ejemplo)

```powershell
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r tools\i18n\requirements-mt.txt
$env:WEBMATES_MT_WORKSPACE = 'C:\ruta\externa\webmates_mt'
.venv\Scripts\python.exe tools\i18n\mt_candidate_pipeline.py --seconds 900
python tests\i18n_semantic_risk_gate.py --candidate-dir "$env:WEBMATES_MT_WORKSPACE\staging"
python tools\i18n\preview_validate.py
```

El script `mt_candidate_pipeline.py` lee los 245 JSON canónicos, utiliza memoria exacta de traducciones previas y emite candidatos por unidad en la ruta externa. Un fallo de cobertura, un símbolo o número alterado, un término del glosario no respetado o una negación omitida **aísla la unidad completa**. Para volver a ejecutar un conjunto concreto utiliza `--units E2-N02 E2-P01`.

`preview_validate.py` crea una copia funcional aislada, comprueba el contrato, las invariantes, el cribado semántico de riesgo y las regresiones del navegador Chrome (incluido fallback español). El test no valida automáticamente la adecuación pedagógica o la calidad lingüística integral. La promoción al repositorio es una operación posterior, individualizada y bajo Pull Request.

## Riesgos y trazabilidad

Una fórmula preservada no demuestra que el enunciado diga lo mismo. Los modelos especializados pueden cambiar una negación o un concepto: el piloto detectó «números primos» traducido como «cosins» y confusiones entre «mediana» y «mitjana». Esos casos se convirtieron en pruebas negativas. Los modelos no están conectados con alumnado, no recolectan información identificativa y no publican en GitHub.

Las unidades aceptadas siguen marcadas como `draft_unreviewed`, con revisión humana lingüística y pedagógica pendiente. El contrato v1 conserva `choices`, `answer` y `validator`, por lo que algunas opciones pueden aparecer en castellano hasta que se apruebe un contrato compatible.

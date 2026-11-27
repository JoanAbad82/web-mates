# Contribuir a WEB MATES / Col·laborar amb WEB MATES

**Entrada común / Entrada comuna:** [Issue #1](https://github.com/JoanAbad82/web-mates/issues/1).

Lee [README](README.md), [LICENSE](LICENSE), [alcance de derechos](docs/DERECHOS_Y_ALCANCE.md) y [SECURITY](SECURITY.md).
Llegeix aquests documents abans de proposar canvis. El [programa universitario / programa universitari](docs/colaboracion/PROGRAMA_ES_CA.md) es una propuesta pendiente de activación; las contribuciones ordinarias siguen abiertas. / El pilot encara no està activat; les aportacions ordinàries continuen obertes.

## 1. Elegir alcance / Escollir l'abast

**ES:** Empieza por un ejercicio, una explicación, una traducción, un gráfico o una incidencia de accesibilidad. Comenta en Issue #1 el ID, ámbito e idioma que deseas revisar. La coordinación confirma la reserva antes de iniciar un lote, para evitar duplicados; no hace falta programar. Distingue la beta pública (https://webmates-e3a02-beta.pages.dev/) de la base del repositorio. Indica URL/ruta, fecha y versión observada o commit exacto; el mantenedor concilia discrepancias antes de aceptar parches.

**CA:** Comença per un exercici, una explicació, una traducció, un gràfic o una incidència d'accessibilitat. Comenta a la incidència #1 l'ID, l'àmbit i l'idioma. La coordinació confirma la reserva abans de començar un lot, per evitar duplicats; no cal programar. Distingeix la beta pública del codi del repositori. Indica URL/ruta, data i versió observada o commit exacte; el mantenidor concilia les discrepàncies abans d'acceptar pedaços.

## 2. Proponer / Proposar

**ES:** Sin Git, registra en la Issue #1 la observación, corrección y justificación independiente. Con Git, usa un fork y rama aislada, una PR pequeña (en borrador si no está lista) vinculada a la incidencia y basada en el commit acordado. No necesitas escritura directa en el repositorio. Usa las [plantillas bilingües](docs/colaboracion/PLANTILLAS_ES_CA.md). Incluye IDs, antes/después, fuentes y procedencia, licencia, pruebas y limitaciones; si usaste IA, indica el alcance y qué comprobaste de forma independiente.

**CA:** Sense Git, registra a la incidència #1 l'observació, correcció i justificació independent. Amb Git, usa un fork i una branca aïllada, una PR petita (en esborrany si encara no està llesta) vinculada a la incidència i basada en el commit acordat. No cal permís d'escriptura directa. Usa les plantilles bilingües. Inclou IDs, abans/després, fonts i procedència, llicència, proves i limitacions; si has utilitzat IA, indica l'abast i què has comprovat independentment.

## 3. Contratos y pruebas / Contractes i proves

- **ES:** Conserva IDs, prerrequisitos, esquemas y los 245 JSON canónicos es-ES en correcciones exclusivamente lingüísticas; no modifiques silenciosamente respuestas, opciones, validadores ni fórmulas. Una traducción puede restaurar una fórmula al original si se acredita la comparación. Si hay un error canónico matemático o de validador, abre una incidencia separada y bloquea su promoción hasta resolverla. Las mejoras de ejercicios indican objetivo, enunciado, solución, pistas, distractores, prerrequisitos y comprobación independiente.
- **CA:** Conserva IDs, prerequisits, esquemes i els 245 JSON canònics es-ES en correccions exclusivament lingüístiques; no modifiquis silenciosament respostes, opcions, validadors ni fórmules. Una traducció pot restaurar una fórmula a l'original amb una comparació acreditada. Si hi ha un error matemàtic canònic o del validador, obre una incidència separada i bloqueja'n la promoció fins que es resolgui. Les millores d'exercicis indiquen objectiu, enunciat, solució, pistes, distractors, prerequisits i comprovació independent.

Para la base ca-ES v1, consulta [contrato](docs/i18n/PAQUETES_CA_ES_V1.md) y [plan](docs/i18n/CA_ES_PLAN_Y_CONTRATO.md). Las herramientas existentes pueden generar una plantilla de traducción y recalcular cobertura cuando el cambio lo exige (no en simples informes de revisión):

```
python tests/i18n_scaffold.py --unit E2-A02 --lesson E2-A02-L01 --output C:/temp/E2-A02.template.json
python tests/i18n_coverage.py --write
```

Úsalas únicamente en la copia aislada de la base compatible; no presupongas que los contratos del código coinciden con todos los recursos de la beta. / Fes-les servir només en una còpia aïllada de la base compatible; no pressuposis que els contractes coincideixen amb tots els recursos de la beta.

## 4. Revisión y reconocimiento / Revisió i reconeixement

La revisión independiente documenta alcance, competencia de la persona revisora, evidencia y PASS / FAIL / NO VERIFICADO. El mantenedor registra la decisión y las discrepancias; no se eleva `draft_unreviewed` por el mero merge. Los créditos adicionales públicos requieren conformidad de la persona y autorización de publicación; alias opcional. El historial público de GitHub ya identifica las aportaciones realizadas allí. No se promete acreditación académica ni empleo.

La revisió independent documenta abast, competència de la persona revisora, evidència i PASS / FAIL / NO VERIFICAT. El mantenidor registra la decisió i les discrepàncies; no s'eleva `draft_unreviewed` pel simple merge. Els crèdits públics addicionals requereixen conformitat de la persona i autorització de publicació; àlies opcional. L'historial públic de GitHub ja identifica les aportacions fetes allà. No es promet acreditació acadèmica ni feina.

## 5. Derechos, privacidad y seguridad / Drets, privacitat i seguretat

**MIT** para aportaciones originales aceptadas, salvo excepción de derechos expresamente aprobada. Debes poder conceder esos permisos. No copies material ajeno incompatible, ni material de IA con derechos inciertos; declara procedencia y atribución. No incluyas claves, datos de menores, CV, teléfonos ni información personal innecesaria en canales públicos. Vulnerabilidades: seguir [SECURITY](SECURITY.md), nunca publicar detalles explotables. Pruebas locales con datos sintéticos; no ejecutar pruebas invasivas ni envíos de prueba a producción. Los PR no autorizan publicación ni cambios de servicios, permisos o costes.

**MIT** per a aportacions originals acceptades, llevat d'una excepció de drets aprovada expressament. Has de poder concedir aquests permisos. No copiïs material aliè incompatible ni material d'IA amb drets incerts; declara procedència i atribució. No incloguis claus, dades de menors, CV, telèfons ni informació personal innecessària en canals públics. Vulnerabilitats: segueix SECURITY, mai publiquis detalls explotables. Proves locals amb dades sintètiques; no executis proves invasives ni enviaments de prova a producció. Les PR no autoritzen publicació ni canvis de serveis, permisos o costos.

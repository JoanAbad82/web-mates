# WEB MATES — matemáticas abiertas / matemàtiques obertes

**Proyecto y desarrollo web: Joan.** Proyecto independiente de código abierto para ESO y Bachillerato / Projecte independent de codi obert per a ESO i batxillerat.

**[Consultar la beta educativa / Consultar la beta educativa](https://webmates-e3a02-beta.pages.dev/)**

## Estado comprobado / Estat comprovat — 27/11/2026

- **Beta pública:** 9 itinerarios, 85 unidades y 505 lecciones; 2.525 actividades en los manifiestos lingüísticos. Castellano, catalán e inglés en borrador. Acceso y recursos representativos comprobados el 27/11/2026 por GET y comparación con la referencia del despliegue del 24/11/2026. No es una certificación integral actual.
- **Repositorio público:** código y material original en desarrollo; base de revisión documental `45e1b5b5243983fbda65c6e923a37a5c7c0434ea`. El manifiesto ca-ES de esa base contiene 85/85 unidades, 505/505 lecciones y 2.525/2.525 actividades traducibles en borrador, con 0 lecciones y 0 actividades marcadas como revisadas. Esa base no contiene el manifiesto en-GB de la beta. El código de GitHub no es una copia exacta del sitio desplegado.
- **Estado editorial:** material asistido por IA, susceptible de errores; no homologado ni equivalente a revisión matemática, didáctica, lingüística o curricular especializada. Los manifiestos públicos ca-ES y en-GB declaran 0 lecciones y 0 actividades revisadas. Cobertura de traducción no equivale a corrección. No expide títulos, certificados ni notas oficiales.

**Català:** La beta pública ofereix 9 itineraris, 85 unitats, 505 lliçons i 2.525 activitats en esborrany, amb castellà, català i anglès. El repositori i la beta són versions diferents; la base documental indicada conté el manifest català, però no l'anglès. La cobertura dels manifestos no certifica cap revisió humana. És material provisional assistit per IA, no homologat.

## Código abierto y licencia

**Licencia elegida: MIT.** Véase [LICENSE](LICENSE) y
[alcance de derechos](docs/DERECHOS_Y_ALCANCE.md).

La intención del proyecto es distribuir bajo MIT tanto el código original de
HTML/CSS/JavaScript y los motores como los contenidos educativos originales
que el titular tiene derecho a licenciar, incluidos los ejemplos y ejercicios
originales de la carpeta site/data. La licencia NO concede derechos de terceros
sobre una copia concreta ajena (textos, ilustraciones, recursos externos) ni
derechos exclusivos sobre conceptos y resultados matemáticos o signos
distintivos. Las referencias al BOE son referencias de normativa, no material
de titularidad exclusiva del proyecto. Toda procedencia externa deberá
respetar sus propios términos y atribuciones.

MIT permite libremente reutilizar y modificar, incluidas versiones comerciales,
y no obliga a publicar las mejoras; exige conservar el aviso de copyright y
licencia. Las nuevas contribuciones aceptadas deberán ser compatibles con MIT.

## Estructura y ejecución

- `site/`: aplicación estática con catálogo y ejercicios.
- `tests/`: comprobaciones estructurales reproducibles de la versión del repositorio.
- [CONTRIBUTING.md](CONTRIBUTING.md): procedimiento de participación.
- [SECURITY.md](SECURITY.md): comunicación responsable de vulnerabilidades.

Para probar el código público, utiliza una copia local aislada de la base acordada y un servidor HTTP limitado a 127.0.0.1. El fichero _headers solo tiene efecto en proveedores que interpretan ese formato: no garantiza CSP en cualquier servidor. No se deben ejecutar pruebas invasivas contra la beta pública.

El estudio no requiere cuenta de estudiante. Las pruebas educativas deben utilizar datos sintéticos y no incluir información personal de menores. La beta dispone de avisos de privacidad diferenciados: [ES](https://webmates-e3a02-beta.pages.dev/privacidad.html), [CA](https://webmates-e3a02-beta.pages.dev/privacitat.html), [EN](https://webmates-e3a02-beta.pages.dev/privacy-en.html). La versión pública de referencia mantiene desactivados los envíos de comentarios en inglés. La política de privacidad vigente del sitio y las condiciones del servicio deben consultarse; no se infiere cumplimiento legal de una prueba GET.

## Participar / Participar-hi

Buscamos revisiones pequeñas y verificables de matemáticas, didáctica, lenguas, tecnología y accesibilidad. No necesitas programar. / Busquem revisions petites i verificables de matemàtiques, didàctica, llengües, tecnologia i accessibilitat. No cal programar.

- [Issue #1 — Revisión humana / Revisió humana](https://github.com/JoanAbad82/web-mates/issues/1).
- [Guía de contribución / Guia de contribució](CONTRIBUTING.md).
- [Programa universitario propuesto / Programa universitari proposat](docs/colaboracion/PROGRAMA_ES_CA.md).
- [Plantillas / Plantilles](docs/colaboracion/PLANTILLAS_ES_CA.md).

El piloto universitario está propuesto, no confirmado: su activación depende de la aprobación de condiciones y de la disponibilidad de coordinación y revisores. Las propuestas ordinarias de revisión humana siguen siendo bienvenidas. Cada aportación debe indicar si se refiere a la beta o al código, versión/fecha o commit, IDs, evidencia, derechos y límites.

## Publicación por etapas / Publicació per etapes

El repositorio abierto y la beta pública son entregables distintos. Una incidencia o Pull Request no implica integración, revisión especializada ni despliegue. Los cambios se revisan y se publican únicamente con las condiciones y autorización aplicables. La existencia de la beta no significa que se hayan cerrado los criterios F4 de publicación integral, accesibilidad, privacidad y revisión especializada.

El nombre MATEVOLT sigue provisional, pendiente de examen de semejanzas; su uso en el repositorio no acredita disponibilidad de marca. No se utiliza GitHub Pages como enlace de la beta: el enlace público indicado arriba corresponde a otro alojamiento.

## Referencia histórica de localización (19/11/2026)

En la base pública, la cobertura ca-ES v1 se consiguió con traducción asistida y controles por ID y SHA-256. Algunas opciones y etiquetas permanecían vinculadas al castellano para preservar validadores. Los controles automáticos no sustituyen la revisión humana. Esta descripción histórica no caracteriza todos los textos de la beta trilingüe posterior.

[Contrato de paquetes CA](docs/i18n/PAQUETES_CA_ES_V1.md) · [Plan de localización](docs/i18n/CA_ES_PLAN_Y_CONTRATO.md). No cambiar los contratos ni los datos canónicos mediante una propuesta exclusivamente lingüística.

# Contribuir a WEB MATES

Queremos mejorar matemáticas, accesibilidad, UX móvil, seguridad, rendimiento,
idiomas y módulos nuevos. Preferimos propuestas concretas mediante Issues y
Pull Requests, con IDs estables y pruebas reproducibles.

**Licencia de aportaciones: MIT** para contribuciones originales aceptadas al
proyecto, salvo que se indique expresamente una excepción de derechos aprobada.
Quien contribuya debe tener permiso para ofrecer su propio material bajo MIT.
No copiar material de libros, páginas o repositorios sin licencia compatible
y reconocimiento de atribuciones.

Las mejoras de ejercicios deben indicar ID, objetivo, enunciado, solución,
pistas, distractores, prerrequisitos y comprobación matemática. No declarar
contenido validado si no hay evidencia de revisión humana y pruebas.

No enviar contraseñas, claves ni datos de estudiantes, ni usar ejemplos
que identifiquen a menores. Las vulnerabilidades se comunican por canales
privados cuando GitHub permita habilitarlos.

Los pull requests no se despliegan automáticamente. El proyecto utiliza
versionado, pruebas y revisión de cambios; es posible añadir futuras
secciones sin alterar silenciosamente los identificadores actuales.

## Català (prioritat actual)

Per col·laborar en la traducció completa al català, presenta't i indica els IDs de la
unitat que vols traduir a [l'Issue #1](https://github.com/JoanAbad82/web-mates/issues/1).
Consulta el [contracte de localització](docs/i18n/PAQUETES_CA_ES_V1.md).

Pots obtenir una plantilla sense traduir amb:
python tests/i18n_scaffold.py --unit E2-A02 --lesson E2-A02-L01 --output C:/temp/E2-A02.template.json.
Completa tots els textos, conserva IDs, respostes, opcions i validadors,
afegeix el paquet versionat i regenera el manifest amb
python tests/i18n_coverage.py --write.

No confonguis cobertura de traducció amb revisió matemàtica ni lingüística.
Marca els textos com a esborrany, revisió o validat només amb les evidències i
l'esquema aplicable. No introdueixis dades de menors ni obres de tercers
sense una llicència compatible amb MIT. Les Pull Requests no es despleguen automàticament.

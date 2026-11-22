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

## Català i castellano: revisió humana dels esborranys ca-ES

**Estado / Estat (20/11/2026):** los paquetes ca-ES cubren los campos traducibles
del contrato v1 de las 85 unidades, 505 lecciones y 2.525 actividades, pero siguen
en estado **draft_unreviewed**. Hay **0 revisiones lingüísticas o pedagógicas
humanas certificadas**. Algunas opciones de respuesta y etiquetas de interfaz
siguen en castellano; la cobertura contractual no significa una web plenamente
revisada ni una certificación de accesibilidad.

**Prioridad / Prioritat:** revisión humana de exactitud matemática, terminología
castellana y catalana, y accesibilidad (lectura, teclado y lector de pantalla).
No se solicita volver a traducir paquetes ya cubiertos sin una discrepancia concreta.

### Cómo participar / Com participar

1. Elige una unidad, lección o ejercicio por su ID y comprueba el estado en
   [la Issue #1](https://github.com/JoanAbad82/web-mates/issues/1).
   Comenta qué vas a revisar para evitar duplicidades.
2. Documenta el texto o comportamiento actual, corrección propuesta,
   justificación matemática o lingüística y pasos de reproducción. Para
   accesibilidad, indica dispositivo, navegador y tecnología de apoyo si procede,
   sin incluir datos personales de estudiantes.
3. Envía un cambio pequeño mediante Pull Request, citando los IDs afectados,
   la procedencia y los permisos de uso de cualquier contenido aportado.
   En cambios de localización, conserva los IDs, fórmulas, soluciones, opciones,
   validadores y grafos de prerrequisitos del castellano original. Una corrección
   matemática o de validadores requiere propuesta y pruebas separadas; no debe
   introducirse como traducción silenciosa.
4. Ejecuta las verificaciones correspondientes, por ejemplo
   python tests/verificar_catalogo.py,
   python tests/i18n_contract_tests.py y
   python tests/i18n_coverage.py (sin --write para comprobar).
   Si se modifica un paquete, sigue el
   [contrato de localización](docs/i18n/PAQUETES_CA_ES_V1.md) para regenerar
   el manifiesto antes de comprobarlo. Aporta evidencia de los tests realizados.

**Català:** revisa un bloc identificat, descriu l'error i la correcció,
i participa a [la Issue #1](https://github.com/JoanAbad82/web-mates/issues/1).
Les revisions han de conservar els identificadors i les solucions originals
quan només es canvia la traducció.

Las comprobaciones automáticas no certifican la calidad matemática,
lingüística ni pedagógica. Mantén **draft_unreviewed** hasta que exista una revisión
humana acreditada conforme al contrato. No publiques datos de menores ni
material ajeno sin licencia compatible con MIT. Las PR no despliegan la web.

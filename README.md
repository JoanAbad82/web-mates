# WEB MATES — matemáticas abiertas

**Proyecto y desarrollo web: Joan**.

**Estado: proyecto de código abierto en desarrollo.** Este repositorio distribuye código y material educativo original bajo MIT; no equivale a una web pública desplegada ni a un temario validado.
La aplicación web contiene material matemático de ESO y Bachillerato. No expide
títulos, certificados o notas oficiales. Las 505 lecciones y 2.525 actividades
se encuentran en estado editorial de revisión; los ejercicios no están
homologados, y pueden contener errores. El catálogo incluye 9 itinerarios y
85 unidades.

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

- site/: aplicación web estática con catálogo y ejercicios.
- tests/: comprobaciones estructurales reproducibles.
- CONTRIBUTING.md: procedimiento de participación.
- SECURITY.md: comunicación responsable de vulnerabilidades.

Desde site/ puede ejecutarse un servidor HTTP estático local para uso
de prueba. El fichero _headers solo tiene efecto en proveedores que
interpreten ese formato: no garantiza CSP en cualquier servidor.

WEB MATES no necesita cuenta, no instala analítica identificativa y usa
estado educativo temporal de sesión. Es posible que un navegador conserve
datos de versiones anteriores; la aplicación prevé borrado voluntario.
Un futuro hosting puede tratar IP y logs de visitantes, independientemente
del funcionamiento efímero.

## Participar

Las aportaciones de código y contenido por GitHub Issues/Pull Requests son
bienvenidas cuando se publique el repositorio. Cada contribución debe
identificar procedencia, derechos, pruebas y las lecciones afectadas; una
propuesta no equivale a revisión curricular o pedagógica.

## Publicación por etapas

El repositorio abierto y la web pública son dos entregables distintos.
La fuente WIP puede distribuirse sin haber homologado 505 lecciones.
El sitio educativo para menores requiere valorar exactamente qué contenido
se muestra, su corrección, accesibilidad, privacidad, seguridad y operador.
La aplicación actual conserva gates F4 NO VERIFICADO y publicación web NO-GO.

El nombre visible MATEVOLT sigue provisional, pendiente de un examen de
semejanzas; no se considera una marca disponible por incluirla en un repositorio.
GitHub Pages no está activado: el código fuente público no significa que la web esté desplegada.

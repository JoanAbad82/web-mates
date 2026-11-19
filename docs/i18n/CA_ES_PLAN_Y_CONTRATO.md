# Localización de WEB MATES: ca-ES, es-ES y futura en-GB

**Estado 19/11/2026: primera entrega de interfaz bilingüe; NO es la traducción completa.**

## Prioridad y cobertura observada

| Recurso | Castellano | Catalán | Estado ca |
| --- | ---: | ---: | --- |
| Catálogo e identificadores | 9 itinerarios / 85 unidades / 505 lecciones | 9 nombres de curso / 85 títulos de unidad | Borrador lingüístico |
| Navegación, avisos y parte de controles | Original | Selección de cadenas frecuentes | Parcial (no todos los controles F1/F3) |
| Títulos de 505 lecciones | 505 | 0 de 505 incorporados como traducción propia | Pendiente |
| Contenido teórico y didáctico de 505 lecciones | 505 editoriales en revisión | 0 traducidas íntegramente | Pendiente |
| 2.525 actividades (enunciado, opciones, pistas, feedback) | 2.525 editoriales en revisión | 0 de 2.525 completas en catalán | Pendiente |
| Inglés | — | — | Futuro, no implementado |

Las traducciones ca-ES iniciales **no se consideran revisadas ni validadas lingüísticamente**. El estado editorial matemático de la versión española tampoco cambia.

## Funcionamiento implementado

El selector «Català (beta) / Castellano» aparece en la cabecera. Su preferencia viaja en la URL: `?lang=ca` o `?lang=es`; por decisión de prioridad la primera visita empieza en catalán. No utiliza cookies ni localStorage.

La traducción inicial de interfaz se aplica mediante un mapa exacto; no traduce fórmulas ni texto libre y no ejecuta servicios externos. Los nombres de curso y los **85 títulos de unidad** están mapeados desde los IDs canónicos. Las lecciones y actividades originales siguen en castellano y se anuncian con una franja informativa, con enlace a la colaboración. Cuando la lección no está traducida, el contenido principal conserva `lang=es` para lectores de pantalla; no se etiqueta falsamente como catalán.

**Limitación deliberada:** algunas cadenas de interfaz permanecen en castellano porque los módulos F1 y F3 aún no consumen recursos de idioma por clave. No presentar este selector como versión íntegramente traducida.

## Contrato para traducciones por unidad

El trabajo siguiente debe mover los textos a paquetes por idioma `ca-ES`, sin sobrescribir el JSON canónico `es-ES`. Una superposición puede usar claves estables:

```json
{
  "locale": "ca-ES",
  "unit_id": "E3-A02",
  "review_status": "esborrany",
  "lessons": {
    "E3-A02-L01": {
      "title": "...",
      "objectives": [],
      "content_blocks": []
    }
  },
  "activities": {
    "F1-E3-A02-L01-01": {
      "prompt": "...",
      "hint": "...",
      "explanation": "..."
    }
  }
}
```

El esquema anterior es una **propuesta de contrato**, todavía no está integrado al motor. Los índices y las claves deben cotejarse con los documentos de origen. Las opciones de respuesta son un caso sensible: si un ejercicio es de selección y se traducen opciones, el validador debe resolverse por ID estable, no por una cadena de texto mutable. No cambiar soluciones, fórmulas, prerrequisitos, IDs ni validadores sin pruebas y un cambio de contrato explícito.

## Aceptación de contribuciones

1. Recurso completo por unidad: títulos, contenido didáctico, enunciados, opciones, pistas, explicaciones y etiquetas visibles; estado de revisión explícito.
2. Inventario mecánico de IDs (9/85/505, ejercicios por unidad), igualdad de respuestas y validadores, sin referencias rotas ni nuevo ciclo en el grafo.
3. Pruebas en `es` y `ca` con alternativas de teclado, contraste y móviles; evidencia de las traducciones sensibles.
4. Revisión de terminología matemática catalana por persona competente antes de cambiar el estado a validado.
5. No publicar datos de menores ni contenido con derechos de terceros; aportaciones compatibles con MIT.

Propuestas y distribución de trabajo: https://github.com/JoanAbad82/web-mates/issues/1.

## Evidencia de la primera entrega

Prueba en Chrome de 390px, con emulación táctil (no móvil real), ruta de curso, selector ca/es y fallback de lección. Se ejecuta únicamente contra un servidor de loopback y bloquea accesos externos. Los resultados deben archivarse en el expediente F4 independiente antes de incorporar cambios a main.

**Publicación de código abierto ≠ despliegue web público.** El repositorio está publicado bajo MIT. El despliegue de una web para menores sigue condicionado a los gates reales de seguridad, privacidad, accesibilidad, revisión educativa y una decisión específica de publicación.

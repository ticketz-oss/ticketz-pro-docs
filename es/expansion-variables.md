---
title: Variables de expansión
lang: es
slug: expansion-variables
description: Referencia de variables de expansión disponibles en Ticketz para plantillas y automatizaciones.
---

Las variables de expansión permiten crear mensajes dinámicos en plantillas y flujos de automatización.

## Variables disponibles en Ticketz

- `name`: nombre completo del contacto
- `firstname`: primer nombre del contacto
- `email`: email del contacto (si está en el registro)
- `greeting`: saludo según la hora del día (buenos días, buenas tardes, etc)
- `queue`: nombre de la cola del ticket
- `protocol`: número de protocolo en el formato `YYYYMMDD-TicketId`
- `user`: nombre del usuario activo en la atención
- `time`: hora actual
- `ticket`: número del ticket

## Otras Informaciones del contacto

Además de las variables estándar, también puedes usar como variables los valores cargados en **Otras Informaciones** del contacto.

## Comportamiento en plantillas

En plantillas, cualquier variable que no se proporcione automáticamente se solicitará cuando el usuario intente enviar la plantilla.

Si el uso es por automatización, la llamada debe proporcionar todos los valores que la plantilla necesita para funcionar.

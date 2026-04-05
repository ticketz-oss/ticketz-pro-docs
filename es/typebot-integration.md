---
title: Integración con Typebot
lang: es
slug: typebot-integration
description: Configuración de colas de Ticketz PRO usando Typebot.
---

Cuando una cola se configura con el driver Typebot, Ticketz solicita la URL base de tu instalación de Typebot Viewer. En la práctica, esto suele ser solo el protocolo y hostname del módulo Viewer, por ejemplo `https://typebot-viewer.example.com`.

También se solicita el **Public Id** del flujo que debe ejecutarse para esa cola.

## Configuración de la cola

La integración con Typebot expone estas opciones clave:

- **Interpret RichText**: convierte los estilos de texto de Typebot al formato compatible con el canal actual.
- **Parámetros adicionales**: acepta un objeto JSON plano con valores `string`, `number` o `boolean` que quedan disponibles como variables dentro del flujo.

Typebot no admite arrays ni objetos anidados en ese conjunto de parámetros adicionales.

## Elementos compatibles

- La burbuja de **botones** es compatible y se renderiza según las capacidades del canal y las preferencias de Ticketz.
- El bloque **Wait** es compatible, pero no se recomienda porque el contacto puede enviar un nuevo mensaje durante la espera.
- Las burbujas de **imagen** y **audio** funcionan normalmente.
- Para enviar **documentos**, usa la burbuja `embed`.

## Variables disponibles en el flujo

Además de tus parámetros personalizados, Ticketz entrega variables estándar:

- `number`: dirección del contacto. En WhatsApp normalmente aparece como `55DDDNUMERO`.
- `pushName`: nombre del contacto almacenado en Ticketz.
- `firstMessage`: primer mensaje enviado por el contacto.
- `ticketId`: número del ticket actual.
- `backendURL`: URL completa del backend.
- `token`: token bearer usado para emitir solicitudes HTTP que actúan sobre el ticket y la sesión actuales.
- `metadata`: información adicional expuesta por el driver de conexión y el contexto de ejecución.

## Comandos especiales desde Typebot

Ticketz permite ejecutar funciones como transferir a otra cola, asignar a un usuario, terminar la sesión o cerrar la atención. Estos comandos se envían mediante una burbuja **Text** que empieza con `#` y va seguida inmediatamente por una cadena JSON.

Ejemplo: transferir la conversación actual a la cola `99`.

```text
#{ "queueId": 99 }
```

Puedes descargar un flujo listo con burbujas de comandos en [archivos de ejemplo]({{ '/es/examples/' | relative_url }}).

Para la referencia completa de triggers, consulta [Triggers y comandos]({{ '/es/integration-triggers/' | relative_url }}).

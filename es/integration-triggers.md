---
title: Triggers y Comandos
lang: es
slug: integration-triggers
description: Referencia completa de comandos de integración en Ticketz PRO.
---

Los triggers son comandos estructurados que una integración puede devolver a Ticketz por mensaje o respuesta de webhook para ejecutar acciones sobre el ticket actual.

## Formato del mensaje

Los mensajes usan la siguiente estructura:

```json
{
  "type": "text",
  "content": "texto del mensaje",
  "mediaUrl": "https://example.com/archivo"
}
```

- `type` puede ser `text`, `image`, `video`, `audio`, `gif` o `document`.
- `content` se usa en mensajes de texto.
- `mediaUrl` se usa para medios no textuales.

## Formas de enviar comandos

### 1. Burbuja de texto en Typebot

Las integraciones Typebot pueden enviar un comando por vez en una burbuja de texto que comienza con `#` y sigue con un payload JSON.

```text
#{
  "queueId": 99
}
```

### 2. Respuesta de webhook

Las integraciones webhook pueden responder con:

- un comando individual
- un mensaje con trigger opcional
- un array de mensajes, cada uno con trigger opcional

Ejemplo:

```json
[
  {
    "type": "text",
    "content": "Un mensaje"
  },
  {
    "type": "text",
    "content": "Otro mensaje",
    "trigger": { "action": "wait", "seconds": 2 }
  },
  {
    "type": "text",
    "content": "Un mensaje con trigger",
    "trigger": { "closeTicket": true }
  }
]
```

### 3. Solicitud HTTP directa al backend

Typebot, Webhook o cualquier sistema externo puede llamar al backend directamente si dispone del token de autorización.

- Endpoint: `${BACKEND_URL}/integrations/webhook`
- Método: `POST`
- Cabecera: `Authorization: Bearer ${token}`

El payload puede seguir cualquier formato aceptado en la respuesta de webhook.

## Comandos disponibles

### Enviar un mensaje

`message` puede ser un objeto de mensaje o un array de objetos.

```json
{
  "message": {
    "type": "text",
    "content": "contenido del mensaje"
  }
}
```

### Enviar un mensaje con menú de opciones

```json
{
  "message": {
    "type": "text",
    "content": "Un mensaje"
  },
  "action": "menu",
  "menuOptions": [{ "text": "Opción 1" }, { "text": "Opción 2" }]
}
```

### Enviar un mensaje con botón de URL

Actualmente depende de canales que soporten este formato, como Notificamehub WhatsApp Oficial.

```json
{
  "message": {
    "type": "text",
    "content": "Haz clic en el botón de abajo para saber más"
  },
  "action": "menu",
  "menuOptions": [
    {
      "text": "Ticketz PRO",
      "url": "https://pro.ticke.tz"
    }
  ]
}
```

### Transferir a otra cola

```json
{
  "queueId": 99
}
```

Si la nueva cola no es atendida por chatbot, Ticketz también elimina ese atributo.

### Transferir a otra cola y usuario

```json
{
  "queueId": 99,
  "userId": 42
}
```

El ticket se acepta automáticamente y aparece en el área activa del nuevo usuario.

### Terminar la sesión de integración

```json
{
  "action": "endSession"
}
```

### Detener el chatbot

Es equivalente a `endSession` y existe por compatibilidad con automatizaciones anteriores.

```json
{
  "stopbot": true
}
```

### Cerrar el ticket actual

```json
{
  "closeTicket": true
}
```

### Añadir una nota interna al ticket

```json
{
  "action": "note",
  "message": {
    "content": "Texto de la nota"
  }
}
```

### Actualizar varias propiedades del ticket

```json
{
  "action": "updateTicket",
  "ticketData": {
    "status": "pending",
    "userId": 42,
    "queueId": 99,
    "justClose": false,
    "annotation": "Escalado por automatización"
  }
}
```

Campos válidos en `ticketData`:

- `status`: `pending`, `open` o `closed`
- `userId`: transfiere a otro usuario
- `queueId`: transfiere a otra cola
- `justClose`: cierra sin otras reglas de transición
- `annotation`: añade una nota al transferir

### Esperar algunos segundos

Solo tiene efecto dentro de un array de comandos.

```json
{
  "action": "wait",
  "seconds": 2
}
```

### Ping

Hace que Ticketz responda automáticamente con `pong`, lo que ayuda a preservar el orden de procesamiento en Typebot.

```json
{
  "action": "ping"
}
```

### Añadir una etiqueta al ticket

Si `advanceOnly` es verdadero, una etiqueta de embudo no reemplaza otra etiqueta del mismo embudo que ya esté más avanzada.

```json
{
  "action": "addTag",
  "tagId": 99,
  "advanceOnly": true
}
```

### Quitar una etiqueta del ticket

```json
{
  "action": "removeTag",
  "tagId": 99
}
```

### Limpiar todas las etiquetas del ticket

```json
{
  "action": "clearTags"
}
```

### Añadir una etiqueta al contacto

```json
{
  "action": "addContactTag",
  "tagId": 99,
  "advanceOnly": true
}
```

### Quitar una etiqueta del contacto

```json
{
  "action": "removeContactTag",
  "tagId": 99
}
```

### Limpiar todas las etiquetas del contacto

```json
{
  "action": "clearContactTags"
}
```

Para ver payloads listos para usar, revisa [Archivos de ejemplo]({{ '/es/examples/' | relative_url }}).

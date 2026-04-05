---
title: Vista General de Integraciones
lang: es
slug: overview
description: Cómo funcionan las integraciones de cola en Ticketz PRO.
---

Ticketz PRO incluye un motor agnóstico de integraciones. Las opciones nativas iniciales son Typebot y Webhook o flujos basados en n8n.

## Cómo actúa una integración en la cola

Una integración comienza a ejecutarse en el momento en que el contacto envía el primer mensaje a la cola. Permanece activa hasta que ocurra una de estas situaciones:

- Un agente acepta la conversación y la mueve al área de atención activa.
- El driver de integración detecta que el flujo llegó al final.
- El contenido de la integración solicita terminar la sesión, cerrar el ticket o transferir el ticket a otra cola.

Cuando el ticket se transfiere a una nueva cola, la integración de la cola de destino se activa inmediatamente, sin importar si es Typebot, Webhook, chatbot interno u otro driver futuro.

## Endpoint para listar colas

Las integraciones pueden obtener la lista de colas disponibles mediante el siguiente endpoint:

```text
${BACKEND_URL}/integrations/listQueues
```

Este endpoint es útil cuando la automatización necesita elegir la siguiente cola de forma dinámica.

## Lectura recomendada

- [Typebot en la cola]({{ '/es/typebot-integration/' | relative_url }})
- [Triggers y comandos]({{ '/es/integration-triggers/' | relative_url }})
- [Archivos de ejemplo]({{ '/es/examples/' | relative_url }})

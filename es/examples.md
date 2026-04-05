---
title: Archivos de Ejemplo
lang: es
slug: examples
description: Assets de ejemplo descargables para la documentación de Ticketz PRO.
---

Estos archivos se alojan directamente en GitHub Pages, por lo que no necesitas depender de enlaces a `raw.githubusercontent.com`.

## Archivos para descargar

- [Ticketz PRO Smart Reception (n8n).json]({{ '/assets/examples/Ticketz%20PRO%20Smart%20Reception%20(n8n).json' | relative_url }}): Ejemplo de flujo n8n con webhook y recepción inteligente con IA
- [typebot-export-bolhas-de-triggers.json]({{ '/assets/examples/typebot-export-bolhas-de-triggers.json' | relative_url }}): Exportación de Typebot con burbujas de comandos y triggers
- [example.env-backend]({{ '/assets/examples/example.env-backend' | relative_url }}): Plantilla del entorno del backend
- [example.env-frontend]({{ '/assets/examples/example.env-frontend' | relative_url }}): Plantilla del entorno del frontend
- [example.env-integrations]({{ '/assets/examples/example.env-integrations' | relative_url }}): Plantilla del entorno de integraciones y Typebot

## Notas de uso

- Usa el flujo de n8n como punto de partida, no como flujo listo para producción.
- Revisa tokens, prompts, identificadores de cola y nodos de credenciales antes de importar cualquier automatización.
- Los hostnames y datos SMTP de los archivos `.env` son placeholders y deben reemplazarse.

<div class="download-note">
  Como estos archivos forman parte del propio sitio de documentación, las descargas son estables y no dependen del rate limit de GitHub raw.
</div>

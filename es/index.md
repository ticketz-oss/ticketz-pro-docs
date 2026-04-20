---
title: Inicio
lang: es
slug: home
description: Documentación de Ticketz PRO en español.
---

La documentación de Ticketz PRO ahora está organizada como un sitio de GitHub Pages con secciones dedicadas a configuración, integraciones, cobro y archivos de ejemplo descargables.

<div class="hero-grid">
  <section class="hero-card">
    <h3>Integraciones</h3>
    <p>Entiende cómo Ticketz entrega la cola a Typebot, a webhooks y a flujos en n8n.</p>
  </section>
  <section class="hero-card">
    <h3>Infraestructura</h3>
    <p>Configura Backblaze e instala la stack de Typebot con los archivos de entorno correctos.</p>
  </section>
  <section class="hero-card">
    <h3>Pagos</h3>
    <p>Revisa el comportamiento de QuickPix y conecta WHMCS como capa de suscripción.</p>
  </section>
</div>

## Empieza aquí

1. Lee la [vista general de integraciones]({{ '/es/overview/' | relative_url }}) si estás montando automatizaciones en colas.
2. Abre [Typebot en la cola]({{ '/es/typebot-integration/' | relative_url }}) y [triggers y comandos]({{ '/es/integration-triggers/' | relative_url }}) si estás construyendo flujos de chatbot.
3. Usa [instalación de Typebot]({{ '/es/typebot-setup/' | relative_url }}) cuando necesites habilitar los contenedores extra.
4. Revisa [Ticketz Sidekick]({{ '/es/sidekick/' | relative_url }}) para backup, restore y migración de datos.
5. Ve a [archivos de ejemplo]({{ '/es/examples/' | relative_url }}) para descargar JSON y plantillas `.env`.
6. Consulta [Server Cluster (not-released)]({{ '/es/server-cluster/' | relative_url }}) para configuración de clúster y enrutamiento de login entre nodos.

## Guías disponibles

<div class="card-grid">
  <section class="info-card">
    <h3><a href="{{ '/es/backblaze/' | relative_url }}">Backblaze</a></h3>
    <p>Configura el almacenamiento de archivos de Ticketz.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/overview/' | relative_url }}">Integraciones</a></h3>
    <p>Comprende el ciclo de vida de una integración conectada a una cola.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/webchat/' | relative_url }}">Webchat</a></h3>
    <p>Configura el widget flotante, personaliza estilos y publícalo en tu sitio.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/typebot-integration/' | relative_url }}">Typebot en la cola</a></h3>
    <p>Pasa variables, renderiza menús y ejecuta comandos de Ticketz desde el flujo.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/integration-triggers/' | relative_url }}">Triggers y comandos</a></h3>
    <p>Consulta los payloads disponibles para respuestas automáticas.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/typebot-setup/' | relative_url }}">Instalación de Typebot</a></h3>
    <p>Levanta Builder, Viewer y Minio con la stack de integraciones.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/quickpix/' | relative_url }}">QuickPix</a></h3>
    <p>Entiende endpoints, reglas de negocio y la experiencia de la página de pago.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/server-cluster/' | relative_url }}">Server Cluster (not-released)</a></h3>
    <p>Configura roles master/slave, reglas de hostname y descubrimiento de login entre nodos.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/sidekick/' | relative_url }}">Ticketz Sidekick</a></h3>
    <p>Ejecuta backup y restore del entorno y migra datos desde sistemas derivados de Whaticket.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/whmcs/' | relative_url }}">WHMCS</a></h3>
    <p>Usa WHMCS para controlar la suscripción y el aprovisionamiento en Ticketz.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/es/examples/' | relative_url }}">Archivos de ejemplo</a></h3>
    <p>Descarga flujos JSON y archivos de entorno alojados en el propio sitio.</p>
  </section>
</div>

<div class="download-note">
  La raíz del sitio detecta el idioma del navegador y redirige automáticamente a portugués, inglés o español.
</div>

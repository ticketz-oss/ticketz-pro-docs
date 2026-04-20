---
title: Home
lang: en
slug: home
description: Ticketz PRO documentation in English.
---

Ticketz PRO documentation is now organized as a GitHub Pages site with dedicated sections for setup, integrations, billing, and downloadable examples.

<div class="hero-grid">
  <section class="hero-card">
    <h3>Integrations</h3>
    <p>Understand how Ticketz hands a queue to Typebot, webhook flows, and trigger commands.</p>
  </section>
  <section class="hero-card">
    <h3>Infrastructure</h3>
    <p>Configure Backblaze storage and install the Typebot stack with the right environment files.</p>
  </section>
  <section class="hero-card">
    <h3>Payments</h3>
    <p>Review QuickPix behavior and connect WHMCS as the subscription control layer.</p>
  </section>
</div>

## Start here

1. Read the [integrations overview]({{ '/en/overview/' | relative_url }}) if you are setting up a queue automation flow.
2. Open [Typebot queue integration]({{ '/en/typebot-integration/' | relative_url }}) and [triggers and commands]({{ '/en/integration-triggers/' | relative_url }}) if you are building chatbot flows.
3. Use [Typebot installation]({{ '/en/typebot-setup/' | relative_url }}) when you need the extra containers enabled.
4. Read [Ticketz Sidekick]({{ '/en/sidekick/' | relative_url }}) for backup, restore, and data migration operations.
5. Go to [example files]({{ '/en/examples/' | relative_url }}) for ready-to-download JSON and `.env` templates.
6. See [Server Cluster (not-released)]({{ '/en/server-cluster/' | relative_url }}) for multi-node login routing and cluster setup.

## Available guides

<div class="card-grid">
  <section class="info-card">
    <h3><a href="{{ '/en/backblaze/' | relative_url }}">Backblaze setup</a></h3>
    <p>Configure object storage for Ticketz file uploads.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/overview/' | relative_url }}">Integrations overview</a></h3>
    <p>Learn the lifecycle of an integration attached to a queue.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/webchat/' | relative_url }}">Webchat</a></h3>
    <p>Set up the floating widget, customize styles, and embed it on your site.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/typebot-integration/' | relative_url }}">Typebot integration</a></h3>
    <p>Pass variables, render menus, and issue Ticketz commands from a flow.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/integration-triggers/' | relative_url }}">Triggers and commands</a></h3>
    <p>Reference every payload available for automation responses.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/typebot-setup/' | relative_url }}">Typebot installation</a></h3>
    <p>Deploy Builder, Viewer, and Minio with the integration stack.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/quickpix/' | relative_url }}">QuickPix</a></h3>
    <p>Understand endpoints, business rules, and the payment page experience.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/server-cluster/' | relative_url }}">Server Cluster (not-released)</a></h3>
    <p>Configure master/slave roles, hostname rules, and cross-node login discovery.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/sidekick/' | relative_url }}">Ticketz Sidekick</a></h3>
    <p>Run backup and restore tasks and migrate data from Whaticket-derived systems.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/whmcs/' | relative_url }}">WHMCS</a></h3>
    <p>Use WHMCS to drive subscription provisioning in Ticketz.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/en/examples/' | relative_url }}">Example files</a></h3>
    <p>Download JSON flows and environment templates hosted directly on this site.</p>
  </section>
</div>

<div class="download-note">
  Browser language detection is enabled on the site root. Visitors landing on the home URL are redirected to English, Portuguese, or Spanish automatically.
</div>

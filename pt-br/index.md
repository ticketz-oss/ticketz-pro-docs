---
title: Início
lang: pt-br
slug: home
description: Documentação do Ticketz PRO em português.
---

A documentação do Ticketz PRO foi organizada em um site para GitHub Pages com seções dedicadas a setup, integrações, cobrança e arquivos de exemplo para download.

<div class="hero-grid">
  <section class="hero-card">
    <h3>Integrações</h3>
    <p>Entenda como o Ticketz entrega a fila ao Typebot, a webhooks e a fluxos em n8n.</p>
  </section>
  <section class="hero-card">
    <h3>Infraestrutura</h3>
    <p>Configure o Backblaze e instale a stack do Typebot com os arquivos de ambiente corretos.</p>
  </section>
  <section class="hero-card">
    <h3>Pagamentos</h3>
    <p>Veja o comportamento do QuickPix e integre o WHMCS como camada de assinatura.</p>
  </section>
</div>

## Comece por aqui

1. Leia a [visão geral de integrações]({{ '/pt-br/overview/' | relative_url }}) se você está montando automações em filas.
2. Abra [Typebot na fila]({{ '/pt-br/typebot-integration/' | relative_url }}) e [triggers e comandos]({{ '/pt-br/integration-triggers/' | relative_url }}) se você está construindo fluxos de chatbot.
3. Use [instalação do Typebot]({{ '/pt-br/typebot-setup/' | relative_url }}) quando precisar habilitar os containers extras.
4. Vá para [arquivos de exemplo]({{ '/pt-br/examples/' | relative_url }}) para baixar JSONs e templates `.env`.

## Guias disponíveis

<div class="card-grid">
  <section class="info-card">
    <h3><a href="{{ '/pt-br/backblaze/' | relative_url }}">Backblaze</a></h3>
    <p>Configure o armazenamento de arquivos do Ticketz.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/pt-br/overview/' | relative_url }}">Integrações</a></h3>
    <p>Entenda o ciclo de vida das integrações ligadas a uma fila.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/pt-br/typebot-integration/' | relative_url }}">Typebot na fila</a></h3>
    <p>Passe variáveis, renderize menus e execute comandos do Ticketz a partir do fluxo.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/pt-br/integration-triggers/' | relative_url }}">Triggers e comandos</a></h3>
    <p>Consulte os payloads disponíveis para respostas automáticas.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/pt-br/typebot-setup/' | relative_url }}">Instalação do Typebot</a></h3>
    <p>Suba Builder, Viewer e Minio com a stack de integrações.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/pt-br/quickpix/' | relative_url }}">QuickPix</a></h3>
    <p>Entenda endpoints, regras de negócio e a experiência da página de pagamento.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/pt-br/whmcs/' | relative_url }}">WHMCS</a></h3>
    <p>Use o WHMCS para controlar assinatura e provisionamento no Ticketz.</p>
  </section>
  <section class="info-card">
    <h3><a href="{{ '/pt-br/examples/' | relative_url }}">Arquivos de exemplo</a></h3>
    <p>Baixe fluxos JSON e arquivos de ambiente hospedados no próprio site.</p>
  </section>
</div>

<div class="download-note">
  A raiz do site detecta o idioma do navegador e redireciona automaticamente para português, inglês ou espanhol.
</div>

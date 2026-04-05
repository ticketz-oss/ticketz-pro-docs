---
title: Arquivos de Exemplo
lang: pt-br
slug: examples
description: Assets de exemplo para download na documentação do Ticketz PRO.
---

Esses arquivos são hospedados diretamente na GitHub Pages, então você não precisa depender de links em `raw.githubusercontent.com`.

## Arquivos para download

- [Ticketz PRO Smart Reception (n8n).json]({{ '/assets/examples/Ticketz%20PRO%20Smart%20Reception%20(n8n).json' | relative_url }}): Exemplo de fluxo n8n com webhook e recepção inteligente com IA
- [typebot-export-bolhas-de-triggers.json]({{ '/assets/examples/typebot-export-bolhas-de-triggers.json' | relative_url }}): Export do Typebot com bolhas de comandos e triggers
- [example.env-backend]({{ '/assets/examples/example.env-backend' | relative_url }}): Template do ambiente do backend
- [example.env-frontend]({{ '/assets/examples/example.env-frontend' | relative_url }}): Template do ambiente do frontend
- [example.env-integrations]({{ '/assets/examples/example.env-integrations' | relative_url }}): Template do ambiente de integrações e Typebot

## Observações de uso

- Use o fluxo do n8n como base, não como fluxo de produção pronto.
- Revise tokens, prompts, identificadores de fila e nós de credenciais antes de importar qualquer automação.
- Os hostnames e dados SMTP nos arquivos `.env` são placeholders e precisam ser substituídos.

<div class="download-note">
  Como esses arquivos fazem parte do próprio site de documentação, os downloads ficam estáveis e não dependem de rate limit do GitHub raw.
</div>

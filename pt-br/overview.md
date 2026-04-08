---
title: Visão Geral das Integrações
lang: pt-br
slug: overview
description: Como funcionam as integrações de fila no Ticketz PRO.
---

O Ticketz PRO possui uma engine agnóstica de integrações. As opções nativas iniciais são Typebot e Webhook ou fluxos baseados em n8n.

## Como uma integração atua na fila

Uma integração começa a operar no momento em que o contato envia a primeira mensagem para a fila. Ela continua ativa até que uma destas situações aconteça:

- Um atendente aceite a conversa e a mova para atendimento ativo.
- O driver da integração detecte que o fluxo chegou ao fim.
- O conteúdo da integração solicite encerrar a sessão, fechar o ticket ou transferir o ticket para outra fila.

Quando o ticket é transferido para uma nova fila, a integração da fila de destino é acionada imediatamente, independentemente de ela ser Typebot, Webhook, chatbot interno ou outro driver que venha a existir no futuro.

## Endpoint para listar filas

As integrações podem obter a lista de filas disponíveis através do endpoint abaixo:

```text
${BACKEND_URL}/integrations/listQueues
```

Esse endpoint é útil quando a automação precisa escolher dinamicamente a próxima fila.

## Leitura recomendada

- [Webchat]({{ '/pt-br/webchat/' | relative_url }})
- [Typebot na fila]({{ '/pt-br/typebot-integration/' | relative_url }})
- [Triggers e comandos]({{ '/pt-br/integration-triggers/' | relative_url }})
- [Ticketz Sidekick]({{ '/pt-br/sidekick/' | relative_url }})
- [Arquivos de exemplo]({{ '/pt-br/examples/' | relative_url }})

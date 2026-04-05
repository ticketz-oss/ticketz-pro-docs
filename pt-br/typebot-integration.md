---
title: Integração com Typebot
lang: pt-br
slug: typebot-integration
description: Configuração de filas do Ticketz PRO usando Typebot.
---

Quando uma fila é configurada com o driver Typebot, o Ticketz solicita a URL base da sua instalação do Typebot Viewer. Na prática, normalmente isso é apenas o protocolo e hostname do módulo Viewer, por exemplo `https://typebot-viewer.example.com`.

Também é solicitado o **Public Id** do fluxo que deve ser executado para essa fila.

## Configurações da fila

A integração com Typebot expõe estas opções principais:

- **Interpretar RichText**: converte os estilos de texto do Typebot para o formato suportado pelo canal atual.
- **Parâmetros adicionais**: aceita um objeto JSON raso com valores `string`, `number` ou `boolean` que ficam disponíveis como variáveis dentro do fluxo.

O Typebot não suporta arrays nem objetos aninhados nesse conjunto de parâmetros adicionais.

## Elementos suportados

- A bolha de **botões** é suportada e renderizada conforme os recursos do canal e as preferências do Ticketz.
- O bloco **Wait** é suportado, mas não é recomendado porque o contato pode enviar uma nova mensagem durante a espera.
- Bolhas de **imagem** e **áudio** funcionam normalmente.
- Para enviar **documentos**, use a bolha `embed`.

## Variáveis disponíveis no fluxo

Além dos seus parâmetros customizados, o Ticketz fornece variáveis padrão:

- `number`: endereço do contato. No WhatsApp normalmente segue o formato `55DDDNUMERO`.
- `pushName`: nome do contato armazenado no Ticketz.
- `firstMessage`: primeira mensagem enviada pelo contato.
- `ticketId`: número do ticket atual.
- `backendURL`: URL completa do backend.
- `token`: token bearer usado para emitir requisições HTTP que agem sobre o ticket e a sessão atuais.
- `metadata`: informações adicionais vindas do driver de conexão e do contexto da execução.

## Comandos especiais no Typebot

O Ticketz permite acionar funções como transferir para outra fila, atribuir a um usuário, encerrar a sessão ou fechar o atendimento. Esses comandos são enviados por uma bolha **Text** iniciando com `#` e seguida imediatamente por uma string JSON.

Exemplo: transferir a conversa atual para a fila `99`.

```text
#{ "queueId": 99 }
```

Você pode baixar um fluxo pronto com bolhas de comandos em [arquivos de exemplo]({{ '/pt-br/examples/' | relative_url }}).

Para a lista completa dos triggers, veja [Triggers e comandos]({{ '/pt-br/integration-triggers/' | relative_url }}).

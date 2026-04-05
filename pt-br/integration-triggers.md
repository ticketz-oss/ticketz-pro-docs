---
title: Triggers e Comandos
lang: pt-br
slug: integration-triggers
description: Referência completa dos comandos de integração do Ticketz PRO.
---

Os triggers são comandos estruturados que uma integração pode devolver ao Ticketz por mensagem ou resposta de webhook para executar ações no ticket atual.

## Formato da mensagem

As mensagens usam a seguinte estrutura:

```json
{
  "type": "text",
  "content": "texto da mensagem",
  "mediaUrl": "https://example.com/arquivo"
}
```

- `type` pode ser `text`, `image`, `video`, `audio`, `gif` ou `document`.
- `content` é usado para mensagens de texto.
- `mediaUrl` é usado para mídias não textuais.

## Formas de enviar comandos

### 1. Bolha de texto no Typebot

Integrações Typebot podem enviar um comando por vez em uma bolha de texto iniciando com `#` e seguida por um payload JSON.

```text
#{
  "queueId": 99
}
```

### 2. Retorno de webhook

Integrações webhook podem responder com:

- um comando isolado
- uma mensagem com trigger opcional
- um array de mensagens, cada uma com trigger opcional

Exemplo:

```json
[
  {
    "type": "text",
    "content": "Uma mensagem"
  },
  {
    "type": "text",
    "content": "Outra mensagem",
    "trigger": { "action": "wait", "seconds": 2 }
  },
  {
    "type": "text",
    "content": "Uma mensagem com trigger",
    "trigger": { "closeTicket": true }
  }
]
```

### 3. Requisição HTTP direta para o backend

Typebot, Webhook ou qualquer sistema externo pode chamar o backend diretamente se possuir o token de autorização.

- Endpoint: `${BACKEND_URL}/integrations/webhook`
- Método: `POST`
- Cabeçalho: `Authorization: Bearer ${token}`

O payload pode seguir qualquer formato aceito no retorno por webhook.

## Comandos disponíveis

### Enviar mensagem

`message` pode ser um único objeto de mensagem ou um array de objetos.

```json
{
  "message": {
    "type": "text",
    "content": "conteúdo da mensagem"
  }
}
```

### Enviar mensagem com menu de opções

```json
{
  "message": {
    "type": "text",
    "content": "Uma mensagem"
  },
  "action": "menu",
  "menuOptions": [{ "text": "Opção 1" }, { "text": "Opção 2" }]
}
```

### Enviar mensagem com botão de URL

No momento isso depende de canais que suportam esse formato, como o Notificamehub WhatsApp Oficial.

```json
{
  "message": {
    "type": "text",
    "content": "Clique no botão abaixo para conhecer mais"
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

### Transferir para outra fila

```json
{
  "queueId": 99
}
```

Se a nova fila não for atendida por chatbot, o Ticketz também remove esse atributo.

### Transferir para fila e usuário

```json
{
  "queueId": 99,
  "userId": 42
}
```

O ticket é aceito automaticamente e aparece na aba de atendimento do novo usuário.

### Encerrar a sessão da integração

```json
{
  "action": "endSession"
}
```

### Parar o chatbot

É equivalente a `endSession` e existe por compatibilidade com automações antigas.

```json
{
  "stopbot": true
}
```

### Encerrar o ticket atual

```json
{
  "closeTicket": true
}
```

### Adicionar anotação interna no ticket

```json
{
  "action": "note",
  "message": {
    "content": "Texto da anotação"
  }
}
```

### Atualizar várias propriedades do ticket

```json
{
  "action": "updateTicket",
  "ticketData": {
    "status": "pending",
    "userId": 42,
    "queueId": 99,
    "justClose": false,
    "annotation": "Escalonado por automação"
  }
}
```

Campos aceitos em `ticketData`:

- `status`: `pending`, `open` ou `closed`
- `userId`: transfere para outro usuário
- `queueId`: transfere para outra fila
- `justClose`: fecha sem outras regras de transição
- `annotation`: adiciona uma anotação ao transferir

### Aguardar alguns segundos

Só faz efeito dentro de um array de comandos.

```json
{
  "action": "wait",
  "seconds": 2
}
```

### Ping

Faz o Ticketz responder automaticamente com `pong`, o que ajuda a preservar a ordem de processamento no Typebot.

```json
{
  "action": "ping"
}
```

### Adicionar tag no ticket

Se `advanceOnly` for verdadeiro, uma tag de funil não substitui outra tag do mesmo funil que já esteja mais avançada.

```json
{
  "action": "addTag",
  "tagId": 99,
  "advanceOnly": true
}
```

### Remover tag do ticket

```json
{
  "action": "removeTag",
  "tagId": 99
}
```

### Limpar todas as tags do ticket

```json
{
  "action": "clearTags"
}
```

### Adicionar tag no contato

```json
{
  "action": "addContactTag",
  "tagId": 99,
  "advanceOnly": true
}
```

### Remover tag do contato

```json
{
  "action": "removeContactTag",
  "tagId": 99
}
```

### Limpar todas as tags do contato

```json
{
  "action": "clearContactTags"
}
```

Para exemplos prontos de payload, veja [Arquivos de exemplo]({{ '/pt-br/examples/' | relative_url }}).

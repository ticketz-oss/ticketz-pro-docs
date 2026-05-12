---
title: Variáveis de expansão
lang: pt-br
slug: expansion-variables
description: Referência de variáveis de expansão disponíveis no Ticketz para templates e automações.
---

As variáveis de expansão permitem montar mensagens dinâmicas em templates e automações.

## Variáveis disponíveis no Ticketz

- `name`: nome completo do contato
- `firstname`: primeiro nome do contato
- `email`: email do contato (se tiver no cadastro)
- `greeting`: saudação conforme a hora do dia (bom dia, boa tarde, etc)
- `queue`: nome da fila do ticket
- `protocol`: número do protocolo no formato `YYYYMMDD-TicketId`
- `user`: nome do usuário ativo no atendimento
- `time`: hora atual
- `ticket`: número do ticket

## Outras Informações do contato

Além das variáveis padrão, também é possível usar como variáveis os valores preenchidos em **Outras Informações** no cadastro do contato.

## Comportamento em templates

Em templates, qualquer variável que não for fornecida automaticamente será solicitada quando o usuário tentar enviar o template.

Se o envio for feito por automação, a chamada precisa fornecer todos os valores que o template requer para funcionar corretamente.

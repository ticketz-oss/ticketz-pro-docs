---
title: Instalação do Typebot
lang: pt-br
slug: typebot-setup
description: Adicione os containers do Typebot a uma instalação do Ticketz PRO.
---

O arquivo `.env-integrations` define os valores necessários para instalar a stack do Typebot. Ele precisa existir antes da execução do comando de instalação dos containers.

## Hostnames obrigatórios

Todos os hostnames abaixo devem apontar para o mesmo servidor onde a instalação está sendo executada:

- `TYPEBOT_BUILDER_HOST`: hostname do módulo Builder, onde os fluxos são construídos.
- `TYPEBOT_VIEWER_HOST`: hostname do módulo Viewer usado na configuração das filas do Ticketz.
- `MINIO_HOST`: hostname da API S3 do Minio usada pelo armazenamento de arquivos do Typebot.

## Configuração SMTP

O Typebot também precisa dos dados SMTP no `.env-integrations`. Isso é importante porque as autorizações de acesso são validadas por códigos enviados por email.

Você pode baixar o arquivo base aqui:

- [example.env-integrations]({{ '/assets/examples/example.env-integrations' | relative_url }})

Conteúdo de exemplo:

```text
TYPEBOT_BUILDER_HOST=typebot.example.com
TYPEBOT_VIEWER_HOST=typebot-viewer.example.com
MINIO_HOST=minio.example.com

SMTP_FROM=email@example.com
SMTP_USERNAME=email@example.com
SMTP_PASSWORD=GoodPass
SMTP_HOST=mail.example.com
SMTP_PORT=587
SMTP_SECURE=true
```

## Arquivo de segredos

O arquivo `.env-secrets` é gerado automaticamente durante a instalação e não deve ser alterado manualmente. Qualquer mudança nele pode quebrar o acesso a arquivos criptografados e credenciais geradas.

## Passos de instalação

1. Entre na pasta `ticketz-docker-acme`.
2. Crie `.env-integrations` a partir do arquivo de exemplo.
3. Ajuste os valores do seu ambiente.
4. Execute o instalador.

```bash
cd ~/ticketz-docker-acme
sudo cp example.env-integrations .env-integrations
sudo vi .env-integrations
curl -sSL in.ticke.tz | sudo bash
```

Após alguns minutos, todos os serviços devem estar disponíveis. As credenciais geradas são exibidas na tela e devem ser guardadas com segurança.

## Serviços instalados

### Typebot Builder

Fica acessível no hostname definido por `TYPEBOT_BUILDER_HOST`.

### Typebot Viewer

É usado indiretamente pelo Ticketz através do hostname definido em `TYPEBOT_VIEWER_HOST`.

### Minio Console

A console do Minio fica disponível usando o mesmo hostname do frontend do Ticketz com o caminho `/minio`.

O login usa os valores gerados de `MINIO_ROOT_CLIENT_ID` e `MINIO_ROOT_CLIENT_PASSWORD` exibidos ao final da instalação.

## Continue com

- [Visão geral das integrações]({{ '/pt-br/overview/' | relative_url }})
- [Integração com Typebot]({{ '/pt-br/typebot-integration/' | relative_url }})

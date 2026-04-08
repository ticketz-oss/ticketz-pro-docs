---
title: Ticketz Sidekick
lang: pt-br
slug: sidekick
description: Backup, restore e migração de dados com o Ticketz Sidekick.
---

O Ticketz Sidekick é um componente acessório para tarefas administrativas do Ticketz. Ele funciona tanto em instalações Open Source quanto PRO.

## Comandos disponíveis

- `backup`: gera backup do banco de dados e das mídias (`public` e `private`)
- `restore`: restaura o último backup disponível
- `retrieve`: extrai dados de sistemas derivados do Whaticket SaaS para migração

## Instalação

O Sidekick está disponível para instalações que foram feitas com o autoinstalador e que estão atualizadas.

## Backup

Execute os comandos dentro da pasta da instalação (por exemplo `ticketz-docker-acme`):

```bash
cd ~/ticketz-docker-acme
sudo docker compose run --rm sidekick backup
```

O processo gera um arquivo `.tar.gz` na pasta `backups` contendo:

- dump do banco (`db_dump.sql`)
- conteúdo das pastas de mídia do backend

### Backup apenas do banco

Se você quiser somente o dump do banco, use o parâmetro `--dbonly`:

```bash
sudo docker compose run --rm sidekick backup --dbonly
```

### Retenção de backups

A variável `RETENTION_FILES` controla quantos arquivos de backup são mantidos. O padrão é `7`.

Exemplo no `.env-backend`:

```text
RETENTION_FILES=14
```

## Restore

O Sidekick restaura o backup mais recente da pasta `backups`.

### Restore com auto instalador

Com DNS e portas prontos, deixe o arquivo de backup na pasta corrente e rode:

```bash
curl -sSL get.ticke.tz | sudo bash -s hostname.example.com email@example.com
```

### Restore manual

Para projetos como `ticketz-docker-local` e `ticketz-docker-cloudflare`:

1. Prepare o ambiente como uma instalação nova e configure `.env-backend` e `.env-frontend`.
2. Crie a pasta `backups` no projeto e coloque nela o arquivo `.tar.gz` do backup.
3. Execute a restauração:

```bash
sudo docker compose run --rm -T sidekick restore
```

4. Suba os containers:

```bash
sudo docker compose up -d
```

## Agendamento (cron)

Você pode agendar backup diário usando `cron`:

```bash
cat > /etc/cron.daily/backup-ticketz.sh <<EOF
#!/bin/bash

cd /home/ubuntu/ticketz-docker-acme
docker compose run --rm sidekick backup
EOF

chmod +x /etc/cron.daily/backup-ticketz.sh
```

## Migração de dados com `retrieve`

Para importar dados de outro sistema derivado do Whaticket SaaS:

1. No servidor de origem, baixe a ferramenta:

```bash
git clone https://github.com/ticketz-oss/ticketz-sidekick
cd ticketz-sidekick
```

2. Extraia os dados do banco de origem:

```bash
./sidekick.sh retrieve dbHost dbName dbUser dbPass retrieve
```

Esse comando gera `retrieved_data.tar.gz` na pasta indicada (por padrão, `retrieve`).

3. Gere também um pacote das mídias da pasta `public` do backend de origem:

```bash
cd /caminho/do/backend/public
tar -zcf ../public_data.tar.gz .
```

4. Copie `retrieved_data.tar.gz` e `public_data.tar.gz` para o novo servidor e execute a instalação rápida:

```bash
curl -sSL get.ticke.tz | sudo bash -s hostname.example.com email@example.com
```

## Observações importantes

- A instalação do Sidekick não agenda backups automaticamente; isso deve ser configurado pelo administrador.
- Antes de restaurar, valide DNS e portas (`80` e `443`) conforme o método de instalação.
- Em restores manuais, garanta que o banco e os diretórios de mídia estejam prontos para receber os dados.

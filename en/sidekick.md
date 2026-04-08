---
title: Ticketz Sidekick
lang: en
slug: sidekick
description: Backup, restore, and data migration using Ticketz Sidekick.
---

Ticketz Sidekick is an auxiliary component for Ticketz administrative tasks. It works with both Open Source and PRO installations.

## Available commands

- `backup`: creates a backup of database and media files (`public` and `private`)
- `restore`: restores the latest backup available
- `retrieve`: extracts data from Whaticket SaaS-derived systems for migration

## Installation

Sidekick is available for installations that were created with the auto installer and are up to date.

## Backup

Run the commands from your installation folder (for example `ticketz-docker-acme`):

```bash
cd ~/ticketz-docker-acme
sudo docker compose run --rm sidekick backup
```

The process creates a `.tar.gz` file in the `backups` folder containing:

- database dump (`db_dump.sql`)
- backend media directories

### Database-only backup

To back up only the database dump, use `--dbonly`:

```bash
sudo docker compose run --rm sidekick backup --dbonly
```

### Backup retention

The `RETENTION_FILES` variable defines how many backup files are kept. The default value is `7`.

Example in `.env-backend`:

```text
RETENTION_FILES=14
```

## Restore

Sidekick restores the most recent backup from the `backups` directory.

### Restore with quick installer

With DNS and ports configured, place the backup file in the current folder and run:

```bash
curl -sSL get.ticke.tz | sudo bash -s hostname.example.com email@example.com
```

### Manual restore

For projects such as `ticketz-docker-local` and `ticketz-docker-cloudflare`:

1. Prepare the environment like a fresh installation and configure `.env-backend` and `.env-frontend`.
2. Create a `backups` folder in the project and place the backup `.tar.gz` file inside.
3. Run restore:

```bash
sudo docker compose run --rm -T sidekick restore
```

4. Start containers:

```bash
sudo docker compose up -d
```

## Scheduling with cron

You can schedule daily backups with `cron`:

```bash
cat > /etc/cron.daily/backup-ticketz.sh <<EOF
#!/bin/bash

cd /home/ubuntu/ticketz-docker-acme
docker compose run --rm sidekick backup
EOF

chmod +x /etc/cron.daily/backup-ticketz.sh
```

## Data migration with `retrieve`

To migrate data from another Whaticket SaaS-derived system:

1. On the source server, download the tool:

```bash
git clone https://github.com/ticketz-oss/ticketz-sidekick
cd ticketz-sidekick
```

2. Extract source database data:

```bash
./sidekick.sh retrieve dbHost dbName dbUser dbPass retrieve
```

This command creates `retrieved_data.tar.gz` in the target folder (default: `retrieve`).

3. Also package the source backend `public` media folder:

```bash
cd /path/to/backend/public
tar -zcf ../public_data.tar.gz .
```

4. Copy `retrieved_data.tar.gz` and `public_data.tar.gz` to the new server and run quick installation:

```bash
curl -sSL get.ticke.tz | sudo bash -s hostname.example.com email@example.com
```

## Important notes

- Installing Sidekick does not schedule backups automatically; administrators must configure this.
- Before restore, confirm DNS and open ports (`80` and `443`) according to your installation method.
- For manual restore, ensure database and media directories are ready to receive data.

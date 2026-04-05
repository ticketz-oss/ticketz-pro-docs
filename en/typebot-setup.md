---
title: Typebot Installation
lang: en
slug: typebot-setup
description: Add the Typebot containers to a Ticketz PRO installation.
---

The `.env-integrations` file defines the values required to install the Typebot stack. It must exist before the container installation command is executed.

## Required hostnames

All hostnames below must point to the same server where the installation is running:

- `TYPEBOT_BUILDER_HOST`: hostname for the Builder module, where you create flows.
- `TYPEBOT_VIEWER_HOST`: hostname for the Viewer module used by Ticketz queue settings.
- `MINIO_HOST`: hostname for the Minio S3 API used by Typebot file storage.

## SMTP configuration

Typebot also needs SMTP settings in `.env-integrations`. This is important because access authorization is validated through codes sent by email.

You can download the ready-to-edit file here:

- [example.env-integrations]({{ '/assets/examples/example.env-integrations' | relative_url }})

Sample content:

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

## Secrets file

The `.env-secrets` file is generated automatically during installation and should not be edited manually. Changing it can break access to encrypted files and generated credentials.

## Installation steps

1. Move into the `ticketz-docker-acme` directory.
2. Create `.env-integrations` from the example file.
3. Edit the values according to your environment.
4. Run the installation command.

```bash
cd ~/ticketz-docker-acme
sudo cp example.env-integrations .env-integrations
sudo vi .env-integrations
curl -sSL in.ticke.tz | sudo bash
```

After a few minutes, all services should be available. The generated credentials are printed on screen and should be stored securely.

## Installed services

### Typebot Builder

Available on the hostname defined by `TYPEBOT_BUILDER_HOST`.

### Typebot Viewer

Used indirectly by Ticketz through the hostname defined by `TYPEBOT_VIEWER_HOST`.

### Minio Console

The Minio console is available using the same hostname as the Ticketz frontend plus the `/minio` path.

Login uses the generated values of `MINIO_ROOT_CLIENT_ID` and `MINIO_ROOT_CLIENT_PASSWORD` shown after the installation ends.

## Continue with

- [Integrations overview]({{ '/en/overview/' | relative_url }})
- [Typebot queue integration]({{ '/en/typebot-integration/' | relative_url }})

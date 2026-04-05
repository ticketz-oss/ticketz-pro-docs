---
title: Instalación de Typebot
lang: es
slug: typebot-setup
description: Añade los contenedores de Typebot a una instalación de Ticketz PRO.
---

El archivo `.env-integrations` define los valores necesarios para instalar la stack de Typebot. Debe existir antes de ejecutar el comando de instalación de contenedores.

## Hostnames obligatorios

Todos los hostnames siguientes deben apuntar al mismo servidor donde se ejecuta la instalación:

- `TYPEBOT_BUILDER_HOST`: hostname del módulo Builder, donde se construyen los flujos.
- `TYPEBOT_VIEWER_HOST`: hostname del módulo Viewer usado en la configuración de colas de Ticketz.
- `MINIO_HOST`: hostname de la API S3 de Minio usada por el almacenamiento de archivos de Typebot.

## Configuración SMTP

Typebot también necesita los datos SMTP en `.env-integrations`. Esto es importante porque las autorizaciones de acceso se validan mediante códigos enviados por correo electrónico.

Puedes descargar el archivo base aquí:

- [example.env-integrations]({{ '/assets/examples/example.env-integrations' | relative_url }})

Contenido de ejemplo:

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

## Archivo de secretos

El archivo `.env-secrets` se genera automáticamente durante la instalación y no debe editarse manualmente. Cambiarlo puede romper el acceso a archivos cifrados y credenciales generadas.

## Pasos de instalación

1. Entra en la carpeta `ticketz-docker-acme`.
2. Crea `.env-integrations` a partir del archivo de ejemplo.
3. Ajusta los valores de tu entorno.
4. Ejecuta el instalador.

```bash
cd ~/ticketz-docker-acme
sudo cp example.env-integrations .env-integrations
sudo vi .env-integrations
curl -sSL in.ticke.tz | sudo bash
```

Después de algunos minutos, todos los servicios deberían estar disponibles. Las credenciales generadas se muestran en pantalla y deben guardarse de forma segura.

## Servicios instalados

### Typebot Builder

Queda disponible en el hostname definido por `TYPEBOT_BUILDER_HOST`.

### Typebot Viewer

Se usa indirectamente por Ticketz mediante el hostname definido en `TYPEBOT_VIEWER_HOST`.

### Consola de Minio

La consola de Minio queda disponible usando el mismo hostname del frontend de Ticketz con la ruta `/minio`.

El acceso usa los valores generados `MINIO_ROOT_CLIENT_ID` y `MINIO_ROOT_CLIENT_PASSWORD` mostrados al final de la instalación.

## Continúa con

- [Vista general de integraciones]({{ '/es/overview/' | relative_url }})
- [Integración con Typebot]({{ '/es/typebot-integration/' | relative_url }})

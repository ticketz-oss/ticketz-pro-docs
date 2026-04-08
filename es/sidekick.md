---
title: Ticketz Sidekick
lang: es
slug: sidekick
description: Backup, restore y migración de datos con Ticketz Sidekick.
---

Ticketz Sidekick es un componente auxiliar para tareas administrativas de Ticketz. Funciona tanto en instalaciones Open Source como PRO.

## Comandos disponibles

- `backup`: genera backup de la base de datos y de los archivos de medios (`public` y `private`)
- `restore`: restaura el backup más reciente disponible
- `retrieve`: extrae datos de sistemas derivados de Whaticket SaaS para migración

## Instalación

Sidekick está disponible para instalaciones que fueron realizadas con el autoinstalador y están actualizadas.

## Backup

Ejecuta los comandos desde la carpeta de instalación (por ejemplo `ticketz-docker-acme`):

```bash
cd ~/ticketz-docker-acme
sudo docker compose run --rm sidekick backup
```

El proceso genera un archivo `.tar.gz` en la carpeta `backups` que incluye:

- dump de la base de datos (`db_dump.sql`)
- directorios de medios del backend

### Backup solo de base de datos

Si quieres respaldar solo el dump de la base de datos, usa `--dbonly`:

```bash
sudo docker compose run --rm sidekick backup --dbonly
```

### Retención de backups

La variable `RETENTION_FILES` define cuántos archivos de backup se conservan. El valor por defecto es `7`.

Ejemplo en `.env-backend`:

```text
RETENTION_FILES=14
```

## Restore

Sidekick restaura el backup más reciente de la carpeta `backups`.

### Restore con instalador rápido

Con DNS y puertos configurados, deja el archivo de backup en la carpeta actual y ejecuta:

```bash
curl -sSL get.ticke.tz | sudo bash -s hostname.example.com email@example.com
```

### Restore manual

Para proyectos como `ticketz-docker-local` y `ticketz-docker-cloudflare`:

1. Prepara el entorno como una instalación nueva y configura `.env-backend` y `.env-frontend`.
2. Crea una carpeta `backups` en el proyecto y coloca dentro el archivo `.tar.gz`.
3. Ejecuta la restauración:

```bash
sudo docker compose run --rm -T sidekick restore
```

4. Levanta los contenedores:

```bash
sudo docker compose up -d
```

## Programación con cron

Puedes programar backup diario con `cron`:

```bash
cat > /etc/cron.daily/backup-ticketz.sh <<EOF
#!/bin/bash

cd /home/ubuntu/ticketz-docker-acme
docker compose run --rm sidekick backup
EOF

chmod +x /etc/cron.daily/backup-ticketz.sh
```

## Migración de datos con `retrieve`

Para migrar datos de otro sistema derivado de Whaticket SaaS:

1. En el servidor de origen, descarga la herramienta:

```bash
git clone https://github.com/ticketz-oss/ticketz-sidekick
cd ticketz-sidekick
```

2. Extrae los datos de la base origen:

```bash
./sidekick.sh retrieve dbHost dbName dbUser dbPass retrieve
```

Este comando genera `retrieved_data.tar.gz` en la carpeta indicada (por defecto, `retrieve`).

3. Empaqueta también la carpeta de medios `public` del backend origen:

```bash
cd /ruta/del/backend/public
tar -zcf ../public_data.tar.gz .
```

4. Copia `retrieved_data.tar.gz` y `public_data.tar.gz` al nuevo servidor y ejecuta la instalación rápida:

```bash
curl -sSL get.ticke.tz | sudo bash -s hostname.example.com email@example.com
```

## Notas importantes

- Instalar Sidekick no programa backups automáticamente; eso debe configurarlo el administrador.
- Antes de restaurar, valida DNS y puertos abiertos (`80` y `443`) según el método de instalación.
- En restores manuales, confirma que la base y los directorios de medios están listos para recibir datos.

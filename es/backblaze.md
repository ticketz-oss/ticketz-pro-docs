---
title: Configuración de Backblaze
lang: es
slug: backblaze
description: Configura el almacenamiento Backblaze en Ticketz PRO.
---

Esta guía te ayuda a configurar Backblaze en Ticketz en pocos minutos.

## Pasos en Backblaze

1. Crea una cuenta en `https://www.backblaze.com`.
2. Crea un bucket y cambia la visibilidad a pública. En este paso Backblaze puede pedir la tarjeta.
3. Cambia la configuración CORS del bucket para aceptar la URL de tu instalación de Ticketz.
4. Abre **Billing** en la esquina superior derecha y añade la tarjeta otra vez si hace falta.
5. Ve a **Application Keys** y crea una nueva clave con permisos de lectura y escritura para el bucket.
6. Guarda el **Key ID** y la **Application Key**.

## Campos en Ticketz

En la configuración de Ticketz, completa los campos de almacenamiento así:

- **Access Key**: el `Key ID`
- **Secret Key**: la `Application Key`
- **Region**: la región del bucket, normalmente visible en el endpoint, por ejemplo `sa-east-005`
- **Bucket**: el nombre del bucket
- **Endpoint**: la URL completa del endpoint comenzando con `https`

Cuando los datos sean correctos, Ticketz empezará a guardar archivos en Backblaze.

---
title: NFS-e Personalizada (Driver Externo)
lang: es
slug: external-nfse-driver
description: Integra cualquier proveedor de NFS-e a Ticketz PRO con el driver externo de NFS-e vía puente RPC.
---

El `ExternalNfseDriver` permite integrar cualquier proveedor de NFS-e que no puede soportarse directamente en el backend (p. ej. un sistema municipal sin SDK Node) a través de un único endpoint HTTP estilo RPC.

> **Referencia canónica:** un contrato formal OpenAPI 3.0 está disponible en
> [External-NFSE-Driver-OpenAPI.yaml]({{ '/assets/examples/External-NFSE-Driver-OpenAPI.yaml' | relative_url }}).
> Úsalo para validar tu implementación con herramientas OpenAPI o para generar stubs de servidor.

## Cómo funciona

Cada operación de NFS-e se delega al endpoint externo configurado vía un `POST` a la raíz del endpoint (`/`). El cuerpo de la petición lleva un campo `operation` que enruta la llamada:

| `operation`         | Disparado por                                  | Propósito                                                                     |
| ------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| `getDriverDetails` | Botón "Sincronizar opciones" de la página de configuración | Devuelve campos dinámicos de configuración + operaciones soportadas. Cacheado en el backend. |
| `emit`              | `POST /invoices/:id/nfse` (manual o automático) | Emitir una NFS-e para una factura pagada.                                    |
| `fetchStatus`       | Actualización de estado                        | Consultar el estado de una NFS-e ya emitida.                                  |
| `getPdf`            | `GET /invoices/:id/nfse/pdf`                   | Devolver el PDF de la NFS-e (base64).                                        |
| `getXml`            | `GET /invoices/:id/nfse/xml`                   | Devolver el XML de la NFS-e.                                                  |
| `cancel`            | Flujo de cancelación                           | Cancelar una NFS-e ya emitida.                                               |

## Configuración (super configuraciones, prefijo `_externalNfse`)

| Campo                       | Descripción                                            |
| --------------------------- | ------------------------------------------------------ |
| `_externalNfseEndpointUrl`  | URL base del endpoint RPC externo.                     |
| `_externalNfseAuthToken`   | Token Bearer enviado en la cabecera `Authorization`.   |
| Campos dinámicos            | Devueltos por la operación `getDriverDetails` y cacheados. |

## Payload de petición

```json
{
  "operation": "emit",
  "driver": "external",
  "invoiceId": 42,
  "company": { "id": 1, "name": "Acme", "fiscalData": { "document": "..." } },
  "invoice": { "id": 42, "status": "paid", "value": 99.9, "dueDate": "2026-06-01" },
  "nfseData": {},
  "currentSettings": { "_externalNfseEndpointUrl": "..." },
  "idempotencyKey": "uuid-v4"
}
```

## Payload de respuesta

```json
{
  "success": true,
  "status": "authorized",
  "nfseData": { "driver": "external", "nfseId": "...", "nfseUrl": "..." },
  "nfseUrl": "https://..."
}
```

`status` también puede ser `pending` (cuando el proveedor procesará la nota de forma asíncrona) o `error` (cuando la petición falló, pero la operación en sí fue comprendida). En el caso `error`, el backend almacena `nfseData.nfseStatus = "ERROR"` y `nfseData.nfseErrorMessage` y notifica al frontend vía evento websocket `NFSE_ERRO`.

Para `getPdf`:

```json
{
  "success": true,
  "pdfBase64": "JVBERi0xLjQ..."
}
```

Para `getXml`:

```json
{
  "success": true,
  "xml": "<?xml version=\"1.0\"?>..."
}
```

Para `getDriverDetails`:

```json
{
  "success": true,
  "fields": [
    { "name": "municipalCode", "title": "Código municipal", "type": "text" }
  ],
  "operations": ["emit", "fetchStatus", "getPdf", "getXml"]
}
```

> El array `fields` sigue el mismo schema usado por el componente `DynamicForm` del frontend. Consulta [Campos de formulario dinámico]({{ '/es/dynamic-form-fields/' | relative_url }}) para la referencia completa de propiedades y ejemplos listos para copiar.

En caso de fallo:

```json
{
  "success": false,
  "errorCode": "ERR_PROVIDER_REJECTED",
  "errorMessage": "Rejeição fiscal..."
}
```

## Política de retry

El driver reintenta en errores transitorios (`ECONNRESET`, `ECONNREFUSED`, `ETIMEDOUT`, `ENOTFOUND`, `EAI_AGAIN`, HTTP 5xx y 429) con retrasos de 1s, 3s, 5s. Los errores permanentes (4xx excepto 429) fallan inmediatamente.

## Especificación OpenAPI

Consulta [External-NFSE-Driver-OpenAPI.yaml]({{ '/assets/examples/External-NFSE-Driver-OpenAPI.yaml' | relative_url }}) para el contrato completo legible por máquina.
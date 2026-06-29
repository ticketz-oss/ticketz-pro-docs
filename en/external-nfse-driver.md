---
title: Custom NFS-e (External Driver)
lang: en
slug: external-nfse-driver
description: Integrate any NFS-e provider into Ticketz PRO with the External NFS-e driver RPC bridge.
---

The `ExternalNfseDriver` allows integrating any NFS-e provider that cannot be supported directly in the backend (e.g. a municipal system without a Node SDK) through a single RPC-style HTTP endpoint.

> **Canonical reference:** a formal OpenAPI 3.0 contract is available at
> [External-NFSE-Driver-OpenAPI.yaml]({{ '/assets/examples/External-NFSE-Driver-OpenAPI.yaml' | relative_url }}).
> Use it to validate your implementation with OpenAPI tools or to generate server stubs.

## How it works

Every NFS-e operation is delegated to the configured external endpoint via a `POST` to the endpoint root (`/`). The request body carries an `operation` field that routes the call:

| `operation`         | Triggered by                                  | Purpose                                                       |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| `getDriverDetails` | Settings page "Synchronize options" button    | Returns dynamic config fields + supported operations. Cached on the backend. |
| `emit`              | `POST /invoices/:id/nfse` (manual or auto)    | Issue an NFS-e for a paid invoice.                            |
| `fetchStatus`       | Status refresh                                | Query the status of an already issued NFS-e.                  |
| `getPdf`            | `GET /invoices/:id/nfse/pdf`                  | Return the NFS-e PDF (base64).                               |
| `getXml`            | `GET /invoices/:id/nfse/xml`                  | Return the NFS-e XML.                                         |
| `cancel`            | Cancellation flow                              | Cancel an already issued NFS-e.                               |

## Configuration (super settings, prefix `_externalNfse`)

| Field                       | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `_externalNfseEndpointUrl`  | Base URL of the external RPC endpoint.                 |
| `_externalNfseAuthToken`   | Bearer token sent in the `Authorization` header.      |
| Dynamic fields              | Returned by the `getDriverDetails` operation and cached. |

## Request payload

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

## Response payload

```json
{
  "success": true,
  "status": "authorized",
  "nfseData": { "driver": "external", "nfseId": "...", "nfseUrl": "..." },
  "nfseUrl": "https://..."
}
```

`status` may also be `pending` (when the provider will process the note asynchronously) or `error` (when the request failed but the operation itself was understood). In the `error` case the backend stores `nfseData.nfseStatus = "ERROR"` and `nfseData.nfseErrorMessage` and notifies the frontend via the `NFSE_ERRO` websocket event.

For `getPdf`:

```json
{
  "success": true,
  "pdfBase64": "JVBERi0xLjQ..."
}
```

For `getXml`:

```json
{
  "success": true,
  "xml": "<?xml version=\"1.0\"?>..."
}
```

For `getDriverDetails`:

```json
{
  "success": true,
  "fields": [
    { "name": "municipalCode", "title": "Código municipal", "type": "text" }
  ],
  "operations": ["emit", "fetchStatus", "getPdf", "getXml"]
}
```

> The `fields` array follows the same schema used by the frontend `DynamicForm` component. See [Dynamic form fields]({{ '/en/dynamic-form-fields/' | relative_url }}) for the full property reference and copy-paste examples.

On failure:

```json
{
  "success": false,
  "errorCode": "ERR_PROVIDER_REJECTED",
  "errorMessage": "Rejeição fiscal..."
}
```

## Retry policy

The driver retries on transient errors (`ECONNRESET`, `ECONNREFUSED`, `ETIMEDOUT`, `ENOTFOUND`, `EAI_AGAIN`, HTTP 5xx and 429) with delays of 1s, 3s, 5s. Permanent errors (4xx other than 429) fail immediately.

## OpenAPI spec

See [External-NFSE-Driver-OpenAPI.yaml]({{ '/assets/examples/External-NFSE-Driver-OpenAPI.yaml' | relative_url }}) for the full machine-readable contract.
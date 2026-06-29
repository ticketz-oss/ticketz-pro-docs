---
title: NFS-e Personalizada (Driver Externo)
lang: pt-br
slug: external-nfse-driver
description: Integre qualquer provedor de NFS-e ao Ticketz PRO com o driver externo de NFS-e via ponte RPC.
---

O `ExternalNfseDriver` permite integrar qualquer provedor de NFS-e que não pode ser suportado diretamente no backend (ex.: um sistema municipal sem SDK Node) através de um único endpoint HTTP estilo RPC.

> **Referência canônica:** um contrato formal OpenAPI 3.0 está disponível em
> [External-NFSE-Driver-OpenAPI.yaml]({{ '/assets/examples/External-NFSE-Driver-OpenAPI.yaml' | relative_url }}).
> Use-o para validar sua implementação com ferramentas OpenAPI ou para gerar stubs de servidor.

## Como funciona

Toda operação de NFS-e é delegada ao endpoint externo configurado via um `POST` na raiz do endpoint (`/`). O corpo da requisição carrega um campo `operation` que faz o roteamento da chamada:

| `operation`         | Disparado por                                  | Finalidade                                                                    |
| ------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| `getDriverDetails` | Botão "Sincronizar opções" da página de configurações | Retorna campos dinâmicos de configuração + operações suportadas. Cacheado no backend. |
| `emit`              | `POST /invoices/:id/nfse` (manual ou automático) | Emitir uma NFS-e para uma fatura paga.                                        |
| `fetchStatus`       | Atualização de status                          | Consultar o status de uma NFS-e já emitida.                                   |
| `getPdf`            | `GET /invoices/:id/nfse/pdf`                   | Retornar o PDF da NFS-e (base64).                                            |
| `getXml`            | `GET /invoices/:id/nfse/xml`                   | Retornar o XML da NFS-e.                                                      |
| `cancel`            | Fluxo de cancelamento                          | Cancelar uma NFS-e já emitida.                                               |

## Configuração (super configurações, prefixo `_externalNfse`)

| Campo                       | Descrição                                            |
| --------------------------- | ---------------------------------------------------- |
| `_externalNfseEndpointUrl`  | URL base do endpoint RPC externo.                    |
| `_externalNfseAuthToken`   | Token Bearer enviado no cabeçalho `Authorization`.   |
| Campos dinâmicos            | Retornados pela operação `getDriverDetails` e cacheados. |

## Payload de requisição

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

## Payload de resposta

```json
{
  "success": true,
  "status": "authorized",
  "nfseData": { "driver": "external", "nfseId": "...", "nfseUrl": "..." },
  "nfseUrl": "https://..."
}
```

`status` também pode ser `pending` (quando o provedor processará a nota de forma assíncrona) ou `error` (quando a requisição falhou, mas a operação em si foi compreendida). No caso `error`, o backend armazena `nfseData.nfseStatus = "ERROR"` e `nfseData.nfseErrorMessage` e notifica o frontend via evento websocket `NFSE_ERRO`.

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

> O array `fields` segue o mesmo schema usado pelo componente `DynamicForm` do frontend. Veja [Campos de formulário dinâmico]({{ '/pt-br/dynamic-form-fields/' | relative_url }}) para a referência completa das propriedades e exemplos prontos para copiar.

Em caso de falha:

```json
{
  "success": false,
  "errorCode": "ERR_PROVIDER_REJECTED",
  "errorMessage": "Rejeição fiscal..."
}
```

## Política de retry

O driver faz retry em erros transitórios (`ECONNRESET`, `ECONNREFUSED`, `ETIMEDOUT`, `ENOTFOUND`, `EAI_AGAIN`, HTTP 5xx e 429) com atrasos de 1s, 3s, 5s. Erros permanentes (4xx exceto 429) falham imediatamente.

## Especificação OpenAPI

Veja [External-NFSE-Driver-OpenAPI.yaml]({{ '/assets/examples/External-NFSE-Driver-OpenAPI.yaml' | relative_url }}) para o contrato completo legível por máquina.
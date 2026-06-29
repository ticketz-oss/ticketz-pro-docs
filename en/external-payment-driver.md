---
title: Custom Payment Gateway (External Driver)
lang: en
slug: external-payment-driver
description: Integrate any billing provider into Ticketz PRO with the Generic External payment driver RPC contract.
---

Ticketz PRO includes a **Generic External** payment-gateway driver that lets you integrate any billing provider without modifying the backend source code. Instead of writing a new driver in TypeScript, you implement a single HTTP endpoint that receives RPC calls from Ticketz and returns the required data.

> **Canonical reference:** a formal OpenAPI 3.0 contract is available at
> [External-Payment-Driver-OpenAPI.yaml]({{ '/assets/examples/External-Payment-Driver-OpenAPI.yaml' | relative_url }}).
> Use it to validate your implementation with OpenAPI tools or to generate server stubs.

## 1. How It Works

The `ExternalPaymentDriver` stores/reads invoice data in the Ticketz database and forwards every business operation to your endpoint:

- **Create payment** — Ticketz asks your endpoint to generate a PIX code, boleto, credit-card charge or external checkout link.
- **Create subscription** — Ticketz asks your endpoint to create a recurring subscription and return a `subscriptionId`.
- **Sync subscription payment** — Ticketz asks your endpoint for the next pending payment of a subscription (e.g. next PIX QR code, boleto barcode or hosted invoice URL) so the invoice can be updated before the due date.
- **Get subscription status** — Ticketz asks your endpoint for the current status of a subscription during the daily reconciliation job.
- **Webhook** — Ticketz forwards the provider webhook payload to your endpoint so you can validate it and tell Ticketz whether the invoice was paid or expired.
- **Check status** — Ticketz asks your endpoint for the current status of an open invoice.
- **Report driver details** — Ticketz asks your endpoint for dynamic fields, supported modes and supported operations in a single `getDriverDetails` call. The result is cached and reused until a forced refresh.

Your endpoint is responsible for all provider-specific logic: authentication, API calls, signature validation, idempotency, etc.

The external driver also supports the following advanced features:

- **Dynamic configuration fields** — your endpoint can declare additional settings fields that appear in the Ticketz UI. They are returned inside `getDriverDetails`.
- **Private certificate files** — uploaded certificates are stored securely in `backend/private` and sent to your endpoint base64-encoded on every RPC call.
- **Mode disabling** — individual modes can be disabled via driver parameters (`_externalDisablePix`, `_externalDisableBoleto`, `_externalDisableCc`, `_externalDisableLink`). When `getDriverDetails` reports supported modes, the final list is the intersection of the endpoint modes and the locally enabled modes.
- **Cached driver details** — the response of `getDriverDetails` is cached on first use and persisted until a super user calls `POST /payment-gateways/external/refresh-cache`.

## 2. Enabling the Driver

1. Go to **Settings → Payment Gateway**.
2. Select **Generic External** (`external`).
3. Save the required settings:

| Setting              | Recommended value                                                                      |
| -------------------- | -------------------------------------------------------------------------------------- |
| Endpoint URL         | `https://your-service.example.com/ticketz-payment-gateway` (required)                  |
| Auth Token           | A strong secret shared only with your service (sent as `Authorization: Bearer <token>`) |
| Enable subscriptions | `"true"` to create recurring subscriptions via `createSubscription`.                   |

When subscriptions are enabled, also include `getSubscriptionStatus` in the `operations` array returned by `getDriverDetails` so Ticketz can reconcile the subscription status every day.

After saving the Endpoint URL, the driver loads all metadata from your endpoint with a single `getDriverDetails` RPC call the first time it is needed. The **Load fields** and **Load modes** buttons now read from this cache. To force the driver to query the endpoint again (for example, after changing the fields or supported modes on your side), a super user can call:

```http
POST /payment-gateways/external/refresh-cache
```

The webhook URL that your provider must call is:

```
https://<your-ticketz-backend>/subscription/webhook
```

## 3. RPC Protocol

All calls are `POST` requests to your endpoint with `Content-Type: application/json`.

### Common request envelope

```json
{
  "operation": "create | createSubscription | webhook | checkStatus | expire | getDriverDetails | getSubscriptionStatus",
  "driver": "external",
  "callbackUrl": "https://<your-ticketz-backend>/subscription/webhook",
  "invoiceId": 123,
  "txId": "TX-ABC-123",
  "paymentMethod": "pix",
  "mode": "pix",
  "price": 99.90,
  "cardData": { ... },
  "company": { ... },
  "invoice": { ... },
  "webhookBody": { ... },
  "webhookHeaders": { ... },
  "webhookQuery": { ... },
  "currentSettings": { ... },
  "fileData": { ... },
  "idempotencyKey": "550e8400-e29b-41d4-a716-446655440000"
}
```

Fields are populated according to the operation:

| Operation                  | Populated fields                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `create`                   | `invoiceId`, `price`, `paymentMethod`, `mode`, `cardData`, `company`, `invoice`, `currentSettings`, `fileData` |
| `createSubscription`       | Same as `create`.                                                                                              |
| `syncSubscriptionPayment`  | `invoiceId`, `txId`, `subscriptionId`, `paymentMethod`, `company`, `invoice`, `currentSettings`, `fileData`    |
| `webhook`                  | `webhookBody`, `webhookHeaders`, `webhookQuery`, `currentSettings`, `fileData`                                 |
| `checkStatus`              | `invoiceId`, `txId`, `paymentMethod`, `invoice`, `currentSettings`, `fileData`                                 |
| `expire`                   | `invoiceId`, `txId`, `currentSettings`, `fileData`                                                             |
| `getSubscriptionStatus`    | `subscriptionId`, `currentSettings`, `fileData`                                                                |
| `getDriverDetails`         | `currentSettings`, `fileData`                                                                                  |

### Common response envelope

```json
{
  "success": true,
  "errorCode": "ERR_MY_CUSTOM",
  "errorMessage": "Readable error",
  "status": "paid | expired | ignored",
  "paymentMethod": "pix | boleto | credit_card",
  "subscriptionId": "sub-ABC-123",
  "txId": "TX-ABC-123",
  "value": 99.90,
  "qrcode": { "qrcode": "0002012658..." },
  "boletoUrl": "https://...",
  "boletoTypeable": "00190.00009 ...",
  "boletoBarcode": "0019000009...",
  "checkoutUrl": "https://checkout.example.com/...",
  "expireAt": "2026-06-20T23:59:59Z",
  "dueDate": "2026-06-20",
  "payGwData": { ... },
  "paymentData": { ... },
  "fields": [ ... ],
  "webhookResponse": { ... }
}
```

When `success` is `false` for a `create` operation, Ticketz returns a `400` response to the frontend with:

```json
{
  "error": "ERR_MY_CUSTOM",
  "message": "Readable error"
}
```

`errorCode` and `errorMessage` are both optional. If `errorMessage` is provided, it is displayed directly in the frontend toast. If only `errorCode` is provided, the frontend tries to translate it; otherwise it shows the code itself.

`fields` is returned inside `getDriverDetails`; returned field names must **not** include the `_external` prefix — Ticketz adds it automatically.

## 4. Operations in Detail

### 4.1 `create`

Ticketz sends this when the user requests a new charge.

**Request example:**

```json
{
  "operation": "create",
  "driver": "external",
  "callbackUrl": "https://ticketz.example.com/subscription/webhook",
  "invoiceId": 123,
  "price": 99.9,
  "paymentMethod": "pix",
  "company": {
    "id": 5,
    "name": "Acme SA",
    "email": "financeiro@acme.test",
    "dueDate": "2026-06-17",
    "recurrence": "MENSAL",
    "fiscalData": {
      "document": "12.345.678/0001-90",
      "name": "Acme SA",
      "fiscalEmail": "financeiro@acme.test",
      "postalCode": "01001000",
      "address": "Rua Exemplo",
      "addressNumber": "100",
      "province": "Centro",
      "city": "São Paulo",
      "state": "SP"
    },
    "externalIds": {}
  },
  "invoice": {
    "id": 123,
    "detail": "Assinatura Mensal",
    "status": "open",
    "value": 99.9,
    "currency": "BRL",
    "dueDate": "2026-06-17",
    "companyId": 5
  }
}
```

**Expected response for PIX:**

```json
{
  "success": true,
  "paymentMethod": "pix",
  "txId": "external-tx-123",
  "value": 99.9,
  "qrcode": { "qrcode": "00020126580014br.gov.bcb.pix..." },
  "expireAt": "2026-06-17T23:59:59.000Z",
  "payGwData": { "externalId": "external-tx-123", "raw": "..." }
}
```

**Expected response for boleto:**

```json
{
  "success": true,
  "paymentMethod": "boleto",
  "txId": "external-tx-456",
  "value": 99.9,
  "boletoUrl": "https://banco.example.com/boleto/456",
  "boletoTypeable": "00190.00009 01234.567890 12345.678901 2 12345678901234",
  "boletoBarcode": "00191234567890123456789012345678901234567890123",
  "dueDate": "2026-06-20",
  "payGwData": { "externalId": "external-tx-456" }
}
```

Ticketz stores `txId`, `paymentMethod`, `payGwData` (JSON-stringified) and `paymentData` on the invoice. `payGwData` and `paymentData` are optional; if omitted, Ticketz builds `paymentData` from the boleto/PIX fields. When a charge expires or is invalidated, Ticketz marks the invoice as `expired` and records `expiredAt` in `paymentData` for audit purposes.

**Date field semantics:**

- Use `expireAt` for short-lived charges such as Pix. The frontend renders a live countdown and can expire the charge automatically.
- Use `dueDate` for longer-term charges such as boleto. The frontend displays it as a calendar date instead of a countdown.
- When both fields are returned, Ticketz keeps only the most relevant one:
  - `pix` charges keep `expireAt`.
  - `boleto` and other charges keep `dueDate`.
  - The API response and the stored `paymentData` will contain only the chosen field.

### 4.2 `webhook`

Your provider sends a webhook to Ticketz, and Ticketz forwards it to your endpoint.

**Request example:**

```json
{
  "operation": "webhook",
  "driver": "external",
  "callbackUrl": "https://ticketz.example.com/subscription/webhook",
  "webhookBody": {
    "event": "payment.received",
    "data": {
      "txId": "external-tx-123",
      "amount": 99.9,
      "status": "paid"
    }
  },
  "webhookHeaders": {
    "content-type": "application/json",
    "x-signature": "sha256=..."
  },
  "webhookQuery": {}
}
```

**Expected response:**

```json
{
  "success": true,
  "status": "paid",
  "txId": "external-tx-123",
  "value": 99.9
}
```

Allowed `status` values:

- `paid` — `PaymentGatewayServices` locates the open invoice by `txId`, checks that the paid `value` is at least the invoice value, marks the invoice as paid and extends the company due date.
- `expired` — `PaymentGatewayServices` locates the open invoice by `txId`, marks the invoice as `expired` and records `expiredAt` in `paymentData` for audit purposes.
- `ignored` — Ticketz does nothing (use this for ping events, duplicates, etc.).

For `paid` and `expired`, `txId` is required so Ticketz can find the invoice internally, unless a `subscriptionId` is provided. When `subscriptionId` is present and `txId` is unknown, Ticketz resolves the oldest open invoice with that subscription id, updates its `txId` and processes the payment. The driver itself does not access the `Invoices` table; it only reports `txId`, `subscriptionId` and `value`. The paid `value` is optional; when omitted, the invoice value is assumed. If the paid amount is lower than the invoice value, the webhook is treated as `ignored`. If the paid amount is higher than the invoice value, the difference is stored on the invoice as `creditBalance` and applied as a discount on the next subscription invoice.

#### Custom webhook response

Some providers require a specific HTTP response when they deliver a webhook. By default, Ticketz answers the provider with `{ "ok": true }`. You can override this by including a `webhookResponse` object in your `webhook` response:

```json
{
  "success": true,
  "status": "paid",
  "txId": "external-tx-123",
  "value": 99.9,
  "webhookResponse": {
    "statusCode": 200,
    "body": { "received": true },
    "headers": {
      "content-type": "application/json"
    }
  }
}
```

- `statusCode` — HTTP status code Ticketz sends back. Defaults to `200` when omitted.
- `body` — JSON body returned to the provider.
- `headers` — Optional response headers (object with string values).

If `webhookResponse` is omitted, Ticketz keeps the default `{ "ok": true }` response.

### 4.3 `checkStatus`

Ticketz calls this for open invoices during the periodic check, when an admin manually requests a status refresh, and when the user clicks **Pay** on an invoice that already has an open charge.

**Request example:**

```json
{
  "operation": "checkStatus",
  "driver": "external",
  "callbackUrl": "https://ticketz.example.com/subscription/webhook",
  "txId": "external-tx-123",
  "paymentMethod": "pix"
}
```

**Expected response:**

```json
{
  "success": true,
  "status": "paid"
}
```

Allowed `status` values are `paid`, `expired` and `ignored`. If the response status is `paid`, Ticketz executes the same paid flow used by native drivers. If the response status is `expired`, Ticketz marks the invoice as `expired` and records `expiredAt` in `paymentData`.

### 4.4 `expire`

Reserved for future use. Ticketz may call this when an invoice is explicitly cancelled. Your endpoint should not rely on it today.

### 4.5 `getDriverDetails`

Single operation used to populate the driver cache. Ticketz calls it on first use and caches the response until a super user forces a refresh. The response must include `fields`, `modes` and `operations`.

> The `fields` array follows the same schema used by the frontend `DynamicForm` component. See [Dynamic form fields]({{ '/en/dynamic-form-fields/' | relative_url }}) for the full property reference and copy-paste examples.

**Request example:**

```json
{
  "operation": "getDriverDetails",
  "driver": "external",
  "callbackUrl": "https://ticketz.example.com/subscription/webhook",
  "currentSettings": {
    "_externalEndpointUrl": "https://your-service.example.com/ticketz-payment-gateway",
    "_externalAuthToken": "...",
    "_externalCertFile": "1759325637143.pem"
  },
  "fileData": {
    "_externalCertFile": "LS0tLS1CRUdJTi..."
  }
}
```

**Expected response:**

```json
{
  "success": true,
  "fields": [
    {
      "name": "tenantId",
      "title": "Tenant ID",
      "description": "Tenant returned by the provider OAuth flow",
      "type": "text",
      "lgWidth": 12,
      "required": true
    }
  ],
  "modes": ["pix", "boleto", "cc", "link"],
  "operations": [
    "create",
    "createSubscription",
    "syncSubscriptionPayment",
    "webhook",
    "checkStatus",
    "getSubscriptionStatus",
    "getDriverDetails"
  ]
}
```

### 4.6 `createSubscription`

Called when `_externalEnableSubscriptions` is `"true"` and the user requests a new charge. The request payload is identical to `create`, but Ticketz expects a `subscriptionId` in the response so it can match future webhook renewals to the company.

**Expected response:**

```json
{
  "success": true,
  "paymentMethod": "credit_card",
  "subscriptionId": "sub-external-123",
  "txId": "external-tx-789",
  "value": 99.9,
  "checkoutUrl": "https://checkout.example.com/sub-external-123",
  "payGwData": { "subscriptionId": "sub-external-123" }
}
```

Validation is similar to `create`, but `subscriptionId` is mandatory. For PIX and boleto subscriptions, the first payment data (`qrcode` or `boletoUrl`) may also be returned so the user can pay immediately.

### 4.7 `syncSubscriptionPayment`

Called daily for every open invoice that has a `subscriptionId`, and also when the admin clicks **Sync payment** in the invoice list. Your endpoint should query the provider for the next pending/future payment of the subscription and return the payable data.

**Expected response when a pending payment exists:**

```json
{
  "success": true,
  "paymentMethod": "pix",
  "txId": "external-tx-renewal-456",
  "value": 99.9,
  "qrcode": { "qrcode": "00020126580014br.gov.bcb.pix..." },
  "expireAt": "2026-07-17T23:59:59Z",
  "payGwData": { "subscriptionId": "sub-external-123", "paymentId": "external-tx-renewal-456" }
}
```

**Expected response when no pending payment is available yet:**

```json
{
  "success": true
}
```

When `txId` is omitted, Ticketz treats the response as "no data available" and leaves the invoice unchanged. When `txId` is present, the response is validated like a `create` response and the invoice is updated with the new `txId`, `paymentMethod`, `payGwData` and `paymentData`. This lets the frontend display the open charge (PIX QR code, boleto barcode or checkout link) instead of generating a new one.

### 4.8 `getSubscriptionStatus`

Called daily for every company that has an active external subscription. Your endpoint should query the provider for the current status of the subscription and return one of the following values in the `status` field:

- `active` — the subscription is active; Ticketz keeps the company marked as subscribed.
- `inactive` (or `canceled`) — the subscription is no longer active; Ticketz updates the company locally so invoice generation falls back to the regular billing cycle.

**Expected response:**

```json
{
  "success": true,
  "status": "active"
}
```

Returning `success: true` without a `status` field, or returning `success: false`, is treated as "status unknown" and the company is left unchanged.

## 5. Authentication Headers

Ticketz sends the configured token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

Your endpoint must validate this token and reject unknown requests.

## 6. Retry and Timeout Behavior

- The driver uses a fixed timeout of **30 seconds**.
- The driver retries up to **3 times** with delays of **1s, 3s and 5s**.
- Retries only happen for transient failures: network errors, HTTP `5xx` responses or HTTP `429 Too Many Requests`.
- HTTP `4xx` responses and successful responses with `success: false` are **not** retried.
- Each attempt sends a fresh `idempotencyKey` (UUID v4); your endpoint can use it to avoid duplicate charges.
- Webhooks are answered with `{ ok: true }` to the provider by default. If your `webhook` response includes `webhookResponse`, Ticketz forwards that status code, body and headers to the provider instead.

## 7. Response Validation

Ticketz validates every successful response before applying it. If your endpoint returns a malformed payload, the operation aborts and the user sees an `ERR_EXTERNAL_*` error.

| Operation                | Required fields on `success: true`                                                                                                                                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create`                 | `paymentMethod` (`pix`, `boleto` or `credit_card`), non-empty `txId`, and the payment data required by the mode (`qrcode.qrcode` for PIX, `boletoUrl` for boleto, or `checkoutUrl` for `link`). `paymentData` can be used instead of the top-level fields. |
| `createSubscription`       | `paymentMethod`, non-empty `subscriptionId`, and the same payment-data rules as `create`.                                                                                                                                                                  |
| `syncSubscriptionPayment`  | When `txId` is present, same validation as `create`. When `txId` is omitted, the response means "no pending payment available" and is accepted without further validation.                                                                                  |
| `webhook`                  | `status` (`paid`, `expired` or `ignored`). `paid`/`expired` require `txId` and/or `subscriptionId`.                                                                                                                                                        |
| `checkStatus`              | `status` (`paid`, `expired` or `ignored`). An `expired` response marks the invoice as `expired` and records `expiredAt` in `paymentData`.                                                                                                                  |
| `getSubscriptionStatus`    | `status` (`active`, `inactive` or `canceled`). Other values are treated as unknown.                                                                                                                                                                      |
| `getDriverDetails`         | `fields`, `modes` and `operations` must be valid arrays. `modes` may only contain `pix`, `boleto`, `cc` or `link`.                                                                                                                                         |

When `success: false`, include `errorCode` and optionally `errorMessage`. `errorCode` is forwarded to the frontend and translated from `backendErrors`.

## 8. Private certificate files

If the driver declares a file field with `extra.file.private: true`, the user uploads the file through `/settings/privateFile`. The file is saved in `backend/private`. On every RPC call the driver reads the file and sends it under `fileData` as a base64 string:

```json
{
  "fileData": {
    "_externalCertFile": "LS0tLS1CRUdJTi..."
  }
}
```

Your endpoint can use this certificate for mTLS authentication or for signing requests to the provider. Do not store the raw file in `payGwData`.

## 9. Idempotency

Your endpoint should be idempotent for `create`, especially because Ticketz retries on failure. A common pattern is:

1. Check whether `txId` or `invoiceId` already has an active charge in your provider.
2. If yes, return the existing data (you can set `_reused: true` in the response).
3. If no, create a new charge.

## 10. Minimal Example (Node.js / Express)

```javascript
const express = require("express");
const app = express();
app.use(express.json());

const TOKEN = process.env.TICKETZ_GATEWAY_TOKEN;

function authorize(req) {
  const header = req.headers.authorization || "";
  return header === `Bearer ${TOKEN}`;
}

app.post("/ticketz-payment-gateway", async (req, res) => {
  if (!authorize(req)) return res.status(401).json({ success: false });

  const {
    operation,
    invoiceId,
    txId,
    price,
    paymentMethod,
    mode,
    cardData,
    webhookBody,
  } = req.body;

  if (operation === "create") {
    const charge = await myProvider.createCharge({
      amount: price,
      method: paymentMethod,
      mode,
      cardData,
      externalReference: String(invoiceId),
    });

    return res.json({
      success: true,
      paymentMethod,
      txId: charge.id,
      value: price,
      qrcode: mode === "pix" ? { qrcode: charge.pixCopiaECola } : undefined,
      boletoUrl: mode === "boleto" ? charge.pdfUrl : undefined,
      boletoBarcode: mode === "boleto" ? charge.barcode : undefined,
      checkoutUrl: mode === "link" ? charge.checkoutUrl : undefined,
      expireAt: mode === "pix" ? charge.expiresAt : undefined,
      dueDate: mode === "boleto" ? charge.dueDate : undefined,
    });
  }

  if (operation === "webhook") {
    const event = webhookBody?.event;
    const data = webhookBody?.data || {};

    if (event === "payment.received" && data.status === "paid") {
      return res.json({
        success: true,
        status: "paid",
        txId: data.txId,
        value: data.amount,
      });
    }

    return res.json({ success: true, status: "ignored" });
  }

  if (operation === "checkStatus") {
    const status = await myProvider.checkCharge(txId);
    return res.json({ success: true, status });
  }

  if (operation === "createSubscription") {
    const subscription = await myProvider.createSubscription({
      amount: price,
      method: paymentMethod,
      mode,
      cardData,
      externalReference: String(invoiceId),
    });

    return res.json({
      success: true,
      paymentMethod,
      subscriptionId: subscription.id,
      txId: subscription.firstPaymentId,
      value: price,
      checkoutUrl: subscription.checkoutUrl,
    });
  }

  if (operation === "getDriverDetails") {
    return res.json({
      success: true,
      fields: [
        {
          name: "providerAccountId",
          title: "Provider Account ID",
          type: "text",
          lgWidth: 12,
          required: true,
        },
      ],
      modes: ["pix", "boleto", "cc", "link"],
      operations: [
        "create",
        "createSubscription",
        "webhook",
        "checkStatus",
        "getDriverDetails",
      ],
    });
  }

  return res
    .status(400)
    .json({ success: false, errorMessage: "Unknown operation" });
});

app.listen(3000);
```

## 11. Frontend integration

The Payment Gateway settings screen now loads the driver list from `GET /payment-gateways/drivers`. For the `external` driver it renders the base fields plus any dynamic fields returned by `getDriverDetails`. File fields use the existing `/settings/privateFile` upload, and action fields trigger `POST /payment-gateways/external/fields`, which returns the cached fields. To force a refresh of the cached metadata, a super user can call `POST /payment-gateways/external/refresh-cache`.

The checkout loads the active driver from `GET /payment-gateways/active` and renders a radio selector for each supported mode returned in `supportedModes`, **except `link`**. The `link` mode is never displayed as a selectable option; if it is the only mode supported by the active driver, the checkout creates the charge and redirects the user to the `checkoutUrl` returned by the driver.

When only one non-`link` mode is available, the radio selector is hidden and the checkout advances to that method automatically:

- `pix` / `boleto` — the charge is created immediately and the user is taken to the success screen.
- `cc` — the `CreditCardForm` is shown and the user completes the card data before clicking **Pay**.

For `cc` mode the built-in `CreditCardForm` captures card data and sends it in `cardData`. For `link` mode the frontend redirects to the `checkoutUrl` returned by the driver.

### Reusing existing open charges

When an open invoice already has `paymentData` with a QR code, boleto URL or checkout link, the invoice list displays **View Pix**, **View Boleto** or **Pay External** buttons instead of generating a duplicate charge. Clicking **Pay** on such an invoice first calls `POST /invoices/:id/check-payment` to confirm that the charge is still valid:

- If the charge is `paid` → the invoice is marked paid and the user sees a confirmation toast.
- If the charge is `expired` → the charge data is cleared and the checkout opens so the user can generate a new charge.
- If the charge is still open → a modal shows the existing PIX QR code, boleto barcode or checkout link.

## 12. Troubleshooting

| Symptom                                 | Likely cause                                                                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERR_EXTERNAL_ENDPOINT_NOT_CONFIGURED`  | `_externalEndpointUrl` is empty.                                                                                                             |
| `ERR_EXTERNAL_RPC_CALL_FAILED`          | Network error or your endpoint returned 5xx after retries.                                                                                   |
| Webhook not triggering                  | Provider is calling the wrong URL; verify `callbackUrl` and firewall rules.                                                                   |
| Invoice not marked paid                 | Your `webhook` response did not include `status: "paid"` plus a valid `txId`, or the paid `value` is lower than the invoice value.            |
| `ERR_EXTERNAL_MISSING_PAYMENT_DATA`     | `create` response is missing `qrcode` for PIX, `boletoUrl` for boleto, or `checkoutUrl` for `link` (or the equivalent inside `paymentData`). |
| `ERR_EXTERNAL_INVALID_FIELDS`           | `getDriverDetails` `fields` array is invalid or a field is missing `name`, `title`, `type` or `required`.                                    |
| `ERR_EXTERNAL_INVALID_STATUS`           | `webhook` or `checkStatus` response contains a `status` other than `paid`, `expired` or `ignored`.                                           |
| `ERR_EXTERNAL_INVALID_MODES`            | `getDriverDetails` `modes` array is not an array or contains values other than `pix`, `boleto`, `cc` or `link`.                              |
| `ERR_EXTERNAL_INVALID_OPERATIONS`       | `getDriverDetails` `operations` array is not an array.                                                                                       |
| `ERR_EXTERNAL_MISSING_SUBSCRIPTION_ID`  | `createSubscription` response did not include a non-empty `subscriptionId`.                                                                  |
| Create always creates duplicate charges | Your endpoint is not idempotent; check `invoiceId`/`txId` before creating.                                                                    |
| Mode does not appear in checkout        | The mode is disabled by `_externalDisable*` or was not returned by `getDriverDetails.modes`.                                                 |
| Subscription not created                | `_externalEnableSubscriptions` is not `"true"` or `getDriverDetails.operations` does not include `createSubscription`.                       |

## 13. Security Checklist

- [ ] Use HTTPS for the endpoint and webhook URL.
- [ ] Validate the authorization token on every request.
- [ ] Validate provider webhook signatures inside your endpoint.
- [ ] Treat `invoiceId` and `txId` as opaque strings.
- [ ] Do not expose internal provider credentials in `payGwData`.
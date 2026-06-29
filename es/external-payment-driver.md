---
title: Gateway de Pago Personalizado (Driver Externo)
lang: es
slug: external-payment-driver
description: Integra cualquier proveedor de cobranza a Ticketz PRO con el contrato RPC del driver de pago Genérico Externo.
---

Ticketz PRO incluye un driver de gateway de pago **Genérico Externo** que permite integrar cualquier proveedor de cobranza sin modificar el código fuente del backend. En lugar de escribir un nuevo driver en TypeScript, implementas un único endpoint HTTP que recibe llamadas RPC de Ticketz y devuelve los datos requeridos.

> **Referencia canónica:** un contrato formal OpenAPI 3.0 está disponible en
> [External-Payment-Driver-OpenAPI.yaml]({{ '/assets/examples/External-Payment-Driver-OpenAPI.yaml' | relative_url }}).
> Úsalo para validar tu implementación con herramientas OpenAPI o para generar stubs de servidor.

## 1. Cómo funciona

El `ExternalPaymentDriver` almacena/lee los datos de las facturas en la base de datos de Ticketz y reenvía cada operación de negocio a tu endpoint:

- **Crear pago** — Ticketz pide a tu endpoint que genere un código PIX, boleto, cobro de tarjeta de crédito o link de checkout externo.
- **Crear suscripción** — Ticketz pide a tu endpoint que cree una suscripción recurrente y devuelva un `subscriptionId`.
- **Sincronizar pago de suscripción** — Ticketz pide a tu endpoint el próximo pago pendiente de la suscripción (p. ej. próximo QR Code PIX, código de barras del boleto o URL de la factura hospedada) para que la factura se actualice antes del vencimiento.
- **Obtener estado de la suscripción** — Ticketz pide a tu endpoint el estado actual de la suscripción durante el job diario de reconciliación.
- **Webhook** — Ticketz reenvía el payload del webhook del proveedor a tu endpoint para que lo valides y le indiques a Ticketz si la factura fue pagada o expirada.
- **Verificar estado** — Ticketz pide a tu endpoint el estado actual de una factura abierta.
- **Reportar detalles del driver** — Ticketz pide a tu endpoint los campos dinámicos, modos soportados y operaciones soportadas en una única llamada `getDriverDetails`. El resultado se cachea y se reutiliza hasta un refresh forzado.

Tu endpoint es responsable de toda la lógica específica del proveedor: autenticación, llamadas a la API, validación de firmas, idempotencia, etc.

El driver externo también soporta las siguientes funciones avanzadas:

- **Campos de configuración dinámicos** — tu endpoint puede declarar campos de configuración adicionales que aparecen en la UI de Ticketz. Se devuelven dentro de `getDriverDetails`.
- **Archivos de certificado privados** — los certificados subidos se almacenan de forma segura en `backend/private` y se envían a tu endpoint codificados en base64 en cada llamada RPC.
- **Deshabilitar modos** — los modos individuales se pueden deshabilitar mediante parámetros del driver (`_externalDisablePix`, `_externalDisableBoleto`, `_externalDisableCc`, `_externalDisableLink`). Cuando `getDriverDetails` reporta los modos soportados, la lista final es la intersección de los modos del endpoint y los modos habilitados localmente.
- **Detalles del driver en caché** — la respuesta de `getDriverDetails` se cachea en el primer uso y se persiste hasta que un super usuario llama a `POST /payment-gateways/external/refresh-cache`.

## 2. Habilitar el driver

1. Ve a **Configuración → Gateway de Pago**.
2. Selecciona **Genérico Externo** (`external`).
3. Guarda las configuraciones obligatorias:

| Configuración             | Valor recomendado                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------- |
| URL del Endpoint         | `https://your-service.example.com/ticketz-payment-gateway` (obligatorio)               |
| Token de Autenticación   | Un secreto fuerte compartido solo con tu servicio (enviado como `Authorization: Bearer <token>`) |
| Habilitar suscripciones  | `"true"` para crear suscripciones recurrentes vía `createSubscription`.                 |

Cuando las suscripciones estén habilitadas, incluye también `getSubscriptionStatus` en el array `operations` devuelto por `getDriverDetails` para que Ticketz pueda reconciliar el estado de la suscripción todos los días.

Tras guardar la URL del Endpoint, el driver carga todos los metadatos de tu endpoint con una única llamada RPC `getDriverDetails` la primera vez que se necesite. Los botones **Cargar campos** y **Cargar modos** ahora leen de ese caché. Para forzar al driver a consultar el endpoint nuevamente (por ejemplo, tras cambiar los campos o modos soportados de tu lado), un super usuario puede llamar a:

```http
POST /payment-gateways/external/refresh-cache
```

La URL del webhook que tu proveedor debe llamar es:

```
https://<tu-backend-ticketz>/subscription/webhook
```

## 3. Protocolo RPC

Todas las llamadas son peticiones `POST` a tu endpoint con `Content-Type: application/json`.

### Envelope común de petición

```json
{
  "operation": "create | createSubscription | webhook | checkStatus | expire | getDriverDetails | getSubscriptionStatus",
  "driver": "external",
  "callbackUrl": "https://<tu-backend-ticketz>/subscription/webhook",
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

Los campos se rellenan según la operación:

| Operación                  | Campos rellenados                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `create`                   | `invoiceId`, `price`, `paymentMethod`, `mode`, `cardData`, `company`, `invoice`, `currentSettings`, `fileData` |
| `createSubscription`       | Igual que `create`.                                                                                            |
| `syncSubscriptionPayment`  | `invoiceId`, `txId`, `subscriptionId`, `paymentMethod`, `company`, `invoice`, `currentSettings`, `fileData`    |
| `webhook`                  | `webhookBody`, `webhookHeaders`, `webhookQuery`, `currentSettings`, `fileData`                                 |
| `checkStatus`              | `invoiceId`, `txId`, `paymentMethod`, `invoice`, `currentSettings`, `fileData`                                 |
| `expire`                   | `invoiceId`, `txId`, `currentSettings`, `fileData`                                                            |
| `getSubscriptionStatus`    | `subscriptionId`, `currentSettings`, `fileData`                                                                 |
| `getDriverDetails`         | `currentSettings`, `fileData`                                                                                  |

### Envelope común de respuesta

```json
{
  "success": true,
  "errorCode": "ERR_MY_CUSTOM",
  "errorMessage": "Error legible",
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

Cuando `success` es `false` en una operación `create`, Ticketz devuelve una respuesta `400` al frontend con:

```json
{
  "error": "ERR_MY_CUSTOM",
  "message": "Error legible"
}
```

`errorCode` y `errorMessage` son ambos opcionales. Si se proporciona `errorMessage`, se muestra directamente en el toast del frontend. Si solo se proporciona `errorCode`, el frontend intenta traducirlo; de lo contrario, muestra el código.

`fields` se devuelve dentro de `getDriverDetails`; los nombres de los campos devueltos **no** deben incluir el prefijo `_external` — Ticketz lo añade automáticamente.

## 4. Operaciones en detalle

### 4.1 `create`

Ticketz envía esta operación cuando el usuario solicita un nuevo cobro.

**Ejemplo de petición:**

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

**Respuesta esperada para PIX:**

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

**Respuesta esperada para boleto:**

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

Ticketz almacena `txId`, `paymentMethod`, `payGwData` (como string JSON) y `paymentData` en la factura. `payGwData` y `paymentData` son opcionales; si se omiten, Ticketz construye `paymentData` a partir de los campos de boleto/PIX. Cuando un cobro expira o se invalida, Ticketz marca la factura como `expired` y registra `expiredAt` en `paymentData` para fines de auditoría.

**Semántica de los campos de fecha:**

- Usa `expireAt` para cobros de corta duración, como Pix. El frontend renderiza una cuenta regresiva en vivo y puede expirar el cobro automáticamente.
- Usa `dueDate` para cobros de largo plazo, como boleto. El frontend lo muestra como una fecha de calendario en lugar de cuenta regresiva.
- Cuando se devuelven ambos campos, Ticketz mantiene solo el más relevante:
  - cobros `pix` mantienen `expireAt`.
  - boletos y demás cobros mantienen `dueDate`.
  - La respuesta de la API y el `paymentData` almacenado contendrán solo el campo elegido.

### 4.2 `webhook`

Tu proveedor envía un webhook a Ticketz, y Ticketz lo reenvía a tu endpoint.

**Ejemplo de petición:**

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

**Respuesta esperada:**

```json
{
  "success": true,
  "status": "paid",
  "txId": "external-tx-123",
  "value": 99.9
}
```

Valores permitidos para `status`:

- `paid` — `PaymentGatewayServices` localiza la factura abierta por `txId`, verifica que el `value` pagado sea al menos el valor de la factura, marca la factura como pagada y extiende la fecha de vencimiento de la empresa.
- `expired` — `PaymentGatewayServices` localiza la factura abierta por `txId`, marca la factura como `expired` y registra `expiredAt` en `paymentData` para fines de auditoría.
- `ignored` — Ticketz no hace nada (úsa esto para eventos ping, duplicados, etc.).

Para `paid` y `expired`, `txId` es obligatorio para que Ticketz encuentre la factura internamente, a menos que se proporcione un `subscriptionId`. Cuando `subscriptionId` está presente y `txId` es desconocido, Ticketz resuelve la factura abierta más antigua con ese id de suscripción, actualiza su `txId` y procesa el pago. El driver en sí no accede a la tabla `Invoices`; solo reporta `txId`, `subscriptionId` y `value`. El `value` pagado es opcional; cuando se omite, se asume el valor de la factura. Si el monto pagado es menor que el valor de la factura, el webhook se trata como `ignored`. Si el monto pagado es mayor que el valor de la factura, la diferencia se almacena en la factura como `creditBalance` y se aplica como descuento en la próxima factura de suscripción.

#### Respuesta de webhook personalizada

Algunos proveedores requieren una respuesta HTTP específica cuando entregan un webhook. Por defecto, Ticketz responde al proveedor con `{ "ok": true }`. Puedes sobrescribir esto incluyendo un objeto `webhookResponse` en tu respuesta de `webhook`:

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

- `statusCode` — código HTTP que Ticketz envía de vuelta. Por defecto `200` cuando se omite.
- `body` — cuerpo JSON devuelto al proveedor.
- `headers` — cabeceras de respuesta opcionales (objeto con valores string).

Si se omite `webhookResponse`, Ticketz mantiene la respuesta por defecto `{ "ok": true }`.

### 4.3 `checkStatus`

Ticketz llama a esta operación para facturas abiertas durante la verificación periódica, cuando un admin solicita manualmente un refresh de estado, y cuando el usuario hace clic en **Pagar** en una factura que ya tiene un cobro abierto.

**Ejemplo de petición:**

```json
{
  "operation": "checkStatus",
  "driver": "external",
  "callbackUrl": "https://ticketz.example.com/subscription/webhook",
  "txId": "external-tx-123",
  "paymentMethod": "pix"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "status": "paid"
}
```

Los valores permitidos para `status` son `paid`, `expired` e `ignored`. Si el estado de la respuesta es `paid`, Ticketz ejecuta el mismo flujo de pago usado por los drivers nativos. Si el estado de la respuesta es `expired`, Ticketz marca la factura como `expired` y registra `expiredAt` en `paymentData`.

### 4.4 `expire`

Reservado para uso futuro. Ticketz puede llamar a esta operación cuando una factura se cancela explícitamente. Tu endpoint no debe depender de ello hoy.

### 4.5 `getDriverDetails`

Operación única usada para popular el caché del driver. Ticketz la llama en el primer uso y cachea la respuesta hasta que un super usuario fuerza un refresh. La respuesta debe incluir `fields`, `modes` y `operations`.

> El array `fields` sigue el mismo schema usado por el componente `DynamicForm` del frontend. Consulta [Campos de formulario dinámico]({{ '/es/dynamic-form-fields/' | relative_url }}) para la referencia completa de propiedades y ejemplos listos para copiar.

**Ejemplo de petición:**

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

**Respuesta esperada:**

```json
{
  "success": true,
  "fields": [
    {
      "name": "tenantId",
      "title": "Tenant ID",
      "description": "Tenant devuelto por el flujo OAuth del proveedor",
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

Llamada cuando `_externalEnableSubscriptions` es `"true"` y el usuario solicita un nuevo cobro. El payload de la petición es idéntico al de `create`, pero Ticketz espera un `subscriptionId` en la respuesta para poder casar futuras renovaciones de webhook con la empresa.

**Respuesta esperada:**

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

La validación es similar a la de `create`, pero `subscriptionId` es obligatorio. Para suscripciones vía PIX y boleto, los datos del primer pago (`qrcode` o `boletoUrl`) también pueden devolverse para que el usuario pague de inmediato.

### 4.7 `syncSubscriptionPayment`

Llamada diariamente para toda factura abierta que tiene un `subscriptionId`, y también cuando el admin hace clic en **Sincronizar pago** en la lista de facturas. Tu endpoint debe consultar al proveedor sobre el próximo pago pendiente/futuro de la suscripción y devolver los datos pagables.

**Respuesta esperada cuando existe un pago pendiente:**

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

**Respuesta esperada cuando no hay pago pendiente disponible:**

```json
{
  "success": true
}
```

Cuando se omite `txId`, Ticketz trata la respuesta como "sin datos disponibles" y deja la factura sin cambios. Cuando `txId` está presente, la respuesta se valida como una respuesta de `create` y la factura se actualiza con el nuevo `txId`, `paymentMethod`, `payGwData` y `paymentData`. Esto permite que el frontend muestre el cobro abierto (QR Code PIX, código de barras del boleto o link de checkout) en lugar de generar uno nuevo.

### 4.8 `getSubscriptionStatus`

Llamada diariamente para toda empresa que tiene una suscripción externa activa. Tu endpoint debe consultar al proveedor sobre el estado actual de la suscripción y devolver uno de los siguientes valores en el campo `status`:

- `active` — la suscripción está activa; Ticketz mantiene la empresa marcada como suscriptora.
- `inactive` (o `canceled`) — la suscripción ya no está activa; Ticketz actualiza la empresa localmente para que la generación de facturas vuelva al ciclo de cobranza regular.

**Respuesta esperada:**

```json
{
  "success": true,
  "status": "active"
}
```

Devolver `success: true` sin el campo `status`, o devolver `success: false`, se trata como "estado desconocido" y la empresa se deja sin cambios.

## 5. Cabeceras de autenticación

Ticketz envía el token configurado en la cabecera `Authorization`:

```http
Authorization: Bearer <token>
```

Tu endpoint debe validar este token y rechazar peticiones desconocidas.

## 6. Comportamiento de retry y timeout

- El driver usa un timeout fijo de **30 segundos**.
- El driver hace hasta **3 intentos** con retrasos de **1s, 3s y 5s**.
- Los retries solo ocurren en fallos transitorios: errores de red, respuestas HTTP `5xx` o HTTP `429 Too Many Requests`.
- Las respuestas HTTP `4xx` y las respuestas exitosas con `success: false` **no** se reintentan.
- Cada intento envía un nuevo `idempotencyKey` (UUID v4); tu endpoint puede usarlo para evitar cobros duplicados.
- Los webhooks se responden con `{ ok: true }` al proveedor por defecto. Si tu respuesta de `webhook` incluye `webhookResponse`, Ticketz reenvía ese código de estado, cuerpo y cabeceras al proveedor.

## 7. Validación de respuesta

Ticketz valida cada respuesta exitosa antes de aplicarla. Si tu endpoint devuelve un payload malformado, la operación se aborta y el usuario ve un error `ERR_EXTERNAL_*`.

| Operación                   | Campos obligatorios en `success: true`                                                                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create`                    | `paymentMethod` (`pix`, `boleto` o `credit_card`), `txId` no vacío, y los datos de pago exigidos por el modo (`qrcode.qrcode` para PIX, `boletoUrl` para boleto, o `checkoutUrl` para `link`). `paymentData` puede usarse en lugar de los campos del nivel superior. |
| `createSubscription`        | `paymentMethod`, `subscriptionId` no vacío, y las mismas reglas de datos de pago de `create`.                                                                                                                                                              |
| `syncSubscriptionPayment`   | Cuando `txId` está presente, misma validación que `create`. Cuando se omite `txId`, la respuesta significa "ningún pago pendiente disponible" y se acepta sin validación adicional.                                                                          |
| `webhook`                   | `status` (`paid`, `expired` o `ignored`). `paid`/`expired` requieren `txId` y/o `subscriptionId`.                                                                                                                                                        |
| `checkStatus`               | `status` (`paid`, `expired` o `ignored`). Una respuesta `expired` marca la factura como `expired` y registra `expiredAt` en `paymentData`.                                                                                                                |
| `getSubscriptionStatus`     | `status` (`active`, `inactive` o `canceled`). Otros valores se tratan como desconocidos.                                                                                                                                                                  |
| `getDriverDetails`          | `fields`, `modes` y `operations` deben ser arrays válidos. `modes` solo puede contener `pix`, `boleto`, `cc` o `link`.                                                                                                                                     |

Cuando `success: false`, incluye `errorCode` y opcionalmente `errorMessage`. `errorCode` se reenvía al frontend y se traduce desde `backendErrors`.

## 8. Archivos de certificado privados

Si el driver declara un campo de archivo con `extra.file.private: true`, el usuario sube el archivo vía `/settings/privateFile`. El archivo se guarda en `backend/private`. En cada llamada RPC el driver lee el archivo y lo envía en `fileData` como string base64:

```json
{
  "fileData": {
    "_externalCertFile": "LS0tLS1CRUdJTi..."
  }
}
```

Tu endpoint puede usar este certificado para autenticación mTLS o para firmar peticiones al proveedor. No almacenes el archivo bruto en `payGwData`.

## 9. Idempotencia

Tu endpoint debe ser idempotente para `create`, especialmente porque Ticketz hace retry en fallo. Un patrón común es:

1. Verificar si `txId` o `invoiceId` ya tiene un cobro activo en tu proveedor.
2. Si sí, devolver los datos existentes (puedes setear `_reused: true` en la respuesta).
3. Si no, crear un nuevo cobro.

## 10. Ejemplo mínimo (Node.js / Express)

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

## 11. Integración con el frontend

La pantalla de configuración del Gateway de Pago carga la lista de drivers en `GET /payment-gateways/drivers`. Para el driver `external` renderiza los campos base más cualquier campo dinámico devuelto por `getDriverDetails`. Los campos de archivo usan la subida existente en `/settings/privateFile`, y los campos de acción disparan `POST /payment-gateways/external/fields`, que devuelve los campos en caché. Para forzar un refresh de los metadatos en caché, un super usuario puede llamar a `POST /payment-gateways/external/refresh-cache`.

El checkout carga el driver activo en `GET /payment-gateways/active` y renderiza un selector de radio para cada modo soportado devuelto en `supportedModes`, **excepto `link`**. El modo `link` nunca se muestra como opción seleccionable; si es el único modo soportado por el driver activo, el checkout crea el cobro y redirige al usuario al `checkoutUrl` devuelto por el driver.

Cuando solo está disponible un modo que no sea `link`, el selector de radio se oculta y el checkout avanza automáticamente a ese método:

- `pix` / `boleto` — el cobro se crea de inmediato y el usuario es llevado a la pantalla de éxito.
- `cc` — el `CreditCardForm` se muestra y el usuario completa los datos de la tarjeta antes de hacer clic en **Pagar**.

Para el modo `cc` el `CreditCardForm` nativo captura los datos de la tarjeta y los envía en `cardData`. Para el modo `link` el frontend redirige al `checkoutUrl` devuelto por el driver.

### Reutilizando cobros abiertos existentes

Cuando una factura abierta ya tiene `paymentData` con QR Code, URL de boleto o link de checkout, la lista de facturas muestra los botones **Ver Pix**, **Ver Boleto** o **Pagar Externo** en lugar de generar un cobro duplicado. Hacer clic en **Pagar** en tal factura primero llama a `POST /invoices/:id/check-payment` para confirmar que el cobro sigue siendo válido:

- Si el cobro está `paid` → la factura se marca como pagada y el usuario ve un toast de confirmación.
- Si el cobro está `expired` → los datos del cobro se limpian y el checkout abre para que el usuario genere un nuevo cobro.
- Si el cobro sigue abierto → un modal muestra el QR Code PIX, código de barras del boleto o link de checkout existente.

## 12. Troubleshooting

| Síntoma                                 | Causa probable                                                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERR_EXTERNAL_ENDPOINT_NOT_CONFIGURED`  | `_externalEndpointUrl` está vacío.                                                                                                          |
| `ERR_EXTERNAL_RPC_CALL_FAILED`          | Error de red o tu endpoint devolvió 5xx tras los retries.                                                                                   |
| Webhook no dispara                      | El proveedor está llamando a la URL equivocada; verifica `callbackUrl` y reglas de firewall.                                                |
| Factura no marcada como pagada          | Tu respuesta de `webhook` no incluyó `status: "paid"` más un `txId` válido, o el `value` pagado es menor que el valor de la factura.          |
| `ERR_EXTERNAL_MISSING_PAYMENT_DATA`     | Respuesta de `create` sin `qrcode` para PIX, `boletoUrl` para boleto, o `checkoutUrl` para `link` (o el equivalente dentro de `paymentData`). |
| `ERR_EXTERNAL_INVALID_FIELDS`           | Array `fields` de `getDriverDetails` inválido o un campo sin `name`, `title`, `type` o `required`.                                          |
| `ERR_EXTERNAL_INVALID_STATUS`           | Respuesta de `webhook` o `checkStatus` con `status` distinto de `paid`, `expired` o `ignored`.                                              |
| `ERR_EXTERNAL_INVALID_MODES`            | Array `modes` de `getDriverDetails` no es un array o contiene valores distintos de `pix`, `boleto`, `cc` o `link`.                           |
| `ERR_EXTERNAL_INVALID_OPERATIONS`       | Array `operations` de `getDriverDetails` no es un array.                                                                                   |
| `ERR_EXTERNAL_MISSING_SUBSCRIPTION_ID`  | Respuesta de `createSubscription` no incluyó un `subscriptionId` no vacío.                                                                  |
| Create siempre crea cobros duplicados   | Tu endpoint no es idempotente; verifica `invoiceId`/`txId` antes de crear.                                                                  |
| Modo no aparece en el checkout          | El modo está deshabilitado por `_externalDisable*` o no fue devuelto por `getDriverDetails.modes`.                                          |
| Suscripción no creada                   | `_externalEnableSubscriptions` no es `"true"` o `getDriverDetails.operations` no incluye `createSubscription`.                               |

## 13. Checklist de seguridad

- [ ] Usa HTTPS para la URL del endpoint y del webhook.
- [ ] Valida el token de autorización en cada petición.
- [ ] Valida las firmas de webhook del proveedor dentro de tu endpoint.
- [ ] Trata `invoiceId` y `txId` como strings opacos.
- [ ] No expongas credenciales internas del proveedor en `payGwData`.
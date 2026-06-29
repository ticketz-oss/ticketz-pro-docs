---
title: Gateway de Pagamento Personalizado (Driver Externo)
lang: pt-br
slug: external-payment-driver
description: Integre qualquer provedor de cobrança ao Ticketz PRO com o contrato RPC do driver de pagamento Genérico Externo.
---

O Ticketz PRO inclui um driver de gateway de pagamento **Genérico Externo** que permite integrar qualquer provedor de cobrança sem modificar o código-fonte do backend. Em vez de escrever um novo driver em TypeScript, você implementa um único endpoint HTTP que recebe chamadas RPC do Ticketz e retorna os dados necessários.

> **Referência canônica:** um contrato formal OpenAPI 3.0 está disponível em
> [External-Payment-Driver-OpenAPI.yaml]({{ '/assets/examples/External-Payment-Driver-OpenAPI.yaml' | relative_url }}).
> Use-o para validar sua implementação com ferramentas OpenAPI ou para gerar stubs de servidor.

## 1. Como funciona

O `ExternalPaymentDriver` armazena/lê os dados das faturas no banco de dados do Ticketz e encaminha toda operação de negócio para o seu endpoint:

- **Criar pagamento** — o Ticketz pede ao seu endpoint que gere um código PIX, boleto, cobrança de cartão de crédito ou link de checkout externo.
- **Criar assinatura** — o Ticketz pede ao seu endpoint que crie uma assinatura recorrente e retorne um `subscriptionId`.
- **Sincronizar pagamento de assinatura** — o Ticketz pede ao seu endpoint o próximo pagamento pendente da assinatura (ex.: próximo QR Code PIX, código de barras do boleto ou URL da fatura hospedada) para que a fatura seja atualizada antes do vencimento.
- **Obter status da assinatura** — o Ticketz pede ao seu endpoint o status atual da assinatura durante o job diário de reconciliação.
- **Webhook** — o Ticketz encaminha o payload do webhook do provedor para o seu endpoint para que você o valide e informe ao Ticketz se a fatura foi paga ou expirada.
- **Verificar status** — o Ticketz pede ao seu endpoint o status atual de uma fatura em aberto.
- **Reportar detalhes do driver** — o Ticketz pede ao seu endpoint os campos dinâmicos, modos suportados e operações suportadas em uma única chamada `getDriverDetails`. O resultado é cacheado e reutilizado até um refresh forçado.

Seu endpoint é responsável por toda a lógica específica do provedor: autenticação, chamadas de API, validação de assinaturas, idempotência, etc.

O driver externo também suporta os seguintes recursos avançados:

- **Campos de configuração dinâmicos** — seu endpoint pode declarar campos adicionais de configuração que aparecem na UI do Ticketz. Eles são retornados dentro de `getDriverDetails`.
- **Arquivos de certificado privados** — certificados enviados são armazenados de forma segura em `backend/private` e enviados ao seu endpoint codificados em base64 a cada chamada RPC.
- **Desabilitar modos** — modos individuais podem ser desabilitados via parâmetros do driver (`_externalDisablePix`, `_externalDisableBoleto`, `_externalDisableCc`, `_externalDisableLink`). Quando `getDriverDetails` reporta os modos suportados, a lista final é a interseção dos modos do endpoint e dos modos habilitados localmente.
- **Detalhes do driver em cache** — a resposta de `getDriverDetails` é cacheada no primeiro uso e persistida até um super usuário chamar `POST /payment-gateways/external/refresh-cache`.

## 2. Habilitando o driver

1. Vá em **Configurações → Gateway de Pagamento**.
2. Selecione **Genérico Externo** (`external`).
3. Salve as configurações obrigatórias:

| Configuração             | Valor recomendado                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------- |
| URL do Endpoint         | `https://your-service.example.com/ticketz-payment-gateway` (obrigatório)               |
| Token de Autenticação   | Um segredo forte compartilhado apenas com seu serviço (enviado como `Authorization: Bearer <token>`) |
| Habilitar assinaturas    | `"true"` para criar assinaturas recorrentes via `createSubscription`.                   |

Quando as assinaturas estiverem habilitadas, inclua também `getSubscriptionStatus` no array `operations` retornado por `getDriverDetails` para que o Ticketz possa reconciliar o status da assinatura todos os dias.

Após salvar a URL do Endpoint, o driver carrega todos os metadados do seu endpoint com uma única chamada RPC `getDriverDetails` na primeira vez que for necessário. Os botões **Carregar campos** e **Carregar modos** agora leem desse cache. Para forçar o driver a consultar o endpoint novamente (por exemplo, após alterar os campos ou modos suportados do seu lado), um super usuário pode chamar:

```http
POST /payment-gateways/external/refresh-cache
```

A URL do webhook que seu provedor deve chamar é:

```
https://<seu-backend-ticketz>/subscription/webhook
```

## 3. Protocolo RPC

Todas as chamadas são requisições `POST` ao seu endpoint com `Content-Type: application/json`.

### Envelope comum de requisição

```json
{
  "operation": "create | createSubscription | webhook | checkStatus | expire | getDriverDetails | getSubscriptionStatus",
  "driver": "external",
  "callbackUrl": "https://<seu-backend-ticketz>/subscription/webhook",
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

Os campos são preenchidos conforme a operação:

| Operação                   | Campos preenchidos                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `create`                   | `invoiceId`, `price`, `paymentMethod`, `mode`, `cardData`, `company`, `invoice`, `currentSettings`, `fileData` |
| `createSubscription`       | Mesmo que `create`.                                                                                           |
| `syncSubscriptionPayment`  | `invoiceId`, `txId`, `subscriptionId`, `paymentMethod`, `company`, `invoice`, `currentSettings`, `fileData`    |
| `webhook`                  | `webhookBody`, `webhookHeaders`, `webhookQuery`, `currentSettings`, `fileData`                                 |
| `checkStatus`              | `invoiceId`, `txId`, `paymentMethod`, `invoice`, `currentSettings`, `fileData`                                |
| `expire`                   | `invoiceId`, `txId`, `currentSettings`, `fileData`                                                             |
| `getSubscriptionStatus`    | `subscriptionId`, `currentSettings`, `fileData`                                                                |
| `getDriverDetails`         | `currentSettings`, `fileData`                                                                                 |

### Envelope comum de resposta

```json
{
  "success": true,
  "errorCode": "ERR_MY_CUSTOM",
  "errorMessage": "Erro legível",
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

Quando `success` é `false` em uma operação `create`, o Ticketz retorna uma resposta `400` ao frontend com:

```json
{
  "error": "ERR_MY_CUSTOM",
  "message": "Erro legível"
}
```

`errorCode` e `errorMessage` são ambos opcionais. Se `errorMessage` for fornecido, ele é exibido diretamente no toast do frontend. Se apenas `errorCode` for fornecido, o frontend tenta traduzi-lo; caso contrário, exibe o próprio código.

`fields` é retornado dentro de `getDriverDetails`; os nomes dos campos retornados **não** devem incluir o prefixo `_external` — o Ticketz o adiciona automaticamente.

## 4. Operações em detalhe

### 4.1 `create`

O Ticketz envia esta operação quando o usuário solicita uma nova cobrança.

**Exemplo de requisição:**

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

**Resposta esperada para PIX:**

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

**Resposta esperada para boleto:**

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

O Ticketz armazena `txId`, `paymentMethod`, `payGwData` (como string JSON) e `paymentData` na fatura. `payGwData` e `paymentData` são opcionais; se omitidos, o Ticketz constrói `paymentData` a partir dos campos de boleto/PIX. Quando uma cobrança expira ou é invalidada, o Ticketz marca a fatura como `expired` e registra `expiredAt` em `paymentData` para fins de auditoria.

**Semântica dos campos de data:**

- Use `expireAt` para cobranças de curta duração, como Pix. O frontend renderiza uma contagem regressiva ao vivo e pode expirar a cobrança automaticamente.
- Use `dueDate` para cobranças de longo prazo, como boleto. O frontend a exibe como uma data de calendário em vez de contagem regressiva.
- Quando ambos os campos são retornados, o Ticketz mantém apenas o mais relevante:
  - cobranças `pix` mantêm `expireAt`.
  - boletos e demais cobranças mantêm `dueDate`.
  - A resposta da API e o `paymentData` armazenado conterão apenas o campo escolhido.

### 4.2 `webhook`

Seu provedor envia um webhook ao Ticketz, e o Ticketz o encaminha para o seu endpoint.

**Exemplo de requisição:**

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

**Resposta esperada:**

```json
{
  "success": true,
  "status": "paid",
  "txId": "external-tx-123",
  "value": 99.9
}
```

Valores permitidos para `status`:

- `paid` — `PaymentGatewayServices` localiza a fatura em aberto pelo `txId`, verifica se o `value` pago é ao menos o valor da fatura, marca a fatura como paga e estende a data de vencimento da empresa.
- `expired` — `PaymentGatewayServices` localiza a fatura em aberto pelo `txId`, marca a fatura como `expired` e registra `expiredAt` em `paymentData` para fins de auditoria.
- `ignored` — o Ticketz não faz nada (use para eventos de ping, duplicados, etc.).

Para `paid` e `expired`, `txId` é obrigatório para que o Ticketz encontre a fatura internamente, a menos que um `subscriptionId` seja fornecido. Quando `subscriptionId` está presente e `txId` é desconhecido, o Ticketz resolve a fatura em aberto mais antiga com aquele id de assinatura, atualiza seu `txId` e processa o pagamento. O driver em si não acessa a tabela `Invoices`; ele apenas reporta `txId`, `subscriptionId` e `value`. O `value` pago é opcional; quando omitido, o valor da fatura é assumido. Se o valor pago for menor que o valor da fatura, o webhook é tratado como `ignored`. Se o valor pago for maior que o valor da fatura, a diferença é armazenada na fatura como `creditBalance` e aplicada como desconto na próxima fatura de assinatura.

#### Resposta de webhook personalizada

Alguns provedores exigem uma resposta HTTP específica quando entregam um webhook. Por padrão, o Ticketz responde ao provedor com `{ "ok": true }`. Você pode sobrescrever isso incluindo um objeto `webhookResponse` na sua resposta de `webhook`:

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

- `statusCode` — código HTTP que o Ticketz envia de volta. Padrão `200` quando omitido.
- `body` — corpo JSON retornado ao provedor.
- `headers` — cabeçalhos de resposta opcionais (objeto com valores string).

Se `webhookResponse` for omitido, o Ticketz mantém a resposta padrão `{ "ok": true }`.

### 4.3 `checkStatus`

O Ticketz chama esta operação para faturas em aberto durante a verificação periódica, quando um admin solicita manualmente um refresh de status, e quando o usuário clica em **Pagar** em uma fatura que já possui uma cobrança em aberto.

**Exemplo de requisição:**

```json
{
  "operation": "checkStatus",
  "driver": "external",
  "callbackUrl": "https://ticketz.example.com/subscription/webhook",
  "txId": "external-tx-123",
  "paymentMethod": "pix"
}
```

**Resposta esperada:**

```json
{
  "success": true,
  "status": "paid"
}
```

Valores permitidos para `status` são `paid`, `expired` e `ignored`. Se o status da resposta for `paid`, o Ticketz executa o mesmo fluxo de pagamento usado pelos drivers nativos. Se o status da resposta for `expired`, o Ticketz marca a fatura como `expired` e registra `expiredAt` em `paymentData`.

### 4.4 `expire`

Reservado para uso futuro. O Ticketz pode chamar esta operação quando uma fatura é explicitamente cancelada. Seu endpoint não deve depender disso hoje.

### 4.5 `getDriverDetails`

Operação única usada para popular o cache do driver. O Ticketz a chama no primeiro uso e cacheia a resposta até um super usuário forçar um refresh. A resposta deve incluir `fields`, `modes` e `operations`.

> O array `fields` segue o mesmo schema usado pelo componente `DynamicForm` do frontend. Veja [Campos de formulário dinâmico]({{ '/pt-br/dynamic-form-fields/' | relative_url }}) para a referência completa das propriedades e exemplos prontos para copiar.

**Exemplo de requisição:**

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

**Resposta esperada:**

```json
{
  "success": true,
  "fields": [
    {
      "name": "tenantId",
      "title": "Tenant ID",
      "description": "Tenant retornado pelo fluxo OAuth do provedor",
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

Chamada quando `_externalEnableSubscriptions` é `"true"` e o usuário solicita uma nova cobrança. O payload da requisição é idêntico ao de `create`, mas o Ticketz espera um `subscriptionId` na resposta para conseguir casar futuras renovações de webhook com a empresa.

**Resposta esperada:**

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

A validação é similar à de `create`, mas `subscriptionId` é obrigatório. Para assinaturas via PIX e boleto, os dados do primeiro pagamento (`qrcode` ou `boletoUrl`) também podem ser retornados para que o usuário pague imediatamente.

### 4.7 `syncSubscriptionPayment`

Chamada diariamente para toda fatura em aberto que possui um `subscriptionId`, e também quando o admin clica em **Sincronizar pagamento** na lista de faturas. Seu endpoint deve consultar o provedor sobre o próximo pagamento pendente/futuro da assinatura e retornar os dados pagáveis.

**Resposta esperada quando existe um pagamento pendente:**

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

**Resposta esperada quando não há pagamento pendente disponível:**

```json
{
  "success": true
}
```

Quando `txId` é omitido, o Ticketz trata a resposta como "nenhum dado disponível" e deixa a fatura inalterada. Quando `txId` está presente, a resposta é validada como uma resposta de `create` e a fatura é atualizada com o novo `txId`, `paymentMethod`, `payGwData` e `paymentData`. Isso permite que o frontend exiba a cobrança em aberto (QR Code PIX, código de barras do boleto ou link de checkout) em vez de gerar uma nova.

### 4.8 `getSubscriptionStatus`

Chamada diariamente para toda empresa que possui uma assinatura externa ativa. Seu endpoint deve consultar o provedor sobre o status atual da assinatura e retornar um dos seguintes valores no campo `status`:

- `active` — a assinatura está ativa; o Ticketz mantém a empresa marcada como assinante.
- `inactive` (ou `canceled`) — a assinatura não está mais ativa; o Ticketz atualiza a empresa localmente para que a geração de faturas volte ao ciclo de cobrança regular.

**Resposta esperada:**

```json
{
  "success": true,
  "status": "active"
}
```

Retornar `success: true` sem o campo `status`, ou retornar `success: false`, é tratado como "status desconhecido" e a empresa é deixada inalterada.

## 5. Cabeçalhos de autenticação

O Ticketz envia o token configurado no cabeçalho `Authorization`:

```http
Authorization: Bearer <token>
```

Seu endpoint deve validar esse token e rejeitar requisições desconhecidas.

## 6. Comportamento de retry e timeout

- O driver usa um timeout fixo de **30 segundos**.
- O driver faz até **3 tentativas** com atrasos de **1s, 3s e 5s**.
- Retries só ocorrem em falhas transitórias: erros de rede, respostas HTTP `5xx` ou HTTP `429 Too Many Requests`.
- Respostas HTTP `4xx` e respostas de sucesso com `success: false` **não** são retentadas.
- Cada tentativa envia um novo `idempotencyKey` (UUID v4); seu endpoint pode usá-lo para evitar cobranças duplicadas.
- Webhooks são respondidos com `{ ok: true }` ao provedor por padrão. Se sua resposta de `webhook` incluir `webhookResponse`, o Ticketz encaminha esse código de status, corpo e cabeçalhos ao provedor.

## 7. Validação de resposta

O Ticketz valida toda resposta de sucesso antes de aplicá-la. Se seu endpoint retornar um payload malformado, a operação é abortada e o usuário vê um erro `ERR_EXTERNAL_*`.

| Operação                   | Campos obrigatórios em `success: true`                                                                                                                                                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create`                   | `paymentMethod` (`pix`, `boleto` ou `credit_card`), `txId` não vazio, e os dados de pagamento exigidos pelo modo (`qrcode.qrcode` para PIX, `boletoUrl` para boleto, ou `checkoutUrl` para `link`). `paymentData` pode ser usado no lugar dos campos no topo. |
| `createSubscription`       | `paymentMethod`, `subscriptionId` não vazio, e as mesmas regras de dados de pagamento de `create`.                                                                                                                                                         |
| `syncSubscriptionPayment`  | Quando `txId` está presente, mesma validação de `create`. Quando `txId` é omitido, a resposta significa "nenhum pagamento pendente disponível" e é aceita sem validação adicional.                                                                          |
| `webhook`                  | `status` (`paid`, `expired` ou `ignored`). `paid`/`expired` exigem `txId` e/ou `subscriptionId`.                                                                                                                                                           |
| `checkStatus`              | `status` (`paid`, `expired` ou `ignored`). Uma resposta `expired` marca a fatura como `expired` e registra `expiredAt` em `paymentData`.                                                                                                                   |
| `getSubscriptionStatus`    | `status` (`active`, `inactive` ou `canceled`). Outros valores são tratados como desconhecidos.                                                                                                                                                             |
| `getDriverDetails`         | `fields`, `modes` e `operations` devem ser arrays válidos. `modes` só pode conter `pix`, `boleto`, `cc` ou `link`.                                                                                                                                         |

Quando `success: false`, inclua `errorCode` e opcionalmente `errorMessage`. `errorCode` é encaminhado ao frontend e traduzido a partir de `backendErrors`.

## 8. Arquivos de certificado privados

Se o driver declarar um campo de arquivo com `extra.file.private: true`, o usuário envia o arquivo via `/settings/privateFile`. O arquivo é salvo em `backend/private`. A cada chamada RPC o driver lê o arquivo e o envia em `fileData` como string base64:

```json
{
  "fileData": {
    "_externalCertFile": "LS0tLS1CRUdJTi..."
  }
}
```

Seu endpoint pode usar esse certificado para autenticação mTLS ou para assinar requisições ao provedor. Não armazene o arquivo bruto em `payGwData`.

## 9. Idempotência

Seu endpoint deve ser idempotente para `create`, especialmente porque o Ticketz faz retry em falha. Um padrão comum é:

1. Verificar se `txId` ou `invoiceId` já possui uma cobrança ativa no seu provedor.
2. Se sim, retornar os dados existentes (você pode setar `_reused: true` na resposta).
3. Se não, criar uma nova cobrança.

## 10. Exemplo mínimo (Node.js / Express)

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

## 11. Integração com o frontend

A tela de configurações do Gateway de Pagamento carrega a lista de drivers em `GET /payment-gateways/drivers`. Para o driver `external` ela renderiza os campos base mais quaisquer campos dinâmicos retornados por `getDriverDetails`. Campos de arquivo usam o upload existente em `/settings/privateFile`, e campos de ação disparam `POST /payment-gateways/external/fields`, que retorna os campos em cache. Para forçar um refresh dos metadados em cache, um super usuário pode chamar `POST /payment-gateways/external/refresh-cache`.

O checkout carrega o driver ativo em `GET /payment-gateways/active` e renderiza um seletor de rádio para cada modo suportado retornado em `supportedModes`, **exceto `link`**. O modo `link` nunca é exibido como opção selecionável; se for o único modo suportado pelo driver ativo, o checkout cria a cobrança e redireciona o usuário para o `checkoutUrl` retornado pelo driver.

Quando apenas um modo que não seja `link` está disponível, o seletor de rádio é ocultado e o checkout avança automaticamente para aquele método:

- `pix` / `boleto` — a cobrança é criada imediatamente e o usuário é levado à tela de sucesso.
- `cc` — o `CreditCardForm` é exibido e o usuário preenche os dados do cartão antes de clicar em **Pagar**.

Para o modo `cc` o `CreditCardForm` nativo captura os dados do cartão e os envia em `cardData`. Para o modo `link` o frontend redireciona para o `checkoutUrl` retornado pelo driver.

### Reutilizando cobranças em aberto existentes

Quando uma fatura em aberto já possui `paymentData` com QR Code, URL de boleto ou link de checkout, a lista de faturas exibe os botões **Ver Pix**, **Ver Boleto** ou **Pagar Externo** em vez de gerar uma cobrança duplicada. Clicar em **Pagar** em tal fatura primeiro chama `POST /invoices/:id/check-payment` para confirmar que a cobrança ainda é válida:

- Se a cobrança está `paid` → a fatura é marcada como paga e o usuário vê um toast de confirmação.
- Se a cobrança está `expired` → os dados da cobrança são limpos e o checkout abre para o usuário gerar uma nova cobrança.
- Se a cobrança ainda está em aberto → um modal mostra o QR Code PIX, código de barras do boleto ou link de checkout existente.

## 12. Troubleshooting

| Sintoma                                 | Causa provável                                                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERR_EXTERNAL_ENDPOINT_NOT_CONFIGURED`  | `_externalEndpointUrl` está vazio.                                                                                                          |
| `ERR_EXTERNAL_RPC_CALL_FAILED`          | Erro de rede ou seu endpoint retornou 5xx após os retries.                                                                                  |
| Webhook não dispara                     | O provedor está chamando a URL errada; verifique `callbackUrl` e regras de firewall.                                                        |
| Fatura não marcada como paga            | Sua resposta de `webhook` não incluiu `status: "paid"` mais um `txId` válido, ou o `value` pago é menor que o valor da fatura.                |
| `ERR_EXTERNAL_MISSING_PAYMENT_DATA`     | Resposta de `create` sem `qrcode` para PIX, `boletoUrl` para boleto, ou `checkoutUrl` para `link` (ou o equivalente dentro de `paymentData`). |
| `ERR_EXTERNAL_INVALID_FIELDS`           | Array `fields` de `getDriverDetails` inválido ou um campo sem `name`, `title`, `type` ou `required`.                                        |
| `ERR_EXTERNAL_INVALID_STATUS`           | Resposta de `webhook` ou `checkStatus` com `status` diferente de `paid`, `expired` ou `ignored`.                                            |
| `ERR_EXTERNAL_INVALID_MODES`            | Array `modes` de `getDriverDetails` não é um array ou contém valores diferentes de `pix`, `boleto`, `cc` ou `link`.                         |
| `ERR_EXTERNAL_INVALID_OPERATIONS`       | Array `operations` de `getDriverDetails` não é um array.                                                                                   |
| `ERR_EXTERNAL_MISSING_SUBSCRIPTION_ID`  | Resposta de `createSubscription` não incluiu um `subscriptionId` não vazio.                                                                  |
| Create sempre cria cobranças duplicadas  | Seu endpoint não é idempotente; verifique `invoiceId`/`txId` antes de criar.                                                                |
| Modo não aparece no checkout            | O modo está desabilitado por `_externalDisable*` ou não foi retornado por `getDriverDetails.modes`.                                         |
| Assinatura não criada                   | `_externalEnableSubscriptions` não é `"true"` ou `getDriverDetails.operations` não inclui `createSubscription`.                             |

## 13. Checklist de segurança

- [ ] Use HTTPS para a URL do endpoint e do webhook.
- [ ] Valide o token de autorização em toda requisição.
- [ ] Valide assinaturas de webhook do provedor dentro do seu endpoint.
- [ ] Trate `invoiceId` e `txId` como strings opacas.
- [ ] Não exponha credenciais internas do provedor em `payGwData`.
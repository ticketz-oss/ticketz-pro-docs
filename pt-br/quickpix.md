---
title: QuickPix
lang: pt-br
slug: quickpix
description: Endpoints, regras e comportamento da página de pagamento do QuickPix.
---

O QuickPix gerencia registros de cobranças Pix e suporta criação, consulta, listagem e atualização do status de pagamento.

## Modelo de dados

A tabela `QuickPix` contém:

- `id`: identificador único do registro
- `companyId`: identificador da empresa vinculada
- `key`: chave aleatória única do registro
- `pixcode`: código Pix da cobrança
- `expiration`: data de expiração do código Pix
- `isPaid`: status do pagamento, padrão `false`
- `metadata`: JSON opcional com dados extras
- `createdAt`: data de criação
- `updatedAt`: data da última atualização

## Rotas disponíveis

| Método  | Endpoint             | Descrição                                              |
| ------- | -------------------- | ------------------------------------------------------ |
| `POST`  | `/quickpix`          | Cria um novo registro Pix e retorna a URL de pagamento |
| `GET`   | `/quickpix/:id`      | Consulta um registro pelo `id` interno                 |
| `GET`   | `/quickpix/k/:key`   | Consulta um registro pela `key` pública                |
| `GET`   | `/quickpix`          | Lista registros, com filtro opcional por metadados     |
| `PATCH` | `/quickpix/:id/paid` | Marca um registro como pago                            |

## Regras de autenticação

Todas as rotas, exceto `/quickpix/k/:key`, exigem `apiTokenAuth`, `isAuth` e `isAdmin`.

## Regras de negócio

- A `key` é gerada automaticamente com 9 caracteres aleatórios.
- Cada registro fica associado a um `companyId` específico.
- A listagem aceita `metadataKey` e `metadataValue` para filtros por metadados.

## Exemplo de requisição

```text
POST /quickpix
{
  "pixcode": "00020126330014BR.GOV.BCB.PIX...",
  "expiration": "2023-12-31T23:59:59Z",
  "metadata": {
    "orderId": "12345",
    "customerName": "João Silva"
  }
}
```

Exemplo de resposta:

```json
{
  "url": "https://frontend.example.com/pix.html?k=ABC123XYZ",
  "id": "1",
  "companyId": 10,
  "key": "ABC123XYZ",
  "pixcode": "00020126330014BR.GOV.BCB.PIX...",
  "expiration": "2023-12-31T23:59:59Z",
  "isPaid": false,
  "metadata": {
    "orderId": "12345",
    "customerName": "João Silva"
  },
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

## Comportamento da página de pagamento

A URL de pagamento é gerada dinamicamente quando um registro QuickPix é criado. Essa página foi pensada para ser simples para o usuário final e inclui:

- QR Code gerado a partir do payload Pix
- código Pix para copiar e colar
- contagem regressiva até a expiração, usando `expiration`
- verificação periódica do pagamento via `/quickpix/k/:key`
- mensagens adaptadas ao idioma do navegador em português, inglês e espanhol
- instruções claras tanto para leitura por QR quanto para copia e cola

Exemplo de URL:

```text
https://frontend.example.com/pix.html?k=ABC123XYZ
```

O parâmetro `k` é a chave pública única usada para carregar a cobrança no backend.

---
title: QuickPix
lang: en
slug: quickpix
description: QuickPix endpoints, rules, and payment page behavior.
---

QuickPix manages Pix charge records and supports creation, lookup, listing, and payment updates.

## Data model

The `QuickPix` table contains:

- `id`: unique record identifier
- `companyId`: company identifier linked to the record
- `key`: random unique key used to identify the record
- `pixcode`: Pix code stored for payment
- `expiration`: Pix code expiration date
- `isPaid`: payment status, default `false`
- `metadata`: optional JSON with extra data
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

## Available routes

| Method  | Endpoint             | Description                                                  |
| ------- | -------------------- | ------------------------------------------------------------ |
| `POST`  | `/quickpix`          | Create a new Pix record and return the generated payment URL |
| `GET`   | `/quickpix/:id`      | Get a record by internal `id`                                |
| `GET`   | `/quickpix/k/:key`   | Get a record by public `key`                                 |
| `GET`   | `/quickpix`          | List records, optionally filtered by metadata                |
| `PATCH` | `/quickpix/:id/paid` | Mark a record as paid                                        |

## Authentication rules

All routes except `/quickpix/k/:key` require `apiTokenAuth`, `isAuth`, and `isAdmin`.

## Business rules

- The `key` is generated automatically with 9 random characters.
- Each record is linked to a specific `companyId`.
- Metadata filters can be applied using `metadataKey` and `metadataValue` query parameters on the list route.

## Example request

```text
POST /quickpix
{
  "pixcode": "00020126330014BR.GOV.BCB.PIX...",
  "expiration": "2023-12-31T23:59:59Z",
  "metadata": {
    "orderId": "12345",
    "customerName": "John Smith"
  }
}
```

Example response:

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
    "customerName": "John Smith"
  },
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

## Payment page behavior

The payment URL is generated dynamically when a QuickPix record is created. That page is designed to be simple for the end user and includes:

- a QR code generated from the Pix payload
- a copy-and-paste Pix code
- a countdown to expiration based on `expiration`
- periodic payment checks through `/quickpix/k/:key`
- browser-language-aware messages in Portuguese, English, and Spanish
- clear instructions for both QR scan and copy-and-paste flows

Example URL:

```text
https://frontend.example.com/pix.html?k=ABC123XYZ
```

The `k` parameter is the unique public key used to load the charge from the backend.

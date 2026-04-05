---
title: QuickPix
lang: es
slug: quickpix
description: Endpoints, reglas y comportamiento de la página de pago de QuickPix.
---

QuickPix gestiona registros de cobros Pix y permite crear, consultar, listar y actualizar el estado del pago.

## Modelo de datos

La tabla `QuickPix` contiene:

- `id`: identificador único del registro
- `companyId`: identificador de la empresa asociada
- `key`: clave aleatoria única del registro
- `pixcode`: código Pix del cobro
- `expiration`: fecha de vencimiento del código Pix
- `isPaid`: estado del pago, por defecto `false`
- `metadata`: JSON opcional con datos extra
- `createdAt`: fecha de creación
- `updatedAt`: fecha de la última actualización

## Rutas disponibles

| Método  | Endpoint             | Descripción                                          |
| ------- | -------------------- | ---------------------------------------------------- |
| `POST`  | `/quickpix`          | Crea un nuevo registro Pix y devuelve la URL de pago |
| `GET`   | `/quickpix/:id`      | Consulta un registro por el `id` interno             |
| `GET`   | `/quickpix/k/:key`   | Consulta un registro por la `key` pública            |
| `GET`   | `/quickpix`          | Lista registros, con filtro opcional por metadatos   |
| `PATCH` | `/quickpix/:id/paid` | Marca un registro como pagado                        |

## Reglas de autenticación

Todas las rutas, excepto `/quickpix/k/:key`, requieren `apiTokenAuth`, `isAuth` e `isAdmin`.

## Reglas de negocio

- La `key` se genera automáticamente con 9 caracteres aleatorios.
- Cada registro queda vinculado a un `companyId` específico.
- La lista admite `metadataKey` y `metadataValue` para filtrar por metadatos.

## Ejemplo de solicitud

```text
POST /quickpix
{
  "pixcode": "00020126330014BR.GOV.BCB.PIX...",
  "expiration": "2023-12-31T23:59:59Z",
  "metadata": {
    "orderId": "12345",
    "customerName": "Juan Silva"
  }
}
```

Ejemplo de respuesta:

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
    "customerName": "Juan Silva"
  },
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-01T12:00:00Z"
}
```

## Comportamiento de la página de pago

La URL de pago se genera dinámicamente cuando se crea un registro QuickPix. Esa página está pensada para ser simple para el usuario final e incluye:

- código QR generado a partir del payload Pix
- código Pix para copiar y pegar
- cuenta regresiva hasta el vencimiento usando `expiration`
- verificación periódica del pago mediante `/quickpix/k/:key`
- mensajes adaptados al idioma del navegador en portugués, inglés y español
- instrucciones claras tanto para escanear el QR como para usar copia y pega

Ejemplo de URL:

```text
https://frontend.example.com/pix.html?k=ABC123XYZ
```

El parámetro `k` es la clave pública única usada para cargar el cobro desde el backend.

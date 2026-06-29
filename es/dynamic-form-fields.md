---
title: Campos de Formulario Dinamico
lang: es
slug: dynamic-form-fields
description: Referencia del schema de campos usado por DynamicForm y por el array fields del getDriverDetails de los drivers externos.
---

Ticketz PRO renderiza formularios dinámicos de configuración a partir de un schema declarativo de campos. El mismo schema alimenta el array `fields` devuelto por la operación `getDriverDetails` del [driver de pago externo]({{ '/es/external-payment-driver/' | relative_url }}) y del [driver de NFS-e externa]({{ '/es/external-nfse-driver/' | relative_url }}), permitiendo que cualquier endpoint declare la UI de configuraciones que necesita sin tocar el frontend.

Esta página documenta todas las propiedades de un objeto de campo, los valores de `type` soportados y ejemplos listos para copiar.

## Objeto de campo

Cada entrada del array `fields` es un objeto con las siguientes propiedades:

| Propiedad               | Tipo                                  | Obligatorio | Aplica a                                     | Descripción                                                                                                                                                                                                                       |
| ---------------------- | ------------------------------------- | ----------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                 | string                                | sí          | todos (excepto `section`)                    | Identificador del campo. Para drivers externos, Ticketz añade el prefijo automáticamente (p. ej. `_external`), así que **no** incluyas el prefijo aquí.                                                                          |
| `title`                | string                                | sí          | todos                                        | Etiqueta mostrada junto al input. Usa la clave i18n `${i18nBase}.${name}` cuando se traduce.                                                                                                                                     |
| `description`          | string                                | no          | todos                                        | Texto de ayuda / descripción. No lo renderiza directamente `DynamicForm`, pero lo consumen las herramientas OpenAPI y la documentación de los drivers externos.                                                                   |
| `type`                 | enum (ver abajo)                      | sí          | todos                                        | Tipo de input que define el renderizado.                                                                                                                                                                                          |
| `required`             | boolean                               | sí          | todos                                        | Marca el campo como obligatorio.                                                                                                                                                                                                  |
| `lgWidth`              | entero (1–12)                         | no          | todos (excepto `section`)                    | Ancho de columna en pantallas grandes. Por defecto `4`.                                                                                                                                                                           |
| `mdWidth`              | entero (1–12)                         | no          | todos (excepto `section`)                    | Ancho de columna en pantallas medianas. Usa `lgWidth` como fallback.                                                                                                                                                              |
| `smWidth`             | entero (1–12)                         | no          | todos (excepto `section`)                    | Ancho de columna en pantallas pequeñas. Usa `mdWidth` → `lgWidth` → `6` como fallback.                                                                                                                                            |
| `default`              | any                                   | no          | todos (excepto `section`)                    | Valor por defecto aplicado cuando el campo está vacío y `applyDefaults` está habilitado.                                                                                                                                          |
| `defaultValue`         | any                                   | no          | todos (excepto `section`)                    | Igual que `default`, pero tiene precedencia cuando ambos están presentes.                                                                                                                                                         |
| `options`              | array de `{ value, label }`           | no          | `select`                                     | Opciones renderizadas en el dropdown.                                                                                                                                                                                             |
| `forceGenerate`        | boolean                               | no          | `uuid`                                       | Cuando es `true`, el campo se rellena automáticamente con un nuevo UUID al montar si está vacío.                                                                                                                                 |
| `readOnly`             | boolean                               | no          | `text`, `number`, `color`, `uuid`            | Renderiza el input como solo lectura.                                                                                                                                                                                            |
| `error`                | boolean                               | no          | `text`, `textarea`, `number`, `select`       | Marca el input como inválido (borde rojo).                                                                                                                                                                                       |
| `helperText`           | string                                | no          | `text`, `textarea`, `number`, `select`       | Texto de ayuda mostrado bajo el input. Pasa por `i18n.t()`.                                                                                                                                                                       |
| `extra`                | object                                | no          | `button`, `file`                             | Configuración extra. Ver abajo.                                                                                                                                                                                                  |
| `extra.action`         | object                                | no          | `button`                                     | Acción disparada al hacer clic en el botón.                                                                                                                                                                                      |
| `extra.action.type`    | `"fetch"`                             | sí          | `button`                                     | Hoy solo se soporta `fetch`.                                                                                                                                                                                                      |
| `extra.action.label`   | string                                | sí          | `button`                                     | Etiqueta del botón (sobrescribe `title`).                                                                                                                                                                                        |
| `extra.action.method`  | `"GET"` \| `"POST"`                   | no          | `button`                                     | Método HTTP. Por defecto `POST`.                                                                                                                                                                                                 |
| `extra.action.url`     | string (uri)                          | sí          | `button`                                     | URL a llamar al hacer clic en el botón.                                                                                                                                                                                          |
| `extra.action.dependsOn` | string[]                           | no          | `button`                                     | Nombres de otros campos cuyos valores deben enviarse con la petición.                                                                                                                                                            |
| `extra.action.headers` | object (valores string)               | no          | `button`                                     | Cabeceras HTTP extra a enviar.                                                                                                                                                                                                   |
| `extra.file`           | object                                | no          | `file`                                       | Configuración del input de archivo.                                                                                                                                                                                              |
| `extra.file.accept`    | string                                | no          | `file`                                       | Atributo `accept` del input (tipos MIME o extensiones). Por defecto `*`.                                                                                                                                                         |
| `extra.file.private`   | boolean                               | no          | `file`                                       | Cuando es `true`, el archivo se sube vía `/settings/privateFile` y se almacena en `backend/private`. Los drivers externos lo reciben codificado en base64 en `fileData`.                                                          |
| `sectionTitle`         | string                                | no          | `section`                                    | Título renderizado para el divisor de sección. Usa `title` como fallback.                                                                                                                                                        |
| `sectionDescription`   | string                                | no          | `section`                                    | Subtítulo renderizado bajo el título de la sección. Pasa por `i18n.t()`.                                                                                                                                                         |

## Valores de `type` soportados

| Type       | Renderiza                                                              | Observaciones                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `text`     | Input de texto de una línea                                            | Soporta `readOnly`, `error`, `helperText`.                                                                                                             |
| `textarea` | Input de texto multilínea (4 filas)                                   | Soporta `error`, `helperText`.                                                                                                                         |
| `number`   | Input numérico                                                          | Soporta `readOnly`, `error`, `helperText`.                                                                                                             |
| `select`   | Dropdown                                                                | Requiere `options`. Soporta `error`, `helperText`.                                                                                                     |
| `checkbox` | Switch                                                                  | Se almacena como booleano.                                                                                                                            |
| `json`     | Editor visual de JSON                                                   | El valor se almacena como string JSON formateado.                                                                                                      |
| `object`   | Editor visual de JSON                                                   | El valor se almacena como objeto parseado (no string).                                                                                                |
| `color`    | Input de texto con muestra de color y dialog de color picker           | Por defecto `#808080`. Soporta `readOnly`.                                                                                                              |
| `uuid`     | Input de texto con botones de generar y copiar                         | Soporta `forceGenerate` y `readOnly`.                                                                                                                  |
| `file`     | Input de texto solo lectura con botones de subida y limpiar            | Usa `extra.file.accept` y `extra.file.private`.                                                                                                        |
| `button`   | Botón outlined que dispara una acción                                  | Usa `extra.action`. La acción se reenvía al padre vía `onAction`.                                                                                      |
| `section`  | Divisor con título y descripción opcional                              | No produce valor. Úsalo para agrupar campos relacionados.                                                                                              |

## Comportamiento de ancho

`DynamicForm` usa un grid responsivo de 12 columnas. La resolución de ancho por campo es:

- Pantallas grandes (`md` breakpoint): `lgWidth` → por defecto `4`.
- Pantallas medianas (`sm` breakpoint): `mdWidth` → `lgWidth` → por defecto `4`.
- Pantallas pequeñas (`xs` breakpoint): `smWidth` → `mdWidth` → `lgWidth` → por defecto `6`.

Los campos `section` siempre ocupan las 12 columnas completas.

## Valores por defecto y UUIDs forzados

Cuando el formulario se monta con `applyDefaults: true`, cada campo que no sea `section` cuyo valor actual esté vacío (`undefined`, `null` o string en blanco) se rellena con `defaultValue` (preferente) o `default`. Los valores existentes nunca se sobrescriben.

Para campos `uuid` con `forceGenerate: true`, se genera un nuevo UUID automáticamente al montar siempre que el campo esté vacío, incluso si `applyDefaults` no está habilitado.

## Tratamiento de archivos

- **Archivos públicos** (`extra.file.private` falso): el archivo se lee en el cliente como data URL y se almacena directamente en los datos del formulario.
- **Archivos privados** (`extra.file.private: true`): el archivo se sube vía callback `onFileUpload` (que llama a `/settings/privateFile` en la pantalla de configuraciones). Solo el nombre del archivo subido se almacena en los datos del formulario; el contenido binario vive en `backend/private`. Los drivers externos reciben el archivo codificado en base64 en el envelope `fileData` en cada llamada RPC.

## Botones de acción

Los campos `button` disparan una `extra.action` de tipo `fetch`. El componente padre recibe el campo y la acción a través del callback `onAction` y es responsable de realizar la petición HTTP (por ejemplo, la pantalla de configuraciones del driver externo llama a `POST /payment-gateways/external/fields` para refrescar los campos en caché). `dependsOn` lista los nombres de otros campos cuyos valores actuales deben enviarse con la petición.

## Ejemplos

### Campo de texto con helper text

```json
{
  "name": "providerAccountId",
  "title": "Provider Account ID",
  "description": "Account identifier returned by the provider",
  "type": "text",
  "lgWidth": 12,
  "required": true,
  "helperText": "Encuentra este valor en el panel del proveedor en Settings > API."
}
```

### Campo select

```json
{
  "name": "environment",
  "title": "Environment",
  "type": "select",
  "lgWidth": 6,
  "required": true,
  "defaultValue": "production",
  "options": [
    { "value": "sandbox", "label": "Sandbox" },
    { "value": "production", "label": "Production" }
  ]
}
```

### Checkbox

```json
{
  "name": "enableSubscriptions",
  "title": "Enable subscriptions",
  "type": "checkbox",
  "lgWidth": 12,
  "required": false,
  "default": false
}
```

### Number

```json
{
  "name": "timeoutSeconds",
  "title": "Timeout (seconds)",
  "type": "number",
  "lgWidth": 4,
  "required": false,
  "defaultValue": 30
}
```

### UUID con generación forzada

```json
{
  "name": "webhookSecret",
  "title": "Webhook secret",
  "type": "uuid",
  "lgWidth": 12,
  "required": true,
  "forceGenerate": true,
  "readOnly": true
}
```

### Color

```json
{
  "name": "brandColor",
  "title": "Brand color",
  "type": "color",
  "lgWidth": 4,
  "required": false,
  "default": "#808080"
}
```

### JSON

```json
{
  "name": "providerMetadata",
  "title": "Provider metadata",
  "type": "json",
  "lgWidth": 12,
  "required": false,
  "defaultValue": { "region": "br", "timeout": 30 }
}
```

### Archivo de certificado privado

```json
{
  "name": "certFile",
  "title": "mTLS certificate",
  "description": "Certificate used for mutual TLS with the provider",
  "type": "file",
  "lgWidth": 12,
  "required": false,
  "extra": {
    "file": {
      "accept": ".pem,.crt,.key",
      "private": true
    }
  }
}
```

### Botón de acción

```json
{
  "name": "refreshFields",
  "title": "Refresh fields",
  "type": "button",
  "lgWidth": 12,
  "required": false,
  "extra": {
    "action": {
      "type": "fetch",
      "label": "Load fields",
      "method": "POST",
      "url": "/payment-gateways/external/fields",
      "dependsOn": ["endpointUrl", "authToken"]
    }
  }
}
```

### Divisor de sección

```json
{
  "name": "advancedSection",
  "title": "Advanced",
  "type": "section",
  "lgWidth": 12,
  "required": false,
  "sectionTitle": "Advanced options",
  "sectionDescription": "Use these fields only if your provider requires custom tuning."
}
```

### Formulario completo combinando varios tipos de campo

```json
[
  {
    "name": "tenantId",
    "title": "Tenant ID",
    "description": "Tenant returned by the provider OAuth flow",
    "type": "text",
    "lgWidth": 12,
    "required": true
  },
  {
    "name": "environment",
    "title": "Environment",
    "type": "select",
    "lgWidth": 6,
    "required": true,
    "defaultValue": "production",
    "options": [
      { "value": "sandbox", "label": "Sandbox" },
      { "value": "production", "label": "Production" }
    ]
  },
  {
    "name": "timeoutSeconds",
    "title": "Timeout (seconds)",
    "type": "number",
    "lgWidth": 6,
    "required": false,
    "defaultValue": 30
  },
  {
    "name": "enableSubscriptions",
    "title": "Enable subscriptions",
    "type": "checkbox",
    "lgWidth": 12,
    "required": false,
    "default": false
  },
  {
    "name": "advancedSection",
    "title": "Advanced",
    "type": "section",
    "lgWidth": 12,
    "required": false,
    "sectionTitle": "Advanced options",
    "sectionDescription": "Optional provider-specific tuning."
  },
  {
    "name": "certFile",
    "title": "mTLS certificate",
    "type": "file",
    "lgWidth": 12,
    "required": false,
    "extra": { "file": { "accept": ".pem,.crt,.key", "private": true } }
  },
  {
    "name": "refreshFields",
    "title": "Refresh fields",
    "type": "button",
    "lgWidth": 12,
    "required": false,
    "extra": {
      "action": {
        "type": "fetch",
        "label": "Load fields",
        "method": "POST",
        "url": "/payment-gateways/external/fields",
        "dependsOn": ["tenantId", "environment"]
      }
    }
  }
]
```

## Relación con los drivers externos

La operación `getDriverDetails` de ambos drivers externos devuelve un array `fields` que sigue este schema. Ticketz cachea la respuesta y renderiza los campos en la pantalla de configuraciones usando `DynamicForm`. Recuerda:

- Los valores de `name` **no** deben incluir el prefijo `_external` / `_externalNfse` — Ticketz lo añade automáticamente.
- `modes` y `operations` devueltos junto con `fields` se validan por separado (ver la página del [driver de pago externo]({{ '/es/external-payment-driver/' | relative_url }})).
- Para forzar a Ticketz a consultar el endpoint nuevamente tras cambiar los campos, un super usuario puede llamar al endpoint de refresh-cache del driver correspondiente.
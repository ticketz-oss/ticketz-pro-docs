---
title: Dynamic Form Fields
lang: en
slug: dynamic-form-fields
description: Reference for the field schema used by DynamicForm and the getDriverDetails fields array of external drivers.
---

Ticketz PRO renders dynamic configuration forms from a declarative field schema. The same schema powers the `fields` array returned by the `getDriverDetails` operation of the [external payment driver]({{ '/en/external-payment-driver/' | relative_url }}) and the [external NFS-e driver]({{ '/en/external-nfse-driver/' | relative_url }}), so any endpoint can declare the settings UI it needs without touching the frontend.

This page documents every property of a field object, the supported `type` values, and ready-to-copy examples.

## Field object

Each entry in the `fields` array is an object with the following properties:

| Property               | Type                                  | Required | Applies to                                   | Description                                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------- | -------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                 | string                                | yes      | all (except `section`)                       | Field identifier. For external drivers, Ticketz automatically prefixes it (e.g. `_external`), so do **not** include the prefix here.                                                                                       |
| `title`                | string                                | yes      | all                                          | Label shown next to the input. Falls back to the i18n key `${i18nBase}.${name}` when translated.                                                                                                                            |
| `description`          | string                                | no       | all                                          | Helper text / description. Not rendered directly by `DynamicForm`, but consumed by OpenAPI tooling and external driver docs.                                                                                                 |
| `type`                 | enum (see below)                      | yes      | all                                          | Input type that drives rendering.                                                                                                                                                                                            |
| `required`             | boolean                               | yes      | all                                          | Marks the field as required.                                                                                                                                                                                                 |
| `lgWidth`              | integer (1–12)                        | no       | all (except `section`)                       | Grid width on large screens. Default `4`.                                                                                                                                                                                    |
| `mdWidth`              | integer (1–12)                        | no       | all (except `section`)                       | Grid width on medium screens. Falls back to `lgWidth`.                                                                                                                                                                      |
| `smWidth`             | integer (1–12)                        | no       | all (except `section`)                       | Grid width on small screens. Falls back to `mdWidth` → `lgWidth` → `6`.                                                                                                                                                     |
| `default`              | any                                   | no       | all (except `section`)                       | Default value applied when the field is empty and `applyDefaults` is enabled.                                                                                                                                               |
| `defaultValue`         | any                                   | no       | all (except `section`)                       | Same as `default`, but takes precedence when both are present.                                                                                                                                                               |
| `options`              | array of `{ value, label }`           | no       | `select`                                     | Options rendered in the dropdown.                                                                                                                                                                                            |
| `forceGenerate`        | boolean                               | no       | `uuid`                                       | When `true`, the field is auto-filled with a new UUID on mount if empty.                                                                                                                                                    |
| `readOnly`             | boolean                               | no       | `text`, `number`, `color`, `uuid`            | Renders the input as read-only.                                                                                                                                                                                              |
| `error`                | boolean                               | no       | `text`, `textarea`, `number`, `select`       | Marks the input as invalid (red border).                                                                                                                                                                                    |
| `helperText`           | string                                | no       | `text`, `textarea`, `number`, `select`       | Helper text shown under the input. Passed through `i18n.t()`.                                                                                                                                                               |
| `extra`                | object                                | no       | `button`, `file`                             | Extra configuration. See below.                                                                                                                                                                                             |
| `extra.action`         | object                                | no       | `button`                                     | Action triggered when the button is clicked.                                                                                                                                                                                |
| `extra.action.type`    | `"fetch"`                             | yes      | `button`                                     | Only `fetch` is supported today.                                                                                                                                                                                            |
| `extra.action.label`   | string                                | yes      | `button`                                     | Button label (overrides `title`).                                                                                                                                                                                           |
| `extra.action.method`  | `"GET"` \| `"POST"`                   | no       | `button`                                     | HTTP method. Defaults to `POST`.                                                                                                                                                                                             |
| `extra.action.url`     | string (uri)                          | yes      | `button`                                     | URL to call when the button is clicked.                                                                                                                                                                                     |
| `extra.action.dependsOn` | string[]                           | no       | `button`                                     | Names of other fields whose values must be sent with the request.                                                                                                                                                           |
| `extra.action.headers` | object (string values)               | no       | `button`                                     | Extra HTTP headers to send.                                                                                                                                                                                                  |
| `extra.file`           | object                                | no       | `file`                                       | File input configuration.                                                                                                                                                                                                  |
| `extra.file.accept`    | string                                | no       | `file`                                       | `accept` attribute for the file input (MIME types or extensions). Defaults to `*`.                                                                                                                                          |
| `extra.file.private`   | boolean                               | no       | `file`                                       | When `true`, the file is uploaded via `/settings/privateFile` and stored in `backend/private`. External drivers receive it base64-encoded in `fileData`.                                                                  |
| `sectionTitle`         | string                                | no       | `section`                                    | Title rendered for the section divider. Falls back to `title`.                                                                                                                                                              |
| `sectionDescription`   | string                                | no       | `section`                                    | Subtitle rendered under the section title. Passed through `i18n.t()`.                                                                                                                                                       |

## Supported `type` values

| Type       | Renders                                                                 | Notes                                                                                                                                                |
| ---------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`     | Single-line text input                                                  | Supports `readOnly`, `error`, `helperText`.                                                                                                          |
| `textarea` | Multi-line text input (4 rows)                                          | Supports `error`, `helperText`.                                                                                                                       |
| `number`   | Numeric text input                                                       | Supports `readOnly`, `error`, `helperText`.                                                                                                          |
| `select`   | Dropdown                                                                 | Requires `options`. Supports `error`, `helperText`.                                                                                                   |
| `checkbox` | Switch                                                                   | Stored as a boolean.                                                                                                                                 |
| `json`     | Visual JSON editor                                                       | Value is stored as a pretty-printed JSON string.                                                                                                     |
| `object`   | Visual JSON editor                                                       | Value is stored as a parsed object (not stringified).                                                                                                |
| `color`    | Text input with a color swatch and a color picker dialog                 | Defaults to `#808080`. Supports `readOnly`.                                                                                                          |
| `uuid`     | Text input with generate and copy buttons                               | Supports `forceGenerate` and `readOnly`.                                                                                                             |
| `file`     | Read-only text input with upload and clear buttons                      | Use `extra.file.accept` and `extra.file.private`.                                                                                                    |
| `button`   | Outlined button that triggers an action                                 | Use `extra.action`. The action is dispatched to the parent via `onAction`.                                                                          |
| `section`  | Divider with a title and optional description                           | Does not produce a value. Use it to group related fields.                                                                                            |

## Width behavior

`DynamicForm` uses a 12-column responsive grid. The width resolution per field is:

- Large screens (`md` breakpoint): `lgWidth` → default `4`.
- Medium screens (`sm` breakpoint): `mdWidth` → `lgWidth` → default `4`.
- Small screens (`xs` breakpoint): `smWidth` → `mdWidth` → `lgWidth` → default `6`.

`section` fields always span the full 12 columns.

## Defaults and forced UUIDs

When the form is mounted with `applyDefaults: true`, every non-section field whose current value is empty (`undefined`, `null`, or a blank string) is filled with `defaultValue` (preferred) or `default`. Existing values are never overwritten.

For `uuid` fields with `forceGenerate: true`, a new UUID is generated automatically on mount whenever the field is empty, even if `applyDefaults` is not enabled.

## File handling

- **Public files** (`extra.file.private` falsy): the file is read client-side as a data URL and stored directly in the form data.
- **Private files** (`extra.file.private: true`): the file is uploaded through the `onFileUpload` callback (which calls `/settings/privateFile` in the settings screen). Only the uploaded file name is stored in the form data; the binary content lives in `backend/private`. External drivers receive the file base64-encoded in the `fileData` envelope on every RPC call.

## Action buttons

`button` fields trigger an `extra.action` of type `fetch`. The parent component receives the field and the action through the `onAction` callback and is responsible for performing the HTTP request (for example, the external driver settings screen calls `POST /payment-gateways/external/fields` to refresh the cached fields). `dependsOn` lists the names of other fields whose current values must be sent with the request.

## Examples

### Text field with helper text

```json
{
  "name": "providerAccountId",
  "title": "Provider Account ID",
  "description": "Account identifier returned by the provider",
  "type": "text",
  "lgWidth": 12,
  "required": true,
  "helperText": "Find this value in your provider dashboard under Settings > API."
}
```

### Select field

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

### UUID with forced generation

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

### Private certificate file

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

### Action button

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

### Section divider

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

### Full form combining several field types

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

## Relationship with external drivers

The `getDriverDetails` operation of both external drivers returns a `fields` array that follows this schema. Ticketz caches the response and renders the fields in the settings screen using `DynamicForm`. Remember:

- Field `name` values must **not** include the `_external` / `_externalNfse` prefix — Ticketz adds it automatically.
- `modes` and `operations` returned alongside `fields` are validated separately (see the [external payment driver]({{ '/en/external-payment-driver/' | relative_url }}) page).
- To force Ticketz to query the endpoint again after you change the fields, a super user can call the refresh-cache endpoint of the corresponding driver.
---
title: Campos de Formulário Dinâmico
lang: pt-br
slug: dynamic-form-fields
description: Referência do schema de campos usado pelo DynamicForm e pelo array fields do getDriverDetails dos drivers externos.
---

O Ticketz PRO renderiza formulários dinâmicos de configuração a partir de um schema declarativo de campos. O mesmo schema alimenta o array `fields` retornado pela operação `getDriverDetails` do [driver de pagamento externo]({{ '/pt-br/external-payment-driver/' | relative_url }}) e do [driver de NFS-e externa]({{ '/pt-br/external-nfse-driver/' | relative_url }}), permitindo que qualquer endpoint declare a UI de configurações que precisa sem mexer no frontend.

Esta página documenta todas as propriedades de um objeto de campo, os valores de `type` suportados e exemplos prontos para copiar.

## Objeto de campo

Cada entrada do array `fields` é um objeto com as seguintes propriedades:

| Propriedade            | Tipo                                  | Obrigatório | Aplica-se a                                  | Descrição                                                                                                                                                                                                                       |
| ---------------------- | ------------------------------------- | ----------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                 | string                                | sim         | todos (exceto `section`)                    | Identificador do campo. Para drivers externos, o Ticketz adiciona o prefixo automaticamente (ex.: `_external`), então **não** inclua o prefixo aqui.                                                                            |
| `title`                | string                                | sim         | todos                                        | Rótulo exibido ao lado do input. Usa a chave i18n `${i18nBase}.${name}` quando traduzida.                                                                                                                                       |
| `description`          | string                                | não         | todos                                        | Texto de ajuda / descrição. Não é renderizado diretamente pelo `DynamicForm`, mas consumido por ferramentas OpenAPI e pela documentação dos drivers externos.                                                                  |
| `type`                 | enum (veja abaixo)                    | sim         | todos                                        | Tipo de input que define a renderização.                                                                                                                                                                                        |
| `required`             | boolean                               | sim         | todos                                        | Marca o campo como obrigatório.                                                                                                                                                                                                 |
| `lgWidth`              | inteiro (1–12)                        | não         | todos (exceto `section`)                    | Largura da coluna em telas grandes. Padrão `4`.                                                                                                                                                                                 |
| `mdWidth`              | inteiro (1–12)                        | não         | todos (exceto `section`)                    | Largura da coluna em telas médias. Usa `lgWidth` como fallback.                                                                                                                                                                  |
| `smWidth`             | inteiro (1–12)                        | não         | todos (exceto `section`)                    | Largura da coluna em telas pequenas. Usa `mdWidth` → `lgWidth` → `6` como fallback.                                                                                                                                              |
| `default`              | any                                   | não         | todos (exceto `section`)                    | Valor padrão aplicado quando o campo está vazio e `applyDefaults` está habilitado.                                                                                                                                             |
| `defaultValue`         | any                                   | não         | todos (exceto `section`)                    | Mesmo que `default`, mas tem precedência quando ambos estão presentes.                                                                                                                                                          |
| `options`              | array de `{ value, label }`           | não         | `select`                                     | Opções renderizadas no dropdown.                                                                                                                                                                                                 |
| `forceGenerate`        | boolean                               | não         | `uuid`                                       | Quando `true`, o campo é preenchido automaticamente com um novo UUID na montagem se estiver vazio.                                                                                                                              |
| `readOnly`             | boolean                               | não         | `text`, `number`, `color`, `uuid`            | Renderiza o input como somente leitura.                                                                                                                                                                                         |
| `error`                | boolean                               | não         | `text`, `textarea`, `number`, `select`       | Marca o input como inválido (borda vermelha).                                                                                                                                                                                  |
| `helperText`           | string                                | não         | `text`, `textarea`, `number`, `select`       | Texto de ajuda exibido sob o input. Passa por `i18n.t()`.                                                                                                                                                                       |
| `extra`                | object                                | não         | `button`, `file`                             | Configuração extra. Veja abaixo.                                                                                                                                                                                                |
| `extra.action`         | object                                | não         | `button`                                     | Ação disparada ao clicar no botão.                                                                                                                                                                                              |
| `extra.action.type`    | `"fetch"`                             | sim         | `button`                                     | Hoje só há suporte a `fetch`.                                                                                                                                                                                                   |
| `extra.action.label`   | string                                | sim         | `button`                                     | Rótulo do botão (sobrescreve `title`).                                                                                                                                                                                          |
| `extra.action.method`  | `"GET"` \| `"POST"`                   | não         | `button`                                     | Método HTTP. Padrão `POST`.                                                                                                                                                                                                    |
| `extra.action.url`     | string (uri)                          | sim         | `button`                                     | URL a ser chamada ao clicar no botão.                                                                                                                                                                                           |
| `extra.action.dependsOn` | string[]                           | não         | `button`                                     | Nomes de outros campos cujos valores devem ser enviados com a requisição.                                                                                                                                                       |
| `extra.action.headers` | object (valores string)               | não         | `button`                                     | Cabeçalhos HTTP extras a enviar.                                                                                                                                                                                                |
| `extra.file`           | object                                | não         | `file`                                       | Configuração do input de arquivo.                                                                                                                                                                                              |
| `extra.file.accept`    | string                                | não         | `file`                                       | Atributo `accept` do input (tipos MIME ou extensões). Padrão `*`.                                                                                                                                                              |
| `extra.file.private`   | boolean                               | não         | `file`                                       | Quando `true`, o arquivo é enviado via `/settings/privateFile` e armazenado em `backend/private`. Drivers externos o recebem codificado em base64 em `fileData`.                                                                |
| `sectionTitle`         | string                                | não         | `section`                                    | Título renderizado para o divisor de seção. Usa `title` como fallback.                                                                                                                                                          |
| `sectionDescription`   | string                                | não         | `section`                                    | Subtítulo renderizado sob o título da seção. Passa por `i18n.t()`.                                                                                                                                                              |

## Valores de `type` suportados

| Type       | Renderiza                                                              | Observações                                                                                                                                           |
| ---------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`     | Input de texto de uma linha                                            | Suporta `readOnly`, `error`, `helperText`.                                                                                                             |
| `textarea` | Input de texto multilinha (4 linhas)                                   | Suporta `error`, `helperText`.                                                                                                                        |
| `number`   | Input numérico                                                          | Suporta `readOnly`, `error`, `helperText`.                                                                                                            |
| `select`   | Dropdown                                                                | Exige `options`. Suporta `error`, `helperText`.                                                                                                       |
| `checkbox` | Switch                                                                  | Armazenado como booleano.                                                                                                                             |
| `json`     | Editor visual de JSON                                                   | O valor é armazenado como string JSON formatada.                                                                                                      |
| `object`   | Editor visual de JSON                                                   | O valor é armazenado como objeto parseado (não string).                                                                                              |
| `color`    | Input de texto com amostra de cor e dialog de color picker              | Padrão `#808080`. Suporta `readOnly`.                                                                                                                 |
| `uuid`     | Input de texto com botões de gerar e copiar                            | Suporta `forceGenerate` e `readOnly`.                                                                                                                |
| `file`     | Input de texto somente leitura com botões de upload e limpar           | Use `extra.file.accept` e `extra.file.private`.                                                                                                       |
| `button`   | Botão outlined que dispara uma ação                                     | Use `extra.action`. A ação é repassada ao pai via `onAction`.                                                                                         |
| `section`  | Divisor com título e descrição opcional                                 | Não produz valor. Use para agrupar campos relacionados.                                                                                                |

## Comportamento de largura

O `DynamicForm` usa um grid responsivo de 12 colunas. A resolução de largura por campo é:

- Telas grandes (`md` breakpoint): `lgWidth` → padrão `4`.
- Telas médias (`sm` breakpoint): `mdWidth` → `lgWidth` → padrão `4`.
- Telas pequenas (`xs` breakpoint): `smWidth` → `mdWidth` → `lgWidth` → padrão `6`.

Campos `section` sempre ocupam as 12 colunas completas.

## Defaults e UUIDs forçados

Quando o formulário é montado com `applyDefaults: true`, todo campo que não seja `section` cujo valor atual esteja vazio (`undefined`, `null` ou string em branco) é preenchido com `defaultValue` (preferencial) ou `default`. Valores existentes nunca são sobrescritos.

Para campos `uuid` com `forceGenerate: true`, um novo UUID é gerado automaticamente na montagem sempre que o campo estiver vazio, mesmo que `applyDefaults` não esteja habilitado.

## Tratamento de arquivos

- **Arquivos públicos** (`extra.file.private` falso): o arquivo é lido no cliente como data URL e armazenado diretamente nos dados do formulário.
- **Arquivos privados** (`extra.file.private: true`): o arquivo é enviado via callback `onFileUpload` (que chama `/settings/privateFile` na tela de configurações). Apenas o nome do arquivo enviado é armazenado nos dados do formulário; o conteúdo binário fica em `backend/private`. Drivers externos recebem o arquivo codificado em base64 no envelope `fileData` a cada chamada RPC.

## Botões de ação

Campos `button` disparam uma `extra.action` do tipo `fetch`. O componente pai recebe o campo e a ação através do callback `onAction` e é responsável por executar a requisição HTTP (por exemplo, a tela de configurações do driver externo chama `POST /payment-gateways/external/fields` para atualizar os campos em cache). `dependsOn` lista os nomes de outros campos cujos valores atuais devem ser enviados com a requisição.

## Exemplos

### Campo de texto com helper text

```json
{
  "name": "providerAccountId",
  "title": "Provider Account ID",
  "description": "Account identifier returned by the provider",
  "type": "text",
  "lgWidth": 12,
  "required": true,
  "helperText": "Encontre esse valor no painel do provedor em Settings > API."
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

### UUID com geração forçada

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

### Arquivo de certificado privado

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

### Botão de ação

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

### Divisor de seção

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

### Formulário completo combinando vários tipos de campo

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

## Relação com os drivers externos

A operação `getDriverDetails` de ambos os drivers externos retorna um array `fields` que segue este schema. O Ticketz cacheia a resposta e renderiza os campos na tela de configurações usando o `DynamicForm`. Lembre-se:

- Os valores de `name` **não** devem incluir o prefixo `_external` / `_externalNfse` — o Ticketz o adiciona automaticamente.
- `modes` e `operations` retornados junto com `fields` são validados separadamente (veja a página do [driver de pagamento externo]({{ '/pt-br/external-payment-driver/' | relative_url }})).
- Para forçar o Ticketz a consultar o endpoint novamente após alterar os campos, um super usuário pode chamar o endpoint de refresh-cache do driver correspondente.
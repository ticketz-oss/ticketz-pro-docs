---
title: Typebot Queue Integration
lang: en
slug: typebot-integration
description: Configure Ticketz PRO queues that use Typebot.
---

When a queue is configured with the Typebot driver, Ticketz asks for the base URL of your Typebot Viewer installation. In practice, this is usually just the protocol and hostname of the Viewer module, for example `https://typebot-viewer.example.com`.

Ticketz also asks for the **Public Id** of the flow that should run for that queue.

## Queue settings

The Typebot integration exposes these important options:

- **Interpret RichText**: converts Typebot text styles to the format supported by the current channel.
- **Additional parameters**: accepts a flat JSON object with `string`, `number`, or `boolean` values that become variables inside your flow.

Typebot does not support nested objects or arrays in that additional parameters object.

## Supported Typebot elements

- **Buttons** are supported and rendered according to the channel capabilities and your Ticketz preferences.
- **Wait** blocks are supported, but they are not recommended because the contact may send a new message while the delay is running.
- **Image** and **audio** bubbles work normally.
- To send a **document**, use the `embed` bubble.

## Variables available inside the flow

Along with your custom parameters, Ticketz provides standard variables:

- `number`: the contact address. On WhatsApp it usually appears as `55DDDNUMBER`.
- `pushName`: the contact name stored in Ticketz.
- `firstMessage`: the first message sent by the contact.
- `ticketId`: the current ticket number.
- `backendURL`: the full backend URL.
- `token`: bearer token used to issue HTTP requests that act on the current ticket and integration session.
- `metadata`: additional information exposed by the connection driver and runtime context.

## Trigger commands from Typebot

Ticketz allows special commands such as queue transfer, user assignment, session end, and ticket close. These commands are sent through a **Text** bubble that starts with `#` followed immediately by a JSON string.

Example: transfer the current conversation to queue `99`.

```text
#{ "queueId": 99 }
```

Download a ready-made Typebot trigger flow from the [example files]({{ '/en/examples/' | relative_url }}) page.

For the full trigger reference, see [Triggers and commands]({{ '/en/integration-triggers/' | relative_url }}).

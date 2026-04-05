---
title: Integrations Overview
lang: en
slug: overview
description: How Ticketz PRO queue integrations work.
---

Ticketz PRO includes an integration engine designed to work with different drivers. The initial built-in options are Typebot and Webhook or n8n-based flows.

## How an integration is attached to a queue

An integration starts running as soon as the contact sends the first message to the queue. It remains active until one of these situations happens:

- An agent accepts the conversation and moves it to the active service area.
- The integration driver detects that the flow has reached its end.
- The integration content asks Ticketz to end the session, close the ticket, or transfer the ticket to another queue.

Queue transfers immediately activate the destination queue integration, no matter whether that new flow is Typebot, Webhook, the internal chatbot, or another automation driver added in the future.

## Queue discovery endpoint

Integrations can fetch the list of available queues through the backend endpoint below:

```text
${BACKEND_URL}/integrations/listQueues
```

This is useful when the automation needs to decide the next queue dynamically.

## Recommended reading

- [Webchat]({{ '/en/webchat/' | relative_url }})
- [Typebot queue integration]({{ '/en/typebot-integration/' | relative_url }})
- [Triggers and commands]({{ '/en/integration-triggers/' | relative_url }})
- [Example files]({{ '/en/examples/' | relative_url }})

---
title: Triggers and Commands
lang: en
slug: integration-triggers
description: Full reference for Ticketz PRO integration commands.
---

Triggers are structured commands that an integration can return to Ticketz through a message or webhook response in order to perform actions on the current ticket.

## Message format

Messages use this structure:

```json
{
  "type": "text",
  "content": "message text",
  "mediaUrl": "https://example.com/file"
}
```

- `type` can be `text`, `image`, `video`, `audio`, `gif`, or `document`.
- `content` is used for text messages.
- `mediaUrl` is used for non-text media.

## Ways to send commands

### 1. Text bubble inside Typebot

Typebot integrations can send one command at a time with a text bubble starting with `#` and followed by a JSON payload.

```text
#{
  "queueId": 99
}
```

### 2. Webhook response payload

Webhook integrations can respond with:

- a single command
- a single message with an optional trigger
- an array of messages, each one with an optional trigger

Example:

```json
[
  {
    "type": "text",
    "content": "One message"
  },
  {
    "type": "text",
    "content": "Another message",
    "trigger": { "action": "wait", "seconds": 2 }
  },
  {
    "type": "text",
    "content": "A message with a trigger",
    "trigger": { "closeTicket": true }
  }
]
```

### 3. Direct HTTP request to the backend

Typebot, Webhook, or any external system can call the backend directly if it has the authorization token.

- Endpoint: `${BACKEND_URL}/integrations/webhook`
- Method: `POST`
- Header: `Authorization: Bearer ${token}`

The payload can be any format accepted in the webhook response method.

## Available commands

### Send a message

`message` can be a single message object or an array of message objects.

```json
{
  "message": {
    "type": "text",
    "content": "message content"
  }
}
```

### Send a message with menu options

```json
{
  "message": {
    "type": "text",
    "content": "A message"
  },
  "action": "menu",
  "menuOptions": [{ "text": "Option 1" }, { "text": "Option 2" }]
}
```

### Send a message with a URL button

Currently limited to channels that support that format, such as Notificamehub Official WhatsApp.

```json
{
  "message": {
    "type": "text",
    "content": "Click the button below to learn more"
  },
  "action": "menu",
  "menuOptions": [
    {
      "text": "Ticketz PRO",
      "url": "https://pro.ticke.tz"
    }
  ]
}
```

### Transfer to another queue

```json
{
  "queueId": 99
}
```

If the new queue is not handled by a chatbot, Ticketz also removes the chatbot attribute.

### Transfer to another queue and user

```json
{
  "queueId": 99,
  "userId": 42
}
```

The ticket is accepted automatically and appears in the new user's active service area.

### End the integration session

```json
{
  "action": "endSession"
}
```

### Stop the chatbot

This is equivalent to `endSession` and exists for backward compatibility.

```json
{
  "stopbot": true
}
```

### Close the current ticket

```json
{
  "closeTicket": true
}
```

### Add an internal note to the ticket

```json
{
  "action": "note",
  "message": {
    "content": "Note text"
  }
}
```

### Update multiple ticket properties

```json
{
  "action": "updateTicket",
  "ticketData": {
    "status": "pending",
    "userId": 42,
    "queueId": 99,
    "justClose": false,
    "annotation": "Escalated by automation"
  }
}
```

Allowed `ticketData` fields:

- `status`: `pending`, `open`, or `closed`
- `userId`: transfer to another user
- `queueId`: transfer to another queue
- `justClose`: close without other transition rules
- `annotation`: add a note when transferring

### Wait for a number of seconds

Effective only inside an array of commands.

```json
{
  "action": "wait",
  "seconds": 2
}
```

### Ping

Forces Ticketz to answer automatically with `pong`, which can help preserve ordering in Typebot.

```json
{
  "action": "ping"
}
```

### Add a tag to the ticket

If `advanceOnly` is true, a funnel tag cannot replace another tag from the same funnel that is already further ahead.

```json
{
  "action": "addTag",
  "tagId": 99,
  "advanceOnly": true
}
```

### Remove a tag from the ticket

```json
{
  "action": "removeTag",
  "tagId": 99
}
```

### Clear all ticket tags

```json
{
  "action": "clearTags"
}
```

### Add a tag to the contact

```json
{
  "action": "addContactTag",
  "tagId": 99,
  "advanceOnly": true
}
```

### Remove a tag from the contact

```json
{
  "action": "removeContactTag",
  "tagId": 99
}
```

### Clear all contact tags

```json
{
  "action": "clearContactTags"
}
```

For ready-made payload samples, visit [Example files]({{ '/en/examples/' | relative_url }}).

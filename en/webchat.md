---
title: Webchat
lang: en
slug: webchat
description: Webchat setup and integration guide for Ticketz PRO.
---

## Index

1. [About Webchat](#about-webchat)
2. [Ticketz setup](#ticketz-setup)
3. [Basic integration](#basic-integration)
4. [Customization](#customization)
5. [Verification](#verification)

## About Webchat

Webchat is a floating widget that lets your customers start conversations directly from your website. It is responsive and works on desktop and mobile.

## Ticketz setup

### Create a Webchat connection

1. Open the Ticketz admin panel.
2. Go to Connections -> New Connection.
3. Select Webchat as the connection type.
4. Configure these fields:
   - Name: Descriptive connection name (example: `main-webchat`).
   - Channel UUID / Connection ID: Unique identifier (auto generated).
   - Window Title: Text shown at the top of the chat (example: `Online Support`).
   - Window Subtitle: Short description (example: `We will reply shortly`).
   - CTA Message: Text shown next to the floating button (example: `Talk to us`).
   - Primary Color: Main button and highlight color (example: `#0066CC`).
   - Secondary Color: Secondary accent color (example: `#00AA00`).
   - Surface Color: Chat window background color (example: `#FFFFFF`).
   - Text Color: Main text color (example: `#0F172A`).

After saving, you will receive a Connection ID (unique code). Copy this ID to use in the integration.

## Basic integration

### Minimum example

Add this code at the end of your website HTML, before `</body>`:

```html
<script>
  window.WebchatChannelId = "your-connection-id-here";
</script>
<script src="https://your-ticketz-domain.com/webchat-fab.js" async></script>
```

Replace:

- `your-ticketz-domain.com` with your Ticketz installation URL (example: `chat.yourcompany.com`).
- `your-connection-id-here` with the connection ID copied from the panel.

A floating button will then appear automatically in the bottom-right corner of the page.

## Customization

### Method 1: Through panel (recommended)

When creating or editing the Webchat connection in the panel, configure:

| Field                        | Description                              | Example               |
| ---------------------------- | ---------------------------------------- | --------------------- |
| Channel UUID / Connection ID | Unique connection identifier (read-only) | `a1b2c3d4-...`        |
| Window Title                 | Title shown at the top of the chat       | `Online Support`      |
| Window Subtitle              | Short description                        | `Team available 24/7` |
| CTA Message                  | Text displayed next to the floating icon | `Talk to us`          |
| Primary Color                | Button and main elements color           | `#0066CC`             |
| Secondary Color              | Highlight and border color               | `#00AA00`             |
| Surface Color                | Chat window background color             | `#FFFFFF`             |
| Text Color                   | Main text color                          | `#0F172A`             |

This is the best approach for day-to-day administration.

How to prioritize settings in the panel:

1. Set Window Title and Window Subtitle for your support context.
2. Use CTA Message to improve button click rate.
3. Adjust Primary and Secondary colors to match your brand.

Result: the widget remains standardized for all websites that use this connection.

### Method 2: Through global variables (optional)

You can override visual behavior directly on the page using `window` variables:

| Variable                         | Description                      | Default value            |
| -------------------------------- | -------------------------------- | ------------------------ |
| `window.WebchatCtaMessage`       | Overrides panel CTA message      | Empty (uses panel value) |
| `window.WebchatFabPulseEnabled`  | Enables or disables button pulse | `true`                   |
| `window.WebchatFabPulseDuration` | Animation duration (seconds)     | `0.5`                    |
| `window.WebchatFabPulseScale`    | Maximum pulse scale              | `1.1`                    |

Example with variable overrides:

```html
<script>
  window.WebchatChannelId = "your-connection-id";
  window.WebchatCtaMessage = "Immediate support";
  window.WebchatFabPulseEnabled = true;
  window.WebchatFabPulseDuration = 0.5;
  window.WebchatFabPulseScale = 1.1;
</script>
<script src="https://your-ticketz-domain.com/webchat-fab.js" async></script>
```

Note: pulse behavior is configured by `window` variables, not by the connection panel. Current defaults are `0.5s` duration and `1.1` scale.

### Method 3: Through webchat URL (optional)

To customize the inner chat window, pass parameters in `WebchatPath`:

| Parameter   | Description        | Format                                 |
| ----------- | ------------------ | -------------------------------------- |
| `title`     | Window title       | `title=Support`                        |
| `subtitle`  | Subtitle           | `subtitle=Team%20Online`               |
| `lang`      | Interface language | `lang=en` (pt, en, es, fr, de, id, it) |
| `primary`   | Primary color      | `primary=%230066CC`                    |
| `secondary` | Secondary color    | `secondary=%2300AA00`                  |
| `surface`   | Background color   | `surface=%23FFFFFF`                    |
| `text`      | Text color         | `text=%23333333`                       |

Example with URL parameters:

```html
<script>
  window.WebchatChannelId = "your-connection-id";
  window.WebchatPath =
    "/webchat.html?lang=en&primary=%230066CC&secondary=%2300AA00&surface=%23FFFFFF&text=%23333333";
</script>
<script src="https://your-ticketz-domain.com/webchat-fab.js" async></script>
```

Tip: connection settings from the panel are the base layer. `window` variables and URL parameters override values when present.

### Available languages

Webchat automatically detects browser language. Supported languages:

- Portuguese (pt)
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Indonesian (id)
- Italian (it)

## Verification

### Chat does not appear?

1. Verify your Ticketz URL is accessible.
2. Confirm the connection ID is exact (copy it again from the panel).
3. Open browser Console (F12) and check for errors.
4. In the Network tab, confirm `webchat-fab.js` loaded successfully.

### Button appears but does not open?

1. Click the button again.
2. Check whether your Ticketz server is running and reachable.
3. Look for errors in the browser Console.

Version: 1.0  
Updated: March 2026

---
title: Notificamehub WABA Guide
lang: en
slug: notificamehub-waba-guide
description: Step-by-step guide to connect a number to the official WhatsApp Business API through Notificamehub in Ticketz PRO.
---

This guide explains how to connect a number to the official WhatsApp Business API (WABA) using Notificamehub as the provider inside Ticketz PRO.

> To obtain Notificamehub channels with discount, [contact Ticketz PRO developer team by Whatsapp](https://wa.me/5549999812291?text=I+want+to+connect+Ticketz+PRO+through+Notificamehub).

> Before you start, review the [WABA checklist]({{ '/en/waba-checklist/' | relative_url }}). All requirements must be met to avoid blocks during Meta onboarding. For a generic walkthrough of the Meta popover flow, see the [WABA onboarding guide]({{ '/en/waba-onboarding-guide/' | relative_url }}).

## Create the channel connection

1. Open the Notificamehub dashboard.
2. In the Dashboard, click **Channels**.
3. In the **Connect Channel** section, select **WhatsApp**.
4. A new entry will appear under **Connected Channels** with a pending status.

You must pay the corresponding activation fee to unlock the channel and continue.

## Start onboarding

After the channel is activated:

1. Click **Connect** on the WhatsApp entry under **Connected Channels**.
2. Follow the Meta onboarding flow. See the [WABA onboarding guide]({{ '/en/waba-onboarding-guide/' | relative_url }}) for a generic, step-by-step description of the popover flow.
3. Finish the requested permissions and settings.

## Configuration in Ticketz PRO

After completing the onboarding process:

1. In Ticketz PRO, create a new connection and select the Notificamehub integration.
2. In the **Advanced** tab, fill in the Notificamehub **account** and **channel** tokens:
   - The **account token** is available at the top of the Notificamehub dashboard.
   - The **channel token** can be obtained from the window that appears after clicking the **Edit** icon on the connected channel.
3. Save the connection and check that the status changes to connected.

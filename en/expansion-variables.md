---
title: Expansion Variables
lang: en
slug: expansion-variables
description: Reference for expansion variables available in Ticketz for templates and automations.
---

Expansion variables let you build dynamic messages in templates and automation flows.

## Available variables in Ticketz

- `name`: contact full name
- `firstname`: contact first name
- `email`: contact email (if present in the profile)
- `greeting`: greeting based on time of day (good morning, good afternoon, etc)
- `queue`: ticket queue name
- `protocol`: protocol number in the format `YYYYMMDD-TicketId`
- `user`: name of the active agent handling the ticket
- `time`: current time
- `ticket`: ticket number

## Contact custom fields (Outras Informações)

Besides the default variables, you can also use values stored in the contact's **Outras Informações** fields as variables.

## Template behavior

In templates, any variable that is not automatically provided will be requested when the user tries to send the template.

If the template is sent by automation, the request must provide all values required by that template.

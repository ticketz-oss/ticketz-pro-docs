---
title: Example Files
lang: en
slug: examples
description: Downloadable example assets for Ticketz PRO docs.
---

These files are hosted directly in GitHub Pages so you do not need to depend on `raw.githubusercontent.com` links.

## Downloadable files

- [Ticketz PRO Smart Reception (n8n).json]({{ '/assets/examples/Ticketz%20PRO%20Smart%20Reception%20(n8n).json' | relative_url }}): Example n8n webhook and AI-assisted smart reception flow
- [typebot-export-bolhas-de-triggers.json]({{ '/assets/examples/typebot-export-bolhas-de-triggers.json' | relative_url }}): Typebot export with trigger command bubbles
- [example.env-backend]({{ '/assets/examples/example.env-backend' | relative_url }}): Backend environment template
- [example.env-frontend]({{ '/assets/examples/example.env-frontend' | relative_url }}): Frontend environment template
- [example.env-integrations]({{ '/assets/examples/example.env-integrations' | relative_url }}): Typebot and integrations environment template

## Usage notes

- Use the n8n flow as a starting point, not as a drop-in production workflow.
- Review tokens, prompts, queue identifiers, and credential nodes before importing any automation file.
- Hostname and SMTP values in the `.env` files are placeholders and must be replaced.

<div class="download-note">
  Because these files are published as part of the documentation site, downloads are stable and do not rely on GitHub raw rate limits.
</div>

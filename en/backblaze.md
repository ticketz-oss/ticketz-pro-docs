---
title: Backblaze Setup
lang: en
slug: backblaze
description: Configure Backblaze object storage in Ticketz PRO.
---

This guide helps you configure Backblaze in Ticketz within a few minutes.

## Backblaze steps

1. Create an account at `https://www.backblaze.com`.
2. Create a bucket and set its visibility to public. Backblaze asks for a credit card during this step.
3. Open **Billing** in the top-right corner and add the card again if required.
4. Open **Application Keys** and create a new key with read and write permission for the bucket.
5. Save the **Key ID** and **Application Key**.

## Ticketz fields

In Ticketz settings, fill in the storage fields like this:

- **Access Key**: the Backblaze `Key ID`
- **Secret Key**: the `Application Key`
- **Region**: the bucket region, often visible in the endpoint, for example `sa-east-005`
- **Bucket**: the bucket name
- **Endpoint**: the full endpoint URL starting with `https`

When the values are correct, Ticketz starts storing files in Backblaze.

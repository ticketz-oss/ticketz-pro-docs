---
title: WABA Onboarding Guide
lang: en
slug: waba-onboarding-guide
description: Step-by-step WABA onboarding for the official WhatsApp Business API, from prerequisites to number verification and company verification.
---

This guide walks through the official WhatsApp Business API (WABA) onboarding process shown by Meta after you click **Connect** in your technology provider's popover. It assumes you already reviewed the [WABA checklist]({{ '/en/waba-checklist/' | relative_url }}) and have the number, Facebook account, and company details ready.

## 1. Sign in with Facebook

Meta uses a personal Facebook account to create and manage the Business Portfolio:

1. Sign in with the Facebook account that will own or manage the WABA connection.
2. If the account does not have a Business Portfolio yet, Meta creates one automatically.
3. Accept the terms and permissions requested by WhatsApp.

Use a Facebook account with a real name and valid documents. Unverified or restricted accounts can block the process.

## 2. Create or select a Business Portfolio

The Business Portfolio is the container for your WhatsApp Business account, payment method, and business details:

- If the company already has a portfolio, choose it from the list.
- If not, create a new portfolio and give it a clear business name.

After creation, the portfolio can be accessed at [business.facebook.com](https://business.facebook.com).

## 3. Add the business details

Meta asks for the business display name and category. Make sure the display name:

- Matches the company name or brand visible on the business website.
- Does not include generic terms such as "WhatsApp" or "Support" unless they are part of the registered brand.
- Follows Meta's display name guidelines.

The business category must reflect the company's actual activity.

## 4. Verify the phone number

Meta sends a 6-digit code to the number being connected:

1. Choose SMS or voice call delivery.
2. Receive the code on the device or line that has access to the number.
3. Enter the code in the onboarding screen.

### Without coexistence

If the number is already active on a regular WhatsApp app and you are **not** using coexistence, you may need to erase the WhatsApp account from the device first. See the [WABA checklist]({{ '/en/waba-checklist/' | relative_url }}) for details.

### With coexistence

If your provider supports **coexistence**, the same number stays active on the WhatsApp mobile app while also working through the API:

1. During setup, the provider's onboarding popover may show a **QR code**.
2. Open WhatsApp on the phone that owns the number.
3. Go to the linked devices or companion device screen and scan the QR code.
4. Wait for the confirmation that the device is linked.

After the API connection is active, both the app and the API can send and receive messages for the same number. Quality ratings and messaging limits are still managed by Meta.

## 5. Set up payments

To send template messages outside the 24-hour customer-service window, add a payment method:

1. In the WhatsApp connection settings, go to the payment section.
2. Add a credit card.
3. Confirm the billing country and currency.

Without a payment method, the connection can receive messages, but the business cannot start new conversations with templates.

## 6. Submit the company for verification

After the number is connected, Meta may require company verification to unlock messaging limits and template features:

1. In the Business Portfolio, start the company verification process.
2. Provide the legal business name, address, phone, and website.
3. Confirm the information matches the company's official documents and website.

Meta will attempt phone verification first. If it fails, you will be asked to upload:

- Articles of incorporation or equivalent business registration document.
- Government-issued ID of the legal representative.

## 7. Confirm WABA is connected

Once the number is verified and payments are configured, the WhatsApp Business API channel appears as connected in your provider's panel. You can now:

- Receive messages from customers.
- Send template messages for outbound conversations.
- Monitor quality ratings and messaging limits in Meta Business Manager.

Company verification may still be in progress, and that is expected. Keep the verification documents ready and respond to any Meta requests to complete it.

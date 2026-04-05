---
title: WHMCS
lang: en
slug: whmcs
description: Connect WHMCS subscription control to Ticketz PRO.
---

Even though WHMCS is not a payment gateway by itself, Ticketz treats it as one because it controls subscription access through the payment methods you configure inside WHMCS.

Ticketz uses the WHMCS subscription state to provision and maintain plan access.

## Prepare WHMCS

### Payment gateway

The payment gateway itself is outside the scope of this guide. Configure the billing provider that best fits your operation, such as Mercado Pago, ASAAS, or Stripe.

### Product creation

1. Open **Products/Services**.
2. Create a product with type **Other Product/Service**.
3. Choose or create a suitable group.
4. Set the name and select the **Auto Release** module.
5. In the **Pricing** tab, set the lowest plan price you intend to offer, keep monthly recurring billing, and ensure the value is active.
6. In **Custom Fields**, create a required password field:
   - **Field Name**: `Password`
   - **Field Type**: `Password`
   - **Description**: `Password for the first login`
7. Save the product and record the product code visible in the browser URL after `&id=`.

### Configurable options for plans

1. Open **Configurable Options**.
2. Create a new group and link it to the product.
3. Add a new configurable option named `Plan` with type `Dropdown`.
4. Add one option per Ticketz plan.

The plan names must match Ticketz exactly. Any difference in characters will break the mapping.

### API credentials

Inside **Manage API Credentials**:

1. In **API Roles**, create a role named `querycustomer`.
2. Enable `GetClientsDetails` and `GetClientsProducts` from the **Client** group.
3. In **API Credentials**, create a credential bound to that role.
4. Save both generated values: **Identifier** and **Secret**.

### Allow API access

In **General Settings** and then **Security**, add the IP address of the Ticketz server to **API IP Access Restriction**.

## Prepare Ticketz

### Create the plans

In Ticketz, create plans with exactly the same names used in WHMCS. Monthly recurrence is recommended.

### Configure the gateway

In Ticketz, go to **Settings** and then **Payment Gateways**. Select the WHMCS gateway and fill in:

- **Base URL**: the root URL of the WHMCS installation
- **API Identifier**: the value generated in WHMCS
- **API Secret**: the companion secret generated in WHMCS
- **Product Code**: the product code created earlier

## Usage flow

There is no extra operational step after configuration. When a client purchases the product in the WHMCS cart, they choose a plan and define a password. After payment confirmation:

- Ticketz creates the company using the WHMCS client name
- Ticketz activates the selected plan
- Ticketz uses the WHMCS due date
- the client signs in with the purchase email and chosen password

After login, the customer can change the password and create additional users according to plan limits.

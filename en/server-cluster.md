---
title: Server Cluster
lang: en
slug: server-cluster
description: Configure and operate Server Cluster mode in Ticketz PRO.
---

> **Status:** `not-released`  
> This page documents a feature that is already implemented but not officially released yet.

Server Cluster allows one Ticketz node to discover login credentials on other nodes and route the user to the correct backend.

## When to use

Use this feature when your operation is split between multiple Ticketz nodes and users may try to log in on a node where their account does not exist.

## How it works

1. The login request is sent to the current backend.
2. If credentials are invalid locally, Ticketz probes configured cluster nodes.
3. If one node validates the credentials, the backend returns `backend_url`.
4. The frontend re-runs login on that returned backend and stores this backend as the selected API base URL.

## Setup order: Slaves before Master

**Important:** Configure all **slave** servers with CORS rules that allow the **master** server origin *before* configuring the master itself.

Why? The master validates connectivity to slaves during configuration save. Slaves will discover master connectivity only during login attempts and will fail gracefully if unreachable.

## Hostname format

Node hostnames should be DNS names without protocol or path:

- ✅ `cluster-node-1.company.com`
- ✅ `ticketz.example.org`
- ❌ `https://cluster-node-1.company.com`
- ❌ `cluster-node-1.company.com/backend`
- ❌ `cluster-node-1.company.com:3001` (prefer DNS SRV records or load balancers with TLS)

Ticketz will automatically append the protocol and backend path.

## Setup in Settings

Open **Settings > Server Cluster** and choose the server role.

### Master role

- Fill the list of **slave hostnames**.
- The master will validate connectivity to all slaves during save.
- Can be left empty; slaves can be added or updated later.

### Slave role

- Fill the **master hostname** only.
- No connectivity validation is performed (due to CORS restrictions).
- The slave will discover connectivity during actual login attempts and fail gracefully if unreachable.

## Error messages

When saving a master configuration, each slave hostname is validated. If validation fails, the error message shows:

- Which hostname failed
- Why it failed (unreachable, invalid response, etc.)

You can then fix the hostname, firewall rules, CORS configuration, or other issues and retry.

## Login flow behavior

If a user logs in on the wrong backend:

- The backend tries `/auth/validate-login` on configured cluster nodes.
- On success, the backend returns `backend_url` in the login response.
- The frontend retries login against that backend and persists it for future requests.

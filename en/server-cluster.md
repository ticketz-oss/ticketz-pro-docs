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

## Setup in Settings

Open **Settings > Server Cluster** and choose the server role.

### Master role

- Fill the list of **slave hostnames**.
- Each hostname can be either:
  - `domain.example.com` (uses `https` and backend path `/backend`)
  - `hostname:port` (uses `http` and no `/backend` suffix)

### Slave role

- Fill only the **master hostname**.
- The same hostname format rules apply:
  - `domain.example.com` -> `https://domain.example.com/backend`
  - `hostname:port` -> `http://hostname:port`

## Hostname format rules

The cluster logic normalizes values by removing protocol and path before storing.

| Input example | Probed backend URL | Allowed CORS origin |
| --- | --- | --- |
| `node-a.ticketz.com` | `https://node-a.ticketz.com/backend` | `https://node-a.ticketz.com` |
| `10.0.0.25:8080` | `http://10.0.0.25:8080` | `http://10.0.0.25:8080` |

## CORS behavior

Cluster origins are additive and do not replace existing behavior.

- Legacy origins still work (`FRONTEND_URL`, `FRONTEND_CUSTOM_URL`, `FRONTEND_URL_REGEX`).
- Slave hostnames configured in cluster settings are also allowed.
- If dynamic cluster origin loading fails, Ticketz falls back to legacy allowlist only.

## Login flow behavior

If a user logs in on the wrong backend:

- backend tries `/auth/validate-login` on configured cluster nodes;
- on success, backend returns `backend_url` in the login response;
- frontend retries login against that backend and persists it for future requests.

## Validation tips

- Prefer DNS hostnames in production.
- Use `hostname:port` for local or private network topologies when TLS is terminated elsewhere.
- Ensure every node is reachable from the node executing credential probing.

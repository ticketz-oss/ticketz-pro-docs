---
title: Server Cluster
lang: es
slug: server-cluster
description: Configura y opera el modo Server Cluster en Ticketz PRO.
---

> **Estado:** `not-released`  
> Esta página documenta una funcionalidad ya implementada, pero todavía no liberada oficialmente.

Server Cluster permite que un nodo de Ticketz descubra credenciales en otros nodos y redirija al usuario al backend correcto.

## Cuándo usar

Usa esta función cuando tu operación está dividida entre varios nodos de Ticketz y un usuario puede intentar iniciar sesión en un nodo donde su cuenta no existe.

## Cómo funciona

1. La solicitud de login se envía al backend actual.
2. Si las credenciales son inválidas localmente, Ticketz prueba los nodos de clúster configurados.
3. Si un nodo valida las credenciales, el backend retorna `backend_url`.
4. El frontend repite el login en ese backend y guarda ese backend como base de API seleccionada.

## Configuración en Ajustes

Abre **Configuración > Server Cluster** y selecciona el rol del servidor.

### Rol Master

- Completa la lista de **hostnames de slaves**.
- Cada hostname puede ser:
  - `dominio.ejemplo.com` (usa `https` y ruta `/backend`)
  - `hostname:puerto` (usa `http` y sin sufijo `/backend`)

### Rol Slave

- Completa solo el **hostname del master**.
- Se aplican las mismas reglas de formato:
  - `dominio.ejemplo.com` -> `https://dominio.ejemplo.com/backend`
  - `hostname:puerto` -> `http://hostname:puerto`

## Reglas de formato de hostname

La lógica de clúster normaliza valores removiendo protocolo y ruta antes de guardar.

| Ejemplo de entrada | URL de backend consultada | Origen CORS permitido |
| --- | --- | --- |
| `node-a.ticketz.com` | `https://node-a.ticketz.com/backend` | `https://node-a.ticketz.com` |
| `10.0.0.25:8080` | `http://10.0.0.25:8080` | `http://10.0.0.25:8080` |

## Comportamiento CORS

Los orígenes del clúster se agregan sin reemplazar el comportamiento anterior.

- Los orígenes legacy siguen funcionando (`FRONTEND_URL`, `FRONTEND_CUSTOM_URL`, `FRONTEND_URL_REGEX`).
- Los hostnames slave configurados en clúster también quedan permitidos.
- Si falla la carga dinámica de orígenes del clúster, Ticketz hace fallback solo al allowlist legacy.

## Comportamiento del flujo de login

Si el usuario inicia sesión en el backend incorrecto:

- el backend intenta `/auth/validate-login` en los nodos configurados;
- si tiene éxito, retorna `backend_url` en la respuesta de login;
- el frontend repite el login contra ese backend y persiste esa URL para las próximas solicitudes.

## Recomendaciones de validación

- En producción, prioriza hostnames DNS.
- Usa `hostname:puerto` para topologías locales o redes privadas cuando TLS termine en otra capa.
- Asegura conectividad entre los nodos que participan en la validación de credenciales.

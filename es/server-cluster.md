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

## Orden de configuración: Slaves antes del Master

**Importante:** Configura todos los servidores **slave** con reglas de CORS que permitan el origen del servidor **master** *antes* de configurar el master.

¿Por qué? El master valida conectividad a los slaves durante el guardado de la configuración. Los slaves descubrirán conectividad al master solo durante intentos de login reales y fallarán gracefully si son inaccesibles.

## Formato de hostname

Los hostnames de nodos deben ser nombres DNS sin protocolo o ruta:

- ✅ `cluster-node-1.empresa.com`
- ✅ `ticketz.ejemplo.org`
- ❌ `https://cluster-node-1.empresa.com`
- ❌ `cluster-node-1.empresa.com/backend`
- ❌ `cluster-node-1.empresa.com:3001` (prefiere registros DNS SRV o load balancers con TLS)

Ticketz agregará automáticamente el protocolo y la ruta del backend.

## Configuración en Ajustes

Abre **Configuración > Server Cluster** y selecciona el rol del servidor.

### Rol Master

- Completa la lista de **hostnames de slaves**.
- El master validará la conectividad a todos los slaves durante el guardado.
- Puede estar vacío; los slaves pueden agregarse o actualizarse más tarde.

### Rol Slave

- Completa solo el **hostname del master**.
- No se realiza validación de conectividad (debido a restricciones CORS).
- El slave descubrirá conectividad durante intentos reales de login y fallará gracefully si es inaccesible.

## Mensajes de error

Al guardar una configuración de master, cada hostname de slave se valida. Si la validación falla, el mensaje de error muestra:

- Qué hostname falló
- Por qué falló (inaccesible, respuesta inválida, etc.)

Puedes corregir el hostname, reglas de firewall, configuración de CORS u otros problemas e intentar de nuevo.

## Comportamiento del flujo de login

Si el usuario inicia sesión en el backend incorrecto:

- el backend intenta `/auth/validate-login` en los nodos configurados;
- si tiene éxito, retorna `backend_url` en la respuesta de login;
- el frontend repite el login contra ese backend y persiste esa URL para las próximas solicitudes.

## Recomendaciones de validación

- En producción, prioriza hostnames DNS.
- Usa `hostname:puerto` para topologías locales o redes privadas cuando TLS termine en otra capa.
- Asegura conectividad entre los nodos que participan en la validación de credenciales.

---
title: Guía Notificamehub WABA
lang: es
slug: notificamehub-waba-guide
description: Guía paso a paso para conectar un número a la API oficial de WhatsApp Business a través de Notificamehub en Ticketz PRO.
---

Esta guía describe cómo conectar un número a la API oficial de WhatsApp Business (WABA) usando Notificamehub como intermediaria dentro de Ticketz PRO.

> Antes de comenzar, revisa el [Checklist WABA]({{ '/es/waba-checklist/' | relative_url }}). Todos los requisitos deben estar correctos para evitar bloqueos durante el onboarding de Meta. Para un paso a paso genérico del flujo del popover de Meta, consulta la [Guía de onboarding WABA]({{ '/es/waba-onboarding-guide/' | relative_url }}).

## Crear la conexión del canal

1. Accede al panel de Notificamehub.
2. En el Dashboard, haz clic en **Canales**.
3. En la sección **Conectar Canal**, selecciona el canal **WhatsApp**.
4. Aparecerá una nueva entrada en **Canales Conectados** con estado pendiente.

Para liberar el canal y continuar, es necesario pagar la tarifa de activación correspondiente.

## Iniciar el onboarding

Después de activar el canal:

1. Haz clic en **Conectar** en la entrada de WhatsApp dentro de **Canales Conectados**.
2. Sigue el flujo de onboarding de Meta. Consulta la [Guía de onboarding WABA]({{ '/es/waba-onboarding-guide/' | relative_url }}) para una descripción genérica paso a paso del flujo del popover.
3. Finaliza los permisos y ajustes solicitados.

## Configuración en Ticketz PRO

Después de completar el proceso de onboarding:

1. En Ticketz PRO, crea una nueva conexión y selecciona la integración de Notificamehub.
2. En la pestaña **Avanzado**, completa los tokens de **cuenta** y de **canal** de Notificamehub:
   - El **token de cuenta** está disponible en la parte superior del dashboard de Notificamehub.
   - El **token de canal** se obtiene en la ventana que aparece al hacer clic en el icono **Editar** del canal conectado.
3. Guarda la conexión y verifica que el estado cambie a conectado.

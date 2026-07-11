---
title: Guía de Onboarding WABA
lang: es
slug: waba-onboarding-guide
description: Guía paso a paso del onboarding WABA para la API oficial de WhatsApp Business, desde los requisitos previos hasta la verificación del número y la empresa.
---

Esta guía acompaña el proceso de onboarding de la API oficial de WhatsApp Business (WABA) mostrado por Meta después de que haces clic en **Conectar** en el popover de tu proveedor de tecnología. Asume que ya revisaste el [Checklist WABA]({{ '/es/waba-checklist/' | relative_url }}) y tienes el número, la cuenta de Facebook y los datos de la empresa listos.

## 1. Iniciar sesión con Facebook

Meta usa una cuenta personal de Facebook para crear y administrar el Portafolio Comercial:

1. Inicia sesión con la cuenta de Facebook que será propietaria o administradora de la conexión WABA.
2. Si la cuenta aún no tiene un Portafolio Comercial, Meta crea uno automáticamente.
3. Acepta los términos y permisos solicitados por WhatsApp.

Usa una cuenta de Facebook con nombre real y documentos válidos. Las cuentas no verificadas o restringidas pueden bloquear el proceso.

## 2. Crear o seleccionar un Portafolio Comercial

El Portafolio Comercial es el contenedor de tu cuenta de WhatsApp Business, método de pago y datos comerciales:

- Si la empresa ya tiene un portafolio, elígelo de la lista.
- De lo contrario, crea un nuevo portafolio con un nombre comercial claro.

Después de la creación, el portafolio se puede acceder en [business.facebook.com](https://business.facebook.com).

## 3. Completar los datos de la empresa

Meta solicita el nombre de visualización comercial y la categoría. Asegúrate de que el nombre de visualización:

- Coincida con el nombre de la empresa o marca visible en el sitio institucional.
- No incluya términos genéricos como "WhatsApp" o "Soporte", a menos que formen parte de la marca registrada.
- Siga las directrices de Meta para nombres de visualización.

La categoría comercial debe reflejar la actividad real de la empresa.

## 4. Verificar el número de teléfono

Meta envía un código de 6 dígitos al número que se está conectando:

1. Elige la entrega por SMS o llamada de voz.
2. Recibe el código en el dispositivo o línea que tiene acceso al número.
3. Ingresa el código en la pantalla de onboarding.

### Sin coexistencia

Si el número ya está activo en una aplicación de WhatsApp común y **no** estás usando coexistencia, puede ser necesario borrar la cuenta de WhatsApp del dispositivo primero. Consulta detalles en el [Checklist WABA]({{ '/es/waba-checklist/' | relative_url }}).

### Con coexistencia

Si tu proveedor ofrece **coexistencia**, el mismo número permanece activo en la aplicación de WhatsApp del celular mientras también funciona a través de la API:

1. Durante la configuración, el popover de onboarding del proveedor puede mostrar un **código QR**.
2. Abre WhatsApp en el teléfono que posee el número.
3. Ve a la pantalla de dispositivos vinculados o dispositivo complementario y escanea el código QR.
4. Espera la confirmación de que el dispositivo fue vinculado.

Después de que la conexión de la API esté activa, tanto la aplicación como la API pueden enviar y recibir mensajes para el mismo número. Las calificaciones de calidad y los límites de mensajes siguen siendo administrados por Meta.

## 5. Configurar pagos

Para enviar mensajes de plantilla fuera de la ventana de atención al cliente de 24 horas, agrega un método de pago:

1. En la configuración de WhatsApp, ve a la sección de pagos.
2. Registra una tarjeta de crédito.
3. Confirma el país y la moneda de facturación.

Sin un método de pago, la conexión puede recibir mensajes, pero la empresa no podrá iniciar nuevas conversaciones con plantillas.

## 6. Enviar la empresa para verificación

Después de conectar el número, Meta puede requerir la verificación de la empresa para desbloquear límites de mensajes y funciones de plantillas:

1. En el Portafolio Comercial, inicia el proceso de verificación de la empresa.
2. Proporciona el nombre comercial legal, la dirección, el teléfono y el sitio web.
3. Confirma que la información coincida con los documentos oficiales y el sitio web de la empresa.

Meta intentará primero la verificación por teléfono. Si eso falla, se te pedirá subir:

- Contrato social u otro documento equivalente de registro de la empresa.
- Documento de identidad oficial del representante legal.

## 7. Confirmar que WABA está conectado

Una vez que el número esté verificado y los pagos configurados, el canal de la API de WhatsApp Business aparecerá como conectado en el panel de tu proveedor. Podrás entonces:

- Recibir mensajes de clientes.
- Enviar mensajes de plantilla para conversaciones iniciadas por la empresa.
- Monitorear calificaciones de calidad y límites de mensajes en el Administrador Comercial de Meta.

La verificación de la empresa aún puede estar en curso, y eso es esperado. Mantén los documentos de verificación a mano y responde cualquier solicitud de Meta para completarla.

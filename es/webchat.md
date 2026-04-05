---
title: Webchat
lang: es
slug: webchat
description: Guía de configuración e integración de Webchat en Ticketz PRO.
---

## Índice

1. [Sobre Webchat](#sobre-webchat)
2. [Configuración en Ticketz](#configuracion-en-ticketz)
3. [Integración básica](#integracion-basica)
4. [Personalización](#personalizacion)
5. [Verificación](#verificacion)

## Sobre Webchat

Webchat es un widget flotante que permite a tus clientes iniciar conversaciones directamente desde tu sitio web. Es responsivo y funciona en desktop y móvil.

## Configuración en Ticketz

### Crear una conexión Webchat

1. Accede al panel administrativo de Ticketz.
2. Ve a Conexiones -> Nueva Conexión.
3. Selecciona Webchat como tipo de conexión.
4. Configura los campos:
   - Nombre: Nombre descriptivo de la conexión (ej.: `webchat-principal`).
   - Channel UUID / ID de Conexión: Identificador único (generado automáticamente).
   - Título de la Ventana: Texto mostrado en la parte superior del chat (ej.: `Soporte en Línea`).
   - Subtítulo de la Ventana: Descripción breve (ej.: `Responderemos pronto`).
   - Mensaje CTA: Texto mostrado junto al botón flotante (ej.: `Habla con nosotros`).
   - Color Primario: Color principal del botón y destacados (ej.: `#0066CC`).
   - Color Secundario: Color secundario de apoyo (ej.: `#00AA00`).
   - Color de Fondo (Surface): Fondo de la ventana del chat (ej.: `#FFFFFF`).
   - Color de Texto (Text): Color principal de los textos (ej.: `#0F172A`).

Después de guardar, recibirás un ID de Conexión (código único). Copia ese ID para usarlo en la integración.

## Integración básica

### Ejemplo mínimo

Agrega este código al final del HTML de tu sitio, antes de `</body>`:

```html
<script>
  window.WebchatChannelId = "tu-id-conexion-aqui";
</script>
<script src="https://tu-dominio-ticketz.com/webchat-fab.js" async></script>
```

Reemplaza:

- `tu-dominio-ticketz.com` por la URL de tu instalación de Ticketz (ej.: `chat.tuempresa.com`).
- `tu-id-conexion-aqui` por el ID de conexión copiado del panel.

Con esto, un botón flotante aparecerá automáticamente en la esquina inferior derecha de la página.

## Personalización

### Método 1: Desde el panel (recomendado)

Al crear o editar la conexión Webchat en el panel, configura:

| Campo                         | Descripción                                       | Ejemplo                  |
| ----------------------------- | ------------------------------------------------- | ------------------------ |
| Channel UUID / ID de Conexión | Identificador único de la conexión (solo lectura) | `a1b2c3d4-...`           |
| Título de la Ventana          | Título mostrado arriba del chat                   | `Soporte en Línea`       |
| Subtítulo de la Ventana       | Descripción breve                                 | `Equipo disponible 24/7` |
| Mensaje CTA                   | Texto mostrado junto al icono flotante            | `Habla con nosotros`     |
| Color Primario                | Color del botón y elementos principales           | `#0066CC`                |
| Color Secundario              | Color de resaltados y bordes                      | `#00AA00`                |
| Color de Fondo (Surface)      | Color de fondo de la ventana de chat              | `#FFFFFF`                |
| Color de Texto (Text)         | Color principal de los textos                     | `#0F172A`                |

Este método es el más recomendado para la administración diaria.

Cómo priorizar en el panel:

1. Define Título y Subtítulo para el contexto de atención.
2. Usa el Mensaje CTA para aumentar clics en el botón.
3. Ajusta Color Primario y Color Secundario para alinearlos con la marca.

Resultado: el widget queda estandarizado para todos los sitios que usan esta conexión.

### Método 2: Desde variables globales (opcional)

Puedes sobrescribir el comportamiento visual directamente en la página con variables `window`:

| Variable                         | Descripción                               | Valor por defecto |
| -------------------------------- | ----------------------------------------- | ----------------- |
| `window.WebchatCtaMessage`       | Sobrescribe el mensaje CTA del panel      | Vacío (usa panel) |
| `window.WebchatFabPulseEnabled`  | Activa o desactiva la pulsación del botón | `true`            |
| `window.WebchatFabPulseDuration` | Duración de la animación (en segundos)    | `0.5`             |
| `window.WebchatFabPulseScale`    | Escala máxima de pulsación                | `1.1`             |

Ejemplo con sobrescritura por variables:

```html
<script>
  window.WebchatChannelId = "tu-id-conexion";
  window.WebchatCtaMessage = "Atención inmediata";
  window.WebchatFabPulseEnabled = true;
  window.WebchatFabPulseDuration = 0.5;
  window.WebchatFabPulseScale = 1.1;
</script>
<script src="https://tu-dominio-ticketz.com/webchat-fab.js" async></script>
```

Nota: la pulsación se configura por variables `window`, no por el panel de la conexión. Los valores por defecto actuales son duración `0.5s` y escala `1.1`.

### Método 3: Desde URL del webchat (opcional)

Para ajustar la ventana interna del chat, pasa parámetros en `WebchatPath`:

| Parámetro   | Descripción           | Formato                                |
| ----------- | --------------------- | -------------------------------------- |
| `title`     | Título de la ventana  | `title=Soporte`                        |
| `subtitle`  | Subtítulo             | `subtitle=Equipo%20Online`             |
| `lang`      | Idioma de la interfaz | `lang=es` (pt, en, es, fr, de, id, it) |
| `primary`   | Color primario        | `primary=%230066CC`                    |
| `secondary` | Color secundario      | `secondary=%2300AA00`                  |
| `surface`   | Color de fondo        | `surface=%23FFFFFF`                    |
| `text`      | Color de texto        | `text=%23333333`                       |

Ejemplo con parámetros en URL del webchat:

```html
<script>
  window.WebchatChannelId = "tu-id-conexion";
  window.WebchatPath =
    "/webchat.html?lang=es&primary=%230066CC&secondary=%2300AA00&surface=%23FFFFFF&text=%23333333";
</script>
<script src="https://tu-dominio-ticketz.com/webchat-fab.js" async></script>
```

Consejo: la configuración de la conexión en el panel es la base. Las variables `window` y los parámetros de URL sobrescriben cuando se informan.

### Idiomas disponibles

Webchat detecta automáticamente el idioma del navegador. Idiomas soportados:

- Portugués (pt)
- Inglés (en)
- Español (es)
- Francés (fr)
- Alemán (de)
- Indonesio (id)
- Italiano (it)

## Verificación

### El chat no aparece?

1. Verifica que la URL de Ticketz sea accesible.
2. Confirma que el ID de conexión sea exacto (cópialo de nuevo del panel).
3. Abre la consola del navegador (F12) y busca errores.
4. Revisa en la pestaña Network si `webchat-fab.js` se cargó correctamente.

### El botón aparece, pero no abre?

1. Haz clic nuevamente en el botón.
2. Verifica si el servidor Ticketz está en ejecución y accesible.
3. Busca errores en la consola del navegador.

Versión: 1.0  
Actualizado: marzo de 2026

---
title: WHMCS
lang: es
slug: whmcs
description: Conecta el control de suscripción de WHMCS con Ticketz PRO.
---

Aunque WHMCS no sea exactamente una pasarela de pago, Ticketz lo trata como tal porque controla el acceso a las suscripciones usando los métodos de pago configurados dentro de WHMCS.

Ticketz utiliza el estado de la suscripción en WHMCS para aprovisionar y mantener el acceso a los planes.

## Preparación en WHMCS

### Pasarela de pago

La configuración de la pasarela en sí queda fuera del alcance de esta guía. Elige el proveedor de cobro más adecuado, como Mercado Pago, ASAAS o Stripe.

### Creación del producto

1. Abre **Productos/Servicios**.
2. Crea un producto del tipo **Otro Producto/Servicio**.
3. Elige o crea un grupo adecuado.
4. Define el nombre y selecciona el módulo **Auto Release**.
5. En la pestaña **Precio**, indica el valor más bajo del plan que quieras ofrecer, mantén la recurrencia mensual y deja el precio activo.
6. En **Campos Personalizados**, crea un campo obligatorio de contraseña:
   - **Nombre del Campo**: `Password`
   - **Tipo del Campo**: `Password`
   - **Descripción**: `Contraseña para el primer inicio de sesión`
7. Guarda el producto y anota el código que aparece en la URL del navegador después de `&id=`.

### Opciones configurables para los planes

1. Abre **Opciones Configurables**.
2. Crea un nuevo grupo y asígnalo al producto.
3. Añade una nueva opción configurable llamada `Plan` con tipo `Dropdown`.
4. Crea una opción por cada plan de Ticketz.

Los nombres de los planes deben coincidir exactamente con los de Ticketz. Cualquier diferencia rompe el mapeo.

### Credenciales de API

En **Manage API Credentials**:

1. En **API Roles**, crea un rol llamado `querycustomer`.
2. Habilita `GetClientsDetails` y `GetClientsProducts` en el grupo **Client**.
3. En **API Credentials**, crea una credencial asociada a ese rol.
4. Guarda los dos valores generados: **Identifier** y **Secret**.

### Permitir acceso a la API

En **Configuración General** y luego **Seguridad**, añade la IP del servidor Ticketz en **API IP Access Restriction**.

## Preparación en Ticketz

### Crear los planes

En Ticketz, crea los planes con exactamente los mismos nombres usados en WHMCS. La recurrencia mensual es la recomendación más simple.

### Configurar la pasarela

En Ticketz, ve a **Configuración** y luego **Payment Gateways**. Selecciona la pasarela WHMCS y completa:

- **Base URL**: URL raíz de la instalación de WHMCS
- **API Identifier**: valor generado en WHMCS
- **API Secret**: secreto correspondiente generado en WHMCS
- **Product Code**: código del producto creado antes

## Flujo de uso

Después de la configuración no hay un paso operativo extra. Cuando el cliente compra el producto en el carrito de WHMCS, elige un plan y define una contraseña. Tras la confirmación del pago:

- Ticketz crea la empresa con el nombre del cliente en WHMCS
- Ticketz activa el plan seleccionado
- Ticketz usa la fecha de vencimiento de WHMCS
- el cliente accede con el email de la compra y la contraseña definida

Después del primer acceso, el cliente puede cambiar la contraseña y crear nuevos usuarios según los límites del plan.

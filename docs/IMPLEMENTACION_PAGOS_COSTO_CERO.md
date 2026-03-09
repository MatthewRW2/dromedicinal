# 📋 PLAN DE IMPLEMENTACIÓN: Sistema de Pagos $0 - Droguería Dromedicinal

**Versión:** 1.0  
**Fecha:** Enero 2026  
**Autor:** Arquitectura de Pagos  
**Stack:** Next.js (Frontend) + PHP (Backend) + MySQL (BD)

---

## 📑 ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura del Sistema de Pagos](#2-arquitectura-del-sistema-de-pagos)
3. [Fase 1: Base de Datos](#3-fase-1-base-de-datos)
4. [Fase 2: Backend PHP](#4-fase-2-backend-php)
5. [Fase 3: Frontend Next.js](#5-fase-3-frontend-nextjs)
6. [Fase 4: Backoffice Admin](#6-fase-4-backoffice-admin)
7. [Operación Diaria](#7-operación-diaria)
8. [Testing y Validación](#8-testing-y-validación)
9. [Checklist de Producción](#9-checklist-de-producción)

---

## 1. RESUMEN EJECUTIVO

### 1.1 Objetivo

Implementar un checkout completo para la droguería con **costo $0 en comisiones** usando conciliación manual.

### 1.2 Métodos de Pago a Implementar

| Método | Código | Requiere Comprobante | Costo |
|--------|--------|---------------------|-------|
| Pago en tienda (efectivo) | `CASH_PICKUP` | ❌ No | $0 |
| Contraentrega (efectivo) | `CASH_ON_DELIVERY` | ❌ No | $0 |
| Transferencia bancaria | `BANK_TRANSFER` | ✅ Sí | $0 |
| Nequi (QR/número) | `NEQUI` | ✅ Sí | $0 |
| DaviPlata (número) | `DAVIPLATA` | ✅ Sí | $0 |
| Bre-B (llave) | `BREB` | ✅ Sí | $0 |

### 1.3 Modelo de Negocio

**Clave del modelo $0**: No hay confirmación automática de pagos. Se confirma con:
1. Cliente sube comprobante (captura de pantalla)
2. Staff valida manualmente en backoffice
3. Si es válido → Orden pasa a PAID

> ⚠️ Si en el futuro quieres confirmación automática (webhooks, APIs), ya NO será $0: requiere convenio comercial con Nequi/DaviPlata y fees por transacción.

### 1.4 Flujo General del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO COMPLETO DE COMPRA                             │
└─────────────────────────────────────────────────────────────────────────────┘

  [1] CARRITO              [2] CHECKOUT             [3] CREAR ORDEN
  ─────────────            ────────────             ───────────────
  Usuario agrega    →      Llena formulario:  →    POST /api/orders
  productos al             - Nombre                 - Genera reference
  localStorage             - Celular                  (DRO-20260117-A3F2)
                           - Dirección              - Guarda en MySQL
                           - Barrio                 - Estado: CREATED
                           - Notas
                           - Método de pago
                                  │
                                  ▼
  [4] INICIAR PAGO         [5] INSTRUCCIONES        [6] SUBIR COMPROBANTE
  ──────────────           ────────────────         ─────────────────────
  POST /api/payments  →    Pantalla muestra:   →   (Solo si método lo
  - Crea registro          - Referencia GRANDE       requiere)
  - Estado: PENDING        - Monto exacto          - Cliente sube imagen
  - Expira en 30 min       - Instrucciones         - Estado: PROOF_UPLOADED
                           - Botón copiar
                           - QR si aplica
                                  │
                                  ▼
  [7] BACKOFFICE           [8] VERIFICACIÓN         [9] ORDEN PAGADA
  ──────────────           ────────────────         ─────────────────
  Admin ve lista de   →    Admin revisa:       →   - Payment: VERIFIED
  pagos pendientes         - Comprobante            - Order: PAID
                           - Monto correcto?        - Notificar cliente
                           - Referencia visible?      (WhatsApp manual)
                           - [Aprobar/Rechazar]
                                  │
                                  ▼
                          [10] PREPARACIÓN Y ENTREGA
                          ─────────────────────────
                          PAID → PREPARING → READY → COMPLETED
                                    o
                          PAID → PREPARING → OUT_FOR_DELIVERY → COMPLETED
```

---

## 2. ARQUITECTURA DEL SISTEMA DE PAGOS

### 2.1 Estado Actual del Proyecto

Basado en el análisis del repositorio:

```
ESTADO ACTUAL (Sin sistema de pagos)
────────────────────────────────────
✅ Catálogo de productos funcionando
✅ Carrito de intención (localStorage)
✅ Generación de mensaje WhatsApp
✅ Panel admin con autenticación JWT
✅ Sistema de auditoría
✅ Uploads seguros de imágenes
✅ Rate limiting y CORS

❌ NO hay tabla de órdenes
❌ NO hay tabla de pagos
❌ NO hay endpoints de checkout
❌ NO hay flujo de estados de pedido
❌ TODO se pierde al enviar por WhatsApp
```

### 2.2 Archivos Nuevos a Crear

```
📁 database/
   └── 002_orders_payments.sql          ← NUEVO: Migración de tablas

📁 backend/src/
   ├── Controllers/
   │   ├── OrderController.php          ← NUEVO
   │   └── PaymentController.php        ← NUEVO
   │
   ├── Services/
   │   ├── OrderService.php             ← NUEVO
   │   └── PaymentService.php           ← NUEVO
   │
   └── Repositories/
       ├── OrderRepository.php          ← NUEVO
       ├── PaymentRepository.php        ← NUEVO
       └── PaymentEventRepository.php   ← NUEVO

📁 frontend/src/app/(public)/
   ├── checkout/
   │   └── page.jsx                     ← NUEVO: Formulario de checkout
   │
   ├── pago/
   │   └── [reference]/
   │       └── page.jsx                 ← NUEVO: Instrucciones de pago
   │
   └── pedido/
       └── [reference]/
           └── page.jsx                 ← NUEVO: Estado del pedido

📁 frontend/src/app/admin/
   ├── pedidos/
   │   └── page.jsx                     ← NUEVO: Lista de pedidos
   │
   └── pagos/
       └── page.jsx                     ← NUEVO: Verificación de pagos
```

### 2.3 Archivos a Modificar

```
📁 backend/src/Config/
   └── routes.php                       ← MODIFICAR: Agregar rutas

📁 frontend/src/lib/
   └── api.js                           ← MODIFICAR: Agregar endpoints
```

### 2.4 Estados del Sistema

#### Estados de Orden (`orders.status`)

| Estado | Descripción | Siguiente Estado Válido |
|--------|-------------|------------------------|
| `CREATED` | Orden recién creada | AWAITING_PAYMENT, PAID*, CANCELLED |
| `AWAITING_PAYMENT` | Esperando pago | PAID, CANCELLED |
| `PAID` | Pago verificado | PREPARING, CANCELLED |
| `PREPARING` | En preparación | READY, CANCELLED |
| `READY` | Listo para entrega/recogida | OUT_FOR_DELIVERY, COMPLETED, CANCELLED |
| `OUT_FOR_DELIVERY` | En camino (domicilio) | COMPLETED, CANCELLED |
| `COMPLETED` | Entregado | - (estado final) |
| `CANCELLED` | Cancelado | - (estado final) |

*PAID directo: Solo para CASH_PICKUP/CASH_ON_DELIVERY donde el pago es al entregar.

#### Estados de Pago (`payments.status`)

| Estado | Descripción | Siguiente Estado Válido |
|--------|-------------|------------------------|
| `INITIATED` | Pago iniciado (efectivo) | COMPLETED |
| `PENDING` | Esperando comprobante | PROOF_UPLOADED, EXPIRED |
| `PROOF_UPLOADED` | Comprobante subido | VERIFIED, REJECTED |
| `VERIFIED` | Verificado por admin | COMPLETED |
| `REJECTED` | Rechazado por admin | - |
| `EXPIRED` | Expiró sin comprobante | - |
| `COMPLETED` | Pago completado | - (estado final) |

---

## 3. FASE 1: BASE DE DATOS

### 3.1 Archivo de Migración

**Crear archivo:** `database/002_orders_payments.sql`

Este archivo debe contener:

#### Tabla `orders`

```sql
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  reference VARCHAR(30) NOT NULL,              -- DRO-20260117-A3F2
  
  -- Datos del cliente
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  customer_email VARCHAR(160) NULL,
  customer_document VARCHAR(20) NULL,
  
  -- Entrega
  delivery_mode ENUM('PICKUP', 'DELIVERY') NOT NULL DEFAULT 'DELIVERY',
  delivery_address VARCHAR(500) NULL,
  delivery_neighborhood VARCHAR(120) NULL,
  delivery_notes TEXT NULL,
  
  -- Montos
  subtotal DECIMAL(12,2) NOT NULL,
  delivery_fee DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'COP',
  
  -- Estado y método
  status ENUM('CREATED','AWAITING_PAYMENT','PAID','PREPARING','READY',
              'OUT_FOR_DELIVERY','COMPLETED','CANCELLED') NOT NULL DEFAULT 'CREATED',
  payment_method ENUM('CASH_PICKUP','CASH_ON_DELIVERY','BANK_TRANSFER',
                      'NEQUI','DAVIPLATA','BREB') NOT NULL,
  
  -- Metadatos
  internal_notes TEXT NULL,
  cancelled_reason VARCHAR(255) NULL,
  cancelled_at DATETIME NULL,
  cancelled_by_user_id BIGINT UNSIGNED NULL,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  paid_at DATETIME NULL,
  completed_at DATETIME NULL,
  
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_reference (reference),
  KEY idx_orders_status (status),
  KEY idx_orders_created (created_at)
);
```

#### Tabla `order_items`

```sql
CREATE TABLE order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  
  -- Snapshot del producto
  product_name VARCHAR(200) NOT NULL,
  product_presentation VARCHAR(180) NULL,
  product_sku VARCHAR(60) NULL,
  product_slug VARCHAR(220) NULL,
  
  -- Cantidades
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  notes VARCHAR(255) NULL,
  
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### Tabla `payments`

```sql
CREATE TABLE payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  
  -- Método y monto
  method ENUM('CASH_PICKUP','CASH_ON_DELIVERY','BANK_TRANSFER',
              'NEQUI','DAVIPLATA','BREB') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'COP',
  
  -- Estado
  status ENUM('INITIATED','PENDING','PROOF_UPLOADED','VERIFIED',
              'REJECTED','EXPIRED','COMPLETED') NOT NULL DEFAULT 'INITIATED',
  
  -- Referencia para conciliación
  reference VARCHAR(50) NOT NULL,              -- DRO-20260117-A3F2-P1
  
  -- Comprobante
  proof_path VARCHAR(500) NULL,
  proof_original_name VARCHAR(255) NULL,
  proof_mime_type VARCHAR(100) NULL,
  proof_size INT UNSIGNED NULL,
  proof_uploaded_at DATETIME NULL,
  
  -- Verificación
  verified_at DATETIME NULL,
  verified_by_user_id BIGINT UNSIGNED NULL,
  verification_notes VARCHAR(500) NULL,
  
  -- Rechazo
  rejected_at DATETIME NULL,
  rejected_by_user_id BIGINT UNSIGNED NULL,
  rejection_reason VARCHAR(255) NULL,
  
  -- Expiración
  expires_at DATETIME NULL,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_reference (reference),
  KEY idx_payments_order (order_id),
  KEY idx_payments_status (status),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT
);
```

#### Tabla `payment_events`

```sql
CREATE TABLE payment_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payment_id BIGINT UNSIGNED NULL,
  order_id BIGINT UNSIGNED NULL,
  
  event_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
  data JSON NULL,
  
  user_id BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  UNIQUE KEY uq_payment_events_event_id (event_id),
  KEY idx_payment_events_payment (payment_id)
);
```

#### Configuraciones de Pago

```sql
INSERT INTO settings (setting_key, setting_value) VALUES
('payment_bank_name', 'Bancolombia'),
('payment_bank_account_type', 'Ahorros'),
('payment_bank_account_number', ''),           -- CONFIGURAR
('payment_bank_account_holder', 'Droguería Dromedicinal'),
('payment_bank_nit', ''),                       -- CONFIGURAR
('payment_nequi_number', '573134243625'),
('payment_nequi_name', 'Droguería Dromedicinal'),
('payment_daviplata_number', '573134243625'),
('payment_daviplata_name', 'Droguería Dromedicinal'),
('payment_breb_key', ''),                       -- CONFIGURAR (celular o NIT)
('payment_breb_key_type', 'celular'),
('payment_breb_name', 'Droguería Dromedicinal'),
('payment_proof_expiration_minutes', '30'),
('payment_enabled_methods', 'CASH_PICKUP,CASH_ON_DELIVERY,BANK_TRANSFER,NEQUI,DAVIPLATA,BREB');
```

### 3.2 Cómo Ejecutar la Migración

1. Abrir **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Seleccionar base de datos `dromedicinal_web`
3. Ir a pestaña **Importar**
4. Seleccionar archivo `database/002_orders_payments.sql`
5. Clic en **Ejecutar**

### 3.3 Crear Directorio para Comprobantes

```bash
# Crear directorio
mkdir -p backend/storage/uploads/proofs

# Crear .gitkeep
touch backend/storage/uploads/proofs/.gitkeep
```

Agregar a `backend/.gitignore`:
```
storage/uploads/proofs/*
!storage/uploads/proofs/.gitkeep
```

---

## 4. FASE 2: BACKEND PHP

### 4.1 Repositorios a Crear

#### OrderRepository.php

**Ubicación:** `backend/src/Repositories/OrderRepository.php`

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `generateReference()` | Genera referencia única: `DRO-YYYYMMDD-XXXX` |
| `findByReference($ref)` | Buscar orden por referencia |
| `findWithItems($id)` | Obtener orden con sus items |
| `createWithItems($data, $items)` | Crear orden + items en transacción |
| `updateStatus($id, $status)` | Actualizar estado con timestamps automáticos |
| `listWithFilters($filters, $page)` | Listar con filtros y paginación |

#### PaymentRepository.php

**Ubicación:** `backend/src/Repositories/PaymentRepository.php`

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `generateReference($orderRef)` | Genera: `DRO-YYYYMMDD-XXXX-P1` |
| `findByReference($ref)` | Buscar pago por referencia |
| `findActiveByOrderAndMethod($orderId, $method)` | Para idempotencia |
| `findWithOrder($id)` | Pago con datos de orden |
| `listPendingVerification($page)` | Pagos esperando verificación |
| `markExpired()` | Marcar pagos expirados |

#### PaymentEventRepository.php

**Ubicación:** `backend/src/Repositories/PaymentEventRepository.php`

**Métodos principales:**

| Método | Descripción |
|--------|-------------|
| `logEvent($type, $paymentId, $orderId, ...)` | Registrar evento de auditoría |
| `getByPayment($paymentId)` | Historial de eventos de un pago |
| `getByOrder($orderId)` | Todos los eventos de una orden |

### 4.2 Servicios a Crear

#### OrderService.php

**Ubicación:** `backend/src/Services/OrderService.php`

**Responsabilidades:**

1. **Crear orden desde checkout**
   - Validar items contra productos en BD
   - Calcular totales (subtotal, delivery, total)
   - Generar referencia única
   - Crear orden + items en transacción
   - Registrar evento de auditoría

2. **Obtener métodos de pago**
   - Leer configuración de settings
   - Retornar array con info de cada método
   - Incluir instrucciones según método

3. **Actualizar estado de orden**
   - Validar transición de estado válida
   - Actualizar timestamps según estado
   - Registrar evento

4. **Cancelar orden**
   - Validar que se puede cancelar
   - Guardar motivo y usuario
   - Registrar evento

#### PaymentService.php

**Ubicación:** `backend/src/Services/PaymentService.php`

**Responsabilidades:**

1. **Iniciar pago**
   - Verificar estado de orden
   - Verificar método habilitado
   - **Idempotencia**: Si ya existe pago activo, retornarlo
   - Generar referencia de pago
   - Calcular expiración (30 min para transferencias)
   - Crear registro de pago
   - Actualizar orden a AWAITING_PAYMENT

2. **Subir comprobante**
   - Verificar estado del pago (PENDING)
   - Verificar no expirado
   - Validar archivo (tipo, tamaño, MIME real)
   - Guardar en `storage/uploads/proofs/YYYY/MM/`
   - Actualizar pago a PROOF_UPLOADED
   - Registrar evento

3. **Verificar pago (admin)**
   - Verificar estado (PROOF_UPLOADED)
   - Actualizar pago a VERIFIED
   - Actualizar orden a PAID
   - Registrar evento con usuario

4. **Rechazar pago (admin)**
   - Verificar estado (PROOF_UPLOADED)
   - Actualizar pago a REJECTED
   - Guardar motivo
   - Registrar evento

5. **Procesar expirados**
   - Query para pagos PENDING/INITIATED con expires_at < NOW()
   - Marcar como EXPIRED

### 4.3 Controladores a Crear

#### OrderController.php

**Ubicación:** `backend/src/Controllers/OrderController.php`

**Endpoints públicos:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/public/payment-methods` | Lista métodos disponibles |
| POST | `/public/orders` | Crear orden |
| GET | `/public/orders/{reference}` | Ver estado de orden |

**Endpoints admin:**

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/admin/orders` | ✅ | Listar órdenes |
| GET | `/admin/orders/{id}` | ✅ | Ver detalle |
| PUT | `/admin/orders/{id}/status` | ✅ | Cambiar estado |
| PUT | `/admin/orders/{id}/cancel` | ✅ admin | Cancelar orden |

#### PaymentController.php

**Ubicación:** `backend/src/Controllers/PaymentController.php`

**Endpoints públicos:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/public/orders/{reference}/payments` | Iniciar pago |
| GET | `/public/payments/{reference}` | Ver estado de pago |
| POST | `/public/payments/{reference}/proof` | Subir comprobante |

**Endpoints admin:**

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/admin/payments` | ✅ | Listar pagos |
| GET | `/admin/payments/pending` | ✅ | Pagos pendientes |
| GET | `/admin/payments/{id}` | ✅ | Ver detalle |
| POST | `/admin/payments/{id}/verify` | ✅ | Verificar pago |
| POST | `/admin/payments/{id}/reject` | ✅ | Rechazar pago |

### 4.4 Rutas a Agregar

**Archivo a modificar:** `backend/src/Config/routes.php`

Agregar al final:

```php
// ==============================================
// RUTAS PÚBLICAS - ÓRDENES Y PAGOS
// ==============================================

$router->get('/public/payment-methods', 'OrderController@getPaymentMethods');
$router->post('/public/orders', 'OrderController@store');
$router->get('/public/orders/{reference}', 'OrderController@showByReference');
$router->post('/public/orders/{reference}/payments', 'PaymentController@initiate');
$router->get('/public/payments/{reference}', 'PaymentController@showByReference');
$router->post('/public/payments/{reference}/proof', 'PaymentController@uploadProof');

// ==============================================
// RUTAS ADMIN - ÓRDENES
// ==============================================

$router->get('/admin/orders', 'OrderController@index', ['auth']);
$router->get('/admin/orders/{id}', 'OrderController@show', ['auth']);
$router->put('/admin/orders/{id}/status', 'OrderController@updateStatus', ['auth', 'role:admin,catalog_manager']);
$router->put('/admin/orders/{id}/cancel', 'OrderController@cancel', ['auth', 'role:admin']);

// ==============================================
// RUTAS ADMIN - PAGOS
// ==============================================

$router->get('/admin/payments', 'PaymentController@index', ['auth']);
$router->get('/admin/payments/pending', 'PaymentController@pendingList', ['auth']);
$router->get('/admin/payments/{id}', 'PaymentController@show', ['auth']);
$router->post('/admin/payments/{id}/verify', 'PaymentController@verify', ['auth', 'role:admin,catalog_manager']);
$router->post('/admin/payments/{id}/reject', 'PaymentController@reject', ['auth', 'role:admin,catalog_manager']);
```

### 4.5 Validaciones Críticas

#### En creación de orden:
- [ ] Items no vacíos
- [ ] Cada item tiene product_id o product_name
- [ ] Cantidad >= 1
- [ ] Método de pago habilitado
- [ ] Si delivery_mode=DELIVERY → dirección requerida
- [ ] Total > 0

#### En subida de comprobante:
- [ ] Pago existe
- [ ] Estado es PENDING
- [ ] No ha expirado
- [ ] Archivo presente
- [ ] Tamaño <= 5MB
- [ ] MIME type válido (verificar con finfo, no confiar en extensión)
- [ ] Tipos permitidos: image/jpeg, image/png, image/webp, application/pdf

#### En verificación/rechazo:
- [ ] Pago existe
- [ ] Estado es PROOF_UPLOADED
- [ ] Usuario autenticado
- [ ] Si rechazo → motivo requerido

---

## 5. FASE 3: FRONTEND NEXT.JS

### 5.1 Páginas Nuevas a Crear

#### /checkout - Formulario de Checkout

**Archivo:** `frontend/src/app/(public)/checkout/page.jsx`

**Funcionalidad:**
- Mostrar resumen del carrito
- Formulario de datos del cliente
- Selector de modo de entrega (Recoger/Domicilio)
- Selector de método de pago (cards clickeables)
- Validación de campos requeridos
- Submit → POST /api/orders → Redirect a /pago/[reference]

**Campos del formulario:**

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| customer_name | text | ✅ | min 2 chars |
| customer_phone | tel | ✅ | min 7 chars |
| customer_email | email | ❌ | formato email |
| delivery_mode | radio | ✅ | PICKUP o DELIVERY |
| delivery_address | textarea | Si DELIVERY | min 5 chars |
| delivery_neighborhood | select | Si DELIVERY | de lista |
| delivery_notes | textarea | ❌ | - |
| payment_method | radio/cards | ✅ | método válido |

**UI del selector de métodos:**

```
┌─────────────────────────────────────────────────────────────┐
│  ¿Cómo deseas pagar?                                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ 🏪 Pago en tienda   │  │ 💵 Contraentrega    │          │
│  │ Paga al recoger     │  │ Paga al recibir     │          │
│  │ [ SELECCIONADO ✓ ]  │  │                     │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ 💜 Nequi            │  │ 🔴 DaviPlata        │          │
│  │ Envía a Nequi       │  │ Envía a DaviPlata   │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ 🏦 Transferencia    │  │ 💛 Bre-B            │          │
│  │ Cuenta bancaria     │  │ Desde cualquier     │          │
│  │                     │  │ banco               │          │
│  └─────────────────────┘  └─────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

#### /pago/[reference] - Instrucciones de Pago

**Archivo:** `frontend/src/app/(public)/pago/[reference]/page.jsx`

**Funcionalidad:**
- Cargar datos del pago (GET /api/payments/{reference})
- Mostrar instrucciones según método
- Countdown de expiración
- Botón "Copiar referencia"
- Si requiere comprobante: formulario de upload
- Submit → POST /api/payments/{reference}/proof
- Polling de estado cada 10 segundos

**UI para métodos que requieren comprobante:**

```
┌─────────────────────────────────────────────────────────────┐
│  💜 Pago con Nequi                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Tu referencia de pago:                   │   │
│  │                                                     │   │
│  │         DRO-20260117-A3F2-P1                       │   │
│  │                                                     │   │
│  │              [📋 Copiar]                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Monto a pagar:                         │   │
│  │                                                     │   │
│  │              $45,000 COP                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ⏱️ Tiempo restante: 28:45                                 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📱 Instrucciones:                                          │
│  1. Abre tu app Nequi                                       │
│  2. Selecciona "Enviar dinero"                              │
│  3. Ingresa el número: 313 424 3625                         │
│  4. Ingresa el monto exacto: $45,000                        │
│  5. En descripción, escribe: DRO-20260117-A3F2-P1          │
│  6. Confirma el pago                                        │
│  7. Sube el comprobante aquí abajo                          │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ⚠️ IMPORTANTE: Incluye la referencia en el concepto       │
│     del pago para que podamos identificarlo.                │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │           📤 Subir comprobante                     │   │
│  │                                                     │   │
│  │    Arrastra una imagen o haz clic para             │   │
│  │    seleccionar el comprobante de pago              │   │
│  │                                                     │   │
│  │    Formatos: JPG, PNG, PDF (máx 5MB)              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**UI para efectivo (sin comprobante):**

```
┌─────────────────────────────────────────────────────────────┐
│  💵 Pago contra entrega                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Tu pedido ha sido registrado                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Referencia: DRO-20260117-A3F2              │   │
│  │         Total: $45,000 COP                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📞 Te contactaremos por WhatsApp al 313 424 3625          │
│     para confirmar tu pedido y coordinar la entrega.        │
│                                                             │
│  💵 Recuerda tener el monto exacto listo para pagar         │
│     cuando recibas tu pedido.                               │
│                                                             │
│            [Ver estado del pedido →]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### /pedido/[reference] - Estado del Pedido

**Archivo:** `frontend/src/app/(public)/pedido/[reference]/page.jsx`

**Funcionalidad:**
- Cargar datos de la orden (GET /api/orders/{reference})
- Mostrar timeline de estados
- Polling cada 30 segundos
- Datos del pedido (items, totales)
- Información de contacto

**UI del timeline:**

```
┌─────────────────────────────────────────────────────────────┐
│  📦 Estado de tu pedido: DRO-20260117-A3F2                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Pedido creado ───────────────────── 17 Ene, 10:30 AM   │
│  │                                                          │
│  ✅ Pago verificado ─────────────────── 17 Ene, 10:45 AM   │
│  │                                                          │
│  🔄 En preparación ──────────────────── En progreso...     │
│  │                                                          │
│  ○ Listo para entrega                                       │
│  │                                                          │
│  ○ Completado                                               │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📋 Detalle del pedido:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Acetaminofén 500mg x 10       x2     $12,000     │   │
│  │ • Vitamina C 1000mg             x1     $18,000     │   │
│  │ • Alcohol antiséptico 350ml     x1     $15,000     │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Subtotal:                              $45,000     │   │
│  │ Envío:                                 $0          │   │
│  │ Total:                                 $45,000     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📍 Entrega: Calle 79 #70-16, Bonanza                       │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ¿Tienes preguntas?                                         │
│  💬 Escríbenos: wa.me/573134243625                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Modificar Carrito Existente

**Archivo a modificar:** `frontend/src/app/(public)/carrito/page.jsx`

**Cambios:**
1. Agregar botón "Proceder al pago" junto al botón de WhatsApp
2. El botón redirige a `/checkout`
3. Mantener WhatsApp como opción alternativa

```jsx
{/* Agregar después del botón de WhatsApp */}
<Link
  href="/checkout"
  className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
>
  💳 Proceder al pago
</Link>
```

### 5.3 Actualizar Cliente API

**Archivo a modificar:** `frontend/src/lib/api.js`

**Agregar a `publicAPI`:**

```javascript
// Métodos de pago
getPaymentMethods: () => fetchAPI('/public/payment-methods'),

// Órdenes
createOrder: (data) => fetchAPI('/public/orders', {
  method: 'POST',
  body: JSON.stringify(data),
}),
getOrder: (reference) => fetchAPI(`/public/orders/${reference}`),

// Pagos
initiatePayment: (orderReference, method) => fetchAPI(`/public/orders/${orderReference}/payments`, {
  method: 'POST',
  body: JSON.stringify({ method }),
}),
getPayment: (reference) => fetchAPI(`/public/payments/${reference}`),
uploadProof: async (paymentReference, file) => { /* FormData upload */ },
```

**Agregar a `adminAPI`:**

```javascript
// Órdenes
orders: {
  list: (params) => fetchAPI(`/admin/orders?${new URLSearchParams(params)}`),
  get: (id) => fetchAPI(`/admin/orders/${id}`),
  updateStatus: (id, status) => fetchAPI(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  cancel: (id, reason) => fetchAPI(`/admin/orders/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) }),
},

// Pagos
payments: {
  list: (params) => fetchAPI(`/admin/payments?${new URLSearchParams(params)}`),
  pending: () => fetchAPI('/admin/payments/pending'),
  get: (id) => fetchAPI(`/admin/payments/${id}`),
  verify: (id, notes) => fetchAPI(`/admin/payments/${id}/verify`, { method: 'POST', body: JSON.stringify({ notes }) }),
  reject: (id, reason) => fetchAPI(`/admin/payments/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
},
```

---

## 6. FASE 4: BACKOFFICE ADMIN

### 6.1 Página de Pedidos

**Archivo:** `frontend/src/app/admin/pedidos/page.jsx`

**Funcionalidad:**
- Tabla de pedidos con filtros
- Filtrar por: estado, método de pago, fecha, referencia
- Ver detalle de cada pedido
- Cambiar estado (botones de acción)
- Cancelar pedido (con modal de confirmación)

**Columnas de la tabla:**

| Columna | Descripción |
|---------|-------------|
| Referencia | DRO-XXXXXX (link a detalle) |
| Cliente | Nombre + Teléfono |
| Total | Monto en COP |
| Método | Icono + nombre |
| Estado | Badge con color |
| Fecha | Fecha/hora de creación |
| Acciones | Botones según estado |

### 6.2 Página de Pagos Pendientes

**Archivo:** `frontend/src/app/admin/pagos/page.jsx`

**Funcionalidad:**
- Lista de pagos con estado PROOF_UPLOADED
- Ver comprobante (imagen/PDF)
- Información de la orden asociada
- Botones: Aprobar / Rechazar
- Modal de rechazo (pedir motivo)
- Registro de quién verificó

**UI de verificación:**

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Verificar Pago: DRO-20260117-A3F2-P1                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────┐  ┌───────────────────────────┐│
│  │                         │  │ Orden: DRO-20260117-A3F2  ││
│  │    [IMAGEN DEL          │  │ Cliente: Juan Pérez       ││
│  │     COMPROBANTE]        │  │ Tel: 313 424 3625         ││
│  │                         │  │                           ││
│  │    (click para zoom)    │  │ Método: Nequi             ││
│  │                         │  │ Monto esperado: $45,000   ││
│  │                         │  │                           ││
│  │                         │  │ Referencia de pago:       ││
│  │                         │  │ DRO-20260117-A3F2-P1      ││
│  │                         │  │                           ││
│  │                         │  │ Subido: Hace 5 minutos    ││
│  └─────────────────────────┘  └───────────────────────────┘│
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Checklist de verificación:                                 │
│  ☐ El monto coincide con $45,000                           │
│  ☐ La referencia es visible en el comprobante              │
│  ☐ El comprobante parece auténtico                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Notas (opcional):                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│      [❌ Rechazar]                    [✅ Aprobar Pago]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Agregar al Sidebar Admin

**Archivo a modificar:** `frontend/src/components/layout/AdminSidebar.jsx`

Agregar nuevos items:

```jsx
{
  href: '/admin/pedidos',
  label: 'Pedidos',
  icon: IconShoppingBag, // o similar
},
{
  href: '/admin/pagos',
  label: 'Pagos pendientes',
  icon: IconCreditCard,
  badge: pendingPaymentsCount, // Mostrar cantidad
},
```

---

## 7. OPERACIÓN DIARIA

### 7.1 Flujo de Trabajo del Staff

#### Mañana (9:00 AM)

1. **Revisar pagos pendientes**
   - Ir a Admin → Pagos pendientes
   - Para cada pago con comprobante:
     - Abrir comprobante
     - Verificar monto y referencia
     - Aprobar o rechazar

2. **Revisar pedidos nuevos**
   - Ir a Admin → Pedidos
   - Filtrar por estado: PAID
   - Cambiar a PREPARING los que se van a preparar

#### Durante el día

3. **Actualizar estados**
   - Cuando un pedido está listo: PREPARING → READY
   - Cuando sale a domicilio: READY → OUT_FOR_DELIVERY
   - Cuando se entrega: → COMPLETED

4. **Manejar rechazos**
   - Si un comprobante no es válido, rechazar con motivo claro
   - El cliente puede reintentar el pago

#### Tarde (5:00 PM)

5. **Revisión final**
   - Verificar pagos pendientes restantes
   - Revisar pedidos sin movimiento

### 7.2 Criterios para Verificar Pagos

**APROBAR si:**
- ✅ El monto es exactamente igual al esperado
- ✅ La referencia es visible en el comprobante
- ✅ El comprobante parece auténtico (no editado)
- ✅ La fecha/hora es reciente

**RECHAZAR si:**
- ❌ El monto no coincide
- ❌ No se ve la referencia
- ❌ El comprobante parece alterado
- ❌ La fecha es de hace mucho tiempo
- ❌ El comprobante es de otra transacción

### 7.3 Motivos de Rechazo Comunes

| Motivo | Mensaje sugerido |
|--------|------------------|
| Monto incorrecto | "El monto del comprobante ($X) no coincide con el total del pedido ($Y)" |
| Sin referencia | "No se puede identificar la referencia de pago en el comprobante" |
| Comprobante ilegible | "El comprobante no es legible. Por favor sube una imagen más clara" |
| Comprobante inválido | "El comprobante no corresponde a una transacción válida" |
| Expirado | "El comprobante corresponde a una fecha fuera del período válido" |

### 7.4 Métricas a Monitorear

| Métrica | Objetivo | Alerta si |
|---------|----------|-----------|
| Pagos pendientes de verificación | < 5 | > 10 |
| Tiempo promedio de verificación | < 15 min | > 30 min |
| Tasa de rechazo | < 5% | > 10% |
| Pagos expirados | < 5% | > 15% |
| Órdenes canceladas | < 3% | > 5% |

---

## 8. TESTING Y VALIDACIÓN

### 8.1 Casos de Prueba del Checkout

| # | Caso | Pasos | Resultado esperado |
|---|------|-------|-------------------|
| 1 | Checkout exitoso con Nequi | Agregar producto, checkout, seleccionar Nequi, llenar datos | Orden creada, redirigir a instrucciones |
| 2 | Checkout sin productos | Ir a /checkout con carrito vacío | Redirigir a carrito |
| 3 | Checkout sin nombre | Llenar todo excepto nombre, submit | Error de validación |
| 4 | Checkout sin método | Llenar datos, no seleccionar método | Error de validación |
| 5 | Checkout domicilio sin dirección | Seleccionar DELIVERY, no poner dirección | Error de validación |
| 6 | Checkout recoger en tienda | Seleccionar PICKUP, no poner dirección | Éxito sin dirección |

### 8.2 Casos de Prueba del Pago

| # | Caso | Pasos | Resultado esperado |
|---|------|-------|-------------------|
| 1 | Subir comprobante válido | Subir JPG < 5MB | Comprobante guardado, estado PROOF_UPLOADED |
| 2 | Subir archivo muy grande | Subir imagen > 5MB | Error: tamaño máximo excedido |
| 3 | Subir tipo inválido | Subir .exe o .js | Error: tipo no permitido |
| 4 | Subir después de expirar | Esperar 30+ min, subir | Error: tiempo expirado |
| 5 | Verificar pago | Admin aprueba comprobante | Pago VERIFIED, orden PAID |
| 6 | Rechazar pago | Admin rechaza con motivo | Pago REJECTED, motivo guardado |
| 7 | Doble submit comprobante | Subir mismo comprobante 2 veces | Solo se guarda una vez |

### 8.3 Casos Borde

| # | Caso | Comportamiento esperado |
|---|------|------------------------|
| 1 | Pago duplicado para misma orden | Retornar pago existente (idempotencia) |
| 2 | Orden con producto eliminado | order_items.product_id = NULL, datos snapshot preservados |
| 3 | Admin verifica pago ya verificado | Error: pago no está pendiente |
| 4 | Cancelar orden ya completada | Error: no se puede cancelar |
| 5 | Múltiples pestañas de checkout | Primera que submit gana, segunda recibe error |

### 8.4 Checklist Pre-Producción

#### Backend
- [ ] Todas las rutas funcionan
- [ ] Validaciones en todos los endpoints
- [ ] Errores no exponen información sensible
- [ ] Uploads solo aceptan tipos permitidos
- [ ] CORS configurado correctamente
- [ ] Rate limiting en endpoints públicos

#### Frontend
- [ ] Checkout funciona en móvil
- [ ] Countdown de expiración funciona
- [ ] Upload de comprobante funciona
- [ ] Polling de estado funciona
- [ ] Errores se muestran al usuario

#### Base de datos
- [ ] Tablas creadas correctamente
- [ ] Índices funcionando
- [ ] Configuraciones de pago llenadas
- [ ] Foreign keys funcionando

#### Seguridad
- [ ] No hay datos sensibles en logs
- [ ] Comprobantes guardados fuera de public
- [ ] Referencias no predecibles
- [ ] Validación MIME real en uploads

---

## 9. CHECKLIST DE PRODUCCIÓN

### 9.1 Antes de Lanzar

#### Configuración de Negocio
- [ ] `payment_bank_account_number` configurado
- [ ] `payment_bank_nit` configurado
- [ ] `payment_nequi_number` verificado
- [ ] `payment_daviplata_number` verificado
- [ ] `payment_breb_key` configurado
- [ ] Métodos habilitados en `payment_enabled_methods`

#### Verificar Funcionamiento
- [ ] Crear orden de prueba con cada método
- [ ] Subir comprobante de prueba
- [ ] Verificar y rechazar pagos de prueba
- [ ] Completar ciclo completo de una orden

#### Comunicación
- [ ] Mensaje de WhatsApp actualizado para notificar sobre sistema web
- [ ] Staff capacitado en uso del backoffice
- [ ] Procedimiento de verificación documentado

### 9.2 Después de Lanzar

#### Día 1-3
- [ ] Monitorear errores en logs
- [ ] Revisar pagos pendientes frecuentemente
- [ ] Obtener feedback de primeros usuarios
- [ ] Ajustar tiempo de expiración si necesario

#### Semana 1
- [ ] Revisar métricas de conversión
- [ ] Identificar fricción en checkout
- [ ] Evaluar necesidad de métodos adicionales

### 9.3 Mejoras Futuras (Fase 1+)

| Mejora | Beneficio | Costo |
|--------|-----------|-------|
| Integración Nequi API | Confirmación automática | ~1.5-2% fee + convenio |
| Integración DaviPlata API | Confirmación automática | Fee variable + convenio |
| Notificaciones por email | Mejor comunicación | Gratis (SMTP básico) |
| Notificaciones WhatsApp API | Automáticas | Fee por mensaje |
| Checkout con tarjetas | Más opciones de pago | ~2.9% + $900 por transacción |

---

## ANEXOS

### A. Estructura de Respuestas API

#### Éxito
```json
{
  "data": { ... },
  "meta": { "page": 1, "total": 50 },
  "error": null
}
```

#### Error
```json
{
  "data": null,
  "meta": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campo requerido",
    "details": { "customer_name": "required" }
  }
}
```

### B. Formato de Referencias

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Orden | `DRO-YYYYMMDD-XXXX` | DRO-20260117-A3F2 |
| Pago | `DRO-YYYYMMDD-XXXX-P#` | DRO-20260117-A3F2-P1 |
| Evento | `TYPE_P#_TIMESTAMP_RAND` | PROOF_UPLOADED_P123_1737123456789_a1b2 |

### C. Datos de Prueba

#### Orden de prueba
```json
{
  "customer_name": "Juan Prueba",
  "customer_phone": "3001234567",
  "delivery_mode": "DELIVERY",
  "delivery_address": "Calle 79 #70-16",
  "delivery_neighborhood": "Bonanza",
  "payment_method": "NEQUI",
  "items": [
    { "product_id": 1, "quantity": 2 }
  ]
}
```

---

**Fin del documento de implementación.**

Para comenzar la implementación, sigue las fases en orden:
1. ✅ Base de datos (ejecutar migración)
2. ✅ Backend (crear repositorios, servicios, controladores)
3. ✅ Frontend (crear páginas de checkout, pago, estado)
4. ✅ Backoffice (crear páginas de admin)
5. ✅ Testing y validación
6. 🚀 Lanzamiento

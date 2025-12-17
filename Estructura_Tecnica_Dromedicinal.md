# Estructura Técnica del Proyecto Web — Droguería Dromedicinal

**Documento:** Estructura técnica (Frontend + Backend + BD)  
**Proyecto:** Sitio público + Panel administrativo para catálogo y promociones  
**Stack:** Next.js + React + Tailwind CSS / PHP (MVC sin librerías) / MySQL  
**Dominio:** dromedicinal.com  

---

## 1) Visión general

El objetivo del proyecto es construir una plataforma web moderna para **Droguería Dromedicinal** que permita:

- **Publicar y organizar el catálogo** por categorías y subcategorías.
- **Facilitar pedidos** mediante **WhatsApp** (principal) y un CTA visible a **Rappi** (alterno).
- **Centralizar información operativa**: servicios, ubicación, horarios, cobertura, preguntas frecuentes, enlaces de interés y contacto.
- **Habilitar un panel administrativo** para que el equipo gestione productos, categorías, promociones y contenido sin depender de terceros.
- **Mejorar visibilidad local (SEO local)** y medición de campañas (GA4/Meta Pixel).

> **Nota importante (MVP):** no se implementa checkout ni pagos en línea. El “carrito” (si se activa en MVP) funcionará como “lista de intención” para armar el pedido y enviarlo a WhatsApp.

---

## 2) Alcance funcional

### 2.1 Sitio público (MVP)

**Páginas y módulos**
- **Inicio**: propuesta de valor, categorías destacadas, promociones destacadas, CTA WhatsApp, CTA Rappi.
- **Catálogo**:
  - Vista por categorías y subcategorías.
  - Filtros básicos (búsqueda por texto, marca si aplica, disponibilidad, rangos de precio opcional).
  - Paginación.
- **Detalle de producto**:
  - Nombre, presentación, descripción, imágenes.
  - Precio (si aplica) y disponibilidad.
  - Botón “Pedir por WhatsApp” con mensaje prellenado.
- **Promociones y ofertas**:
  - Campañas por temporada (rango de fechas, destacado).
  - Productos asociados a la promoción.
- **Servicios**: toma de tensión, glicemia, inyectología, domicilios, etc.
- **Nosotros**: historia, misión, visión, diferenciales.
- **Contacto**:
  - Formulario (guardado en BD y opcional envío a correo).
  - Mapa (Google Maps embed).
  - Datos de atención.
- **Preguntas frecuentes (FAQ)**.
- **Enlaces de interés** (SIC, uso seguro de medicamentos, PQRS, etc.).

**Pedidos**
- **WhatsApp**: canal principal.
- **Rappi**: enlace visible y persistente (header/footer y/o CTA).

### 2.2 Panel administrativo (MVP)

- **Autenticación** (login) + **roles y permisos**.
- **Gestión de catálogo**:
  - CRUD de categorías y subcategorías.
  - CRUD de productos: nombre, descripción, presentación, categoría(s), precio, disponibilidad.
  - Gestión de imágenes por producto (subir/ordenar/eliminar).
  - Slug automático para URL amigable.
- **Inventario básico (escalable)**:
  - Disponibilidad (en stock / bajo pedido / agotado).
  - (Opcional) stock_qty y alerta low_stock_threshold.
- **Promociones**:
  - CRUD de campañas (fechas, banner, estado).
  - Asociar productos a promociones.
- **Servicios, FAQ y Enlaces**:
  - CRUD de servicios.
  - CRUD de preguntas frecuentes.
  - CRUD de enlaces de interés.
- **Usuarios**:
  - CRUD de usuarios (solo admin).
  - Asignación de roles.
- **Reportes básicos**:
  - Productos activos/inactivos.
  - Stock bajo (si se activa stock_qty).
  - Top productos más consultados (si se implementa tracking interno) o al menos métricas vía GA4.

---

## 3) Arquitectura general

### 3.1 Componentes

- **Frontend (Next.js + React + Tailwind)**
  - Render SEO (SSR/SSG/ISR) para páginas públicas del catálogo.
  - Panel admin protegido (CSR; o SSR si se requiere).
  - Cliente HTTP para consumir la API PHP.
  - Generación de links de WhatsApp/Rappi.
  - Instrumentación de analítica (GA4/Pixel).

- **Backend (PHP puro, API REST, MVC)**
  - API bajo `/api/v1`.
  - Arquitectura MVC con Front Controller.
  - Capa de servicios y repositorios (PDO) para acceso a datos.
  - Gestión de sesiones (cookie HttpOnly) para administración.
  - Validación, sanitización y control de permisos.

- **Base de datos (MySQL)**
  - Catálogo: categorías, productos, imágenes.
  - Contenido: promociones, servicios, FAQ, enlaces.
  - Operación: usuarios/roles, mensajes de contacto, auditoría.

### 3.2 Diagrama lógico (alto nivel)

```
Usuario (Web/Móvil)
   |
   |  Navega catálogo / envía contacto / clic WhatsApp
   v
Next.js (UI + SSR/SSG/ISR)
   |
   |  fetch JSON (público y admin)
   v
PHP API (MVC)  ----->  MySQL
   |
   +--> uploads (imágenes de productos)
```

---

## 4) Frontend — Next.js + React + Tailwind CSS

### 4.1 Enfoque técnico

- **Next.js** para rendimiento y SEO:
  - Páginas públicas: SSG/ISR para catálogo y producto (ideal para SEO).
  - Admin: CSR para simplicidad (sin afectar SEO).
- **Tailwind CSS** como sistema de diseño:
  - Tokens de marca (colores corporativos).
  - Componentes reutilizables: botones, cards, badges, tablas, modales, formularios.
- **Accesibilidad y UX**:
  - Navegación por teclado en admin.
  - Contraste adecuado (especialmente en CTAs).
  - Mobile-first.

### 4.2 Estructura recomendada del repositorio (frontend)

> Ejemplo usando **App Router** (Next.js moderno). Si se decide Pages Router, la idea es equivalente.

```
frontend/
  app/
    (public)/
      layout.tsx
      page.tsx                        # Inicio
      catalogo/
        page.tsx                      # listado general
        [categoria]/
          page.tsx                    # listado por categoría/subcategoría
      producto/
        [slug]/
          page.tsx                    # detalle de producto
      promociones/
        page.tsx
      servicios/
        page.tsx
      nosotros/
        page.tsx
      contacto/
        page.tsx
      preguntas-frecuentes/
        page.tsx
      enlaces/
        page.tsx
      sitemap.xml/route.ts            # sitemap dinámico
      robots.txt/route.ts
    admin/
      layout.tsx
      login/page.tsx
      page.tsx                        # dashboard admin
      productos/
        page.tsx
        nuevo/page.tsx
        [id]/editar/page.tsx
      categorias/
        page.tsx
      promociones/
        page.tsx
      servicios/
        page.tsx
      faqs/
        page.tsx
      enlaces/
        page.tsx
      usuarios/
        page.tsx
      reportes/
        page.tsx
  components/
    layout/
      Header.tsx
      Footer.tsx
      AdminSidebar.tsx
    catalogo/
      CategoryGrid.tsx
      ProductCard.tsx
      ProductGallery.tsx
      FiltersBar.tsx
      Pagination.tsx
    ui/
      Button.tsx
      Input.tsx
      Select.tsx
      Modal.tsx
      Badge.tsx
      Table.tsx
      Toast.tsx
  lib/
    api.ts                            # fetch wrapper (baseURL, errores)
    whatsapp.ts                       # builder de mensajes y links
    seo.ts                            # helpers SEO/metadata
    analytics.ts                      # eventos GA4/Pixel
    auth.ts                           # helpers de sesión admin
  styles/
    globals.css
  tailwind.config.js
  next.config.js
  .env.local
```

### 4.3 Diseño de marca en Tailwind (tokens)

En `tailwind.config.js` se recomienda definir los colores corporativos como tokens:

- `brand.blueLight`
- `brand.blue`
- `brand.green`
- `brand.red`
- `brand.gray`

Esto permite mantener consistencia en todo el proyecto y facilitar ajustes.

### 4.4 Cliente API (fetch wrapper)

Recomendación: un wrapper único con:

- `baseURL` desde `NEXT_PUBLIC_API_BASE_URL`
- `credentials: 'include'` para admin (sesión por cookie)
- Manejo estándar de errores (HTTP 4xx/5xx)
- Timeouts básicos (si se implementan)

Ejemplo de contrato de respuesta (consistente):

```json
{
  "data": {},
  "meta": { "page": 1, "per_page": 24, "total": 120 },
  "error": null
}
```

### 4.5 SEO técnico (MVP)

- Titles/descriptions por página.
- URLs limpias con slugs (`/producto/acetaminofen-500mg-x10`).
- **Sitemap** dinámico basado en productos/categorías publicados.
- **robots.txt** y canonical tags.
- **Local SEO**:
  - Schema.org `LocalBusiness` en home/contacto.
  - Datos consistentes en footer (dirección, teléfono, horarios).

### 4.6 Analítica (MVP)

- Integración **GA4** y **Meta Pixel**.
- Eventos mínimos:
  - `view_product`
  - `click_whatsapp` (incluye product_id/slug si aplica)
  - `click_rappi`
  - `search_catalog`
  - `submit_contact_form`
  - `view_promotion`

### 4.7 WhatsApp: “carrito de intención” (opcional MVP)

- El usuario agrega productos a una lista local (localStorage).
- Botón “Enviar pedido por WhatsApp” construye un mensaje con:
  - Lista de productos (nombre + presentación + cantidad).
  - Observaciones.
  - Dirección (si el usuario la escribe; opcional).
- Se abre `https://wa.me/<numero>?text=<mensaje>`.

---

## 5) Backend — PHP puro (MVC) + API REST

### 5.1 Principios

- **Sin librerías externas**: solo PHP nativo (PDO, sesiones, password_hash, etc.).
- **API-first**: el backend entrega JSON; no renderiza vistas.
- **MVC**:
  - Controllers: reciben request y responden.
  - Services: lógica de negocio.
  - Repositories: acceso a MySQL (PDO).
- **Middlewares** para:
  - CORS
  - Auth (sesión)
  - RBAC (roles/permisos)
  - Validación de JSON
  - Rate limit en login
  - Manejo de errores consistente

### 5.2 Estructura recomendada (backend)

```
backend/
  public/
    index.php                         # front controller
    .htaccess                         # (si aplica en Apache)
  src/
    Core/
      Router.php
      Request.php
      Response.php
      Database.php                    # PDO + config
      Session.php
      Validator.php
    Config/
      config.php                      # constantes base
      routes.php                      # registro de rutas
    Middleware/
      CorsMiddleware.php
      AuthMiddleware.php              # sesión requerida
      RoleMiddleware.php              # RBAC
      JsonBodyMiddleware.php
      RateLimitMiddleware.php
    Controllers/
      AuthController.php
      PublicController.php
      CategoryController.php
      ProductController.php
      PromotionController.php
      ServiceController.php
      FaqController.php
      LinkController.php
      UserController.php
      ReportController.php
      ContactController.php
    Services/
      AuthService.php
      CategoryService.php
      ProductService.php
      PromotionService.php
      ContentService.php
      UserService.php
      ReportService.php
      ContactService.php
    Repositories/
      CategoryRepository.php
      ProductRepository.php
      PromotionRepository.php
      ContentRepository.php
      UserRepository.php
      ContactRepository.php
      AuditRepository.php
    Helpers/
      Slug.php
      Files.php                       # upload seguro
      Security.php
    Models/                           # opcional si se usan DTOs simples
  storage/
    logs/
    uploads/
      products/
  .env                                # variables (sin exponer)
```

### 5.3 Enrutamiento y versión de API

- Prefijo: `/api/v1`
- Separar claramente:
  - `GET` públicos para catálogo/servicios/etc.
  - CRUD admin protegido por sesión.

### 5.4 Autenticación (admin) — Sesiones seguras

**Propuesta MVP:**
- `POST /api/v1/auth/login` crea sesión de admin y setea cookie HttpOnly.
- `POST /api/v1/auth/logout` destruye sesión.
- `GET /api/v1/auth/me` devuelve usuario actual + rol.

**Buenas prácticas:**
- Cookie `HttpOnly`, `Secure` (HTTPS) y `SameSite=Lax` (o `Strict` si aplica).
- CSRF: validación por `Origin/Referer` en endpoints mutables (POST/PUT/DELETE) del admin.
- Rate limit para login.

> Si en el futuro se requiere acceso móvil o integraciones externas, se puede evolucionar a JWT sin modificar el diseño de controllers/services (solo AuthMiddleware y AuthService).

### 5.5 RBAC (roles y permisos)

Roles sugeridos (ajustables):
- `admin`: todo (incluye usuarios).
- `catalog_manager`: productos/categorías/imagenes/inventario.
- `marketing`: promociones/featured/banners.
- `viewer`: lectura de admin/reportes.

Implementación:
- Tabla `roles` y `users.role_id`.
- Middleware `RoleMiddleware` que valide acceso por ruta.

### 5.6 Manejo de imágenes (uploads)

- Endpoint admin: `POST /api/v1/admin/products/{id}/images`
- Validaciones:
  - Extensión/mime permitido (jpg, png, webp).
  - Tamaño máximo (ej. 2–5 MB).
  - Nombre seguro (hash + extensión).
- Almacenamiento:
  - `storage/uploads/products/{product_id}/...`
- En BD se guarda `path`, `is_primary`, `sort_order`.

### 5.7 Contrato de errores estándar

Ejemplo:
```json
{
  "data": null,
  "meta": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campo requerido",
    "details": { "name": "required" }
  }
}
```

### 5.8 Seguridad base (MVP)

- SQL Injection: **solo queries preparadas** (PDO).
- XSS: sanitizar salida donde aplique (principalmente en contenido editable).
- CORS: permitir solo dominios autorizados.
- Logs: registrar errores críticos y auditoría de cambios en admin.
- Backups: plan de backup diario de DB y uploads.

---

## 6) Modelo de datos — MySQL (propuesta MVP)

### 6.1 Entidades principales

- **users** / **roles**: administración y permisos.
- **categories**: categorías y subcategorías (árbol con `parent_id`).
- **products**: catálogo base.
- **product_images**: imágenes y orden.
- **promotions** + **promotion_products**: campañas y relación con productos.
- **services**: servicios ofrecidos.
- **faqs**: preguntas frecuentes.
- **links**: enlaces de interés.
- **contact_messages**: formularios enviados.
- **settings**: configuración editable (WhatsApp, Rappi URL, horarios, etc.).
- **audit_logs**: auditoría de cambios en admin.

### 6.2 Tablas (resumen)

#### roles
- `id`, `name`, `description`

#### users
- `id`, `name`, `email`, `password_hash`, `role_id`, `is_active`, `created_at`, `updated_at`

#### categories
- `id`, `parent_id` (nullable), `name`, `slug`, `is_active`, `sort_order`

#### products
- `id`, `category_id` (o tabla pivote si se requiere multi-categoría), `name`, `slug`, `presentation`, `description`, `brand` (opcional), `price` (decimal, opcional), `currency`, `availability_status`, `stock_qty` (opcional), `low_stock_threshold` (opcional), `is_active`, `created_at`, `updated_at`

`availability_status` sugerido:
- `IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`, `ON_REQUEST`

#### product_images
- `id`, `product_id`, `path`, `alt_text`, `is_primary`, `sort_order`, `created_at`

#### promotions
- `id`, `title`, `slug`, `description`, `starts_at`, `ends_at`, `is_active`, `banner_image_path` (opcional), `created_at`

#### promotion_products
- `promotion_id`, `product_id`, `sort_order`

#### services
- `id`, `title`, `description`, `icon` (opcional), `is_active`, `sort_order`

#### faqs
- `id`, `question`, `answer`, `is_active`, `sort_order`

#### links
- `id`, `title`, `url`, `category` (opcional), `is_active`, `sort_order`

#### contact_messages
- `id`, `name`, `email`, `phone`, `message`, `source_page`, `created_at`, `status`

#### settings
- `key`, `value`
  - Ej: `whatsapp_number`, `rappi_url`, `address`, `hours_weekdays`, `hours_sunday`, `social_instagram`, `social_facebook`

#### audit_logs
- `id`, `user_id`, `entity`, `entity_id`, `action`, `before_json`, `after_json`, `created_at`, `ip`

### 6.3 Índices recomendados (MVP)

- `categories.slug` UNIQUE
- `products.slug` UNIQUE
- `products.category_id` INDEX
- `products.is_active` INDEX
- `products.availability_status` INDEX
- `promotion_products (promotion_id, product_id)` PK compuesta
- `product_images (product_id, sort_order)`

---

## 7) Endpoints API — propuesta

### 7.1 Público (sin autenticación)

- `GET /api/v1/public/settings`
- `GET /api/v1/public/categories`
- `GET /api/v1/public/categories/{slug}`
- `GET /api/v1/public/products?category=slug&q=texto&page=1&per_page=24`
- `GET /api/v1/public/products/{slug}`
- `GET /api/v1/public/promotions`
- `GET /api/v1/public/promotions/{slug}`
- `GET /api/v1/public/services`
- `GET /api/v1/public/faqs`
- `GET /api/v1/public/links`
- `POST /api/v1/public/contact`

### 7.2 Auth (admin)

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### 7.3 Admin (sesión + roles)

- Categorías:
  - `GET /api/v1/admin/categories`
  - `POST /api/v1/admin/categories`
  - `PUT /api/v1/admin/categories/{id}`
  - `DELETE /api/v1/admin/categories/{id}`

- Productos:
  - `GET /api/v1/admin/products`
  - `POST /api/v1/admin/products`
  - `PUT /api/v1/admin/products/{id}`
  - `DELETE /api/v1/admin/products/{id}`
  - `POST /api/v1/admin/products/{id}/images`
  - `DELETE /api/v1/admin/products/{id}/images/{imageId}`
  - `PUT /api/v1/admin/products/{id}/images/reorder`

- Promociones:
  - `GET /api/v1/admin/promotions`
  - `POST /api/v1/admin/promotions`
  - `PUT /api/v1/admin/promotions/{id}`
  - `DELETE /api/v1/admin/promotions/{id}`

- Servicios / FAQ / Enlaces:
  - CRUD equivalente en `/api/v1/admin/services`, `/faqs`, `/links`

- Usuarios (solo admin):
  - `GET /api/v1/admin/users`
  - `POST /api/v1/admin/users`
  - `PUT /api/v1/admin/users/{id}`
  - `DELETE /api/v1/admin/users/{id}`

- Reportes:
  - `GET /api/v1/admin/reports/stock-low`
  - `GET /api/v1/admin/reports/catalog-summary`
  - (Opcional) `GET /api/v1/admin/reports/contact-messages`

---

## 8) Integraciones

### 8.1 WhatsApp (pedido asistido)

- Botones en:
  - Header (CTA general)
  - Home (CTA principal)
  - Detalle de producto (CTA con producto)
  - Carrito de intención (CTA con lista de productos)

Mensaje recomendado (producto individual):
- “Hola Dromedicinal, quiero pedir: {Producto} ({Presentación}). ¿Está disponible?”

Mensaje recomendado (carrito):
- “Hola Dromedicinal, quiero hacer este pedido:
  1) {Producto} x{qty}
  2) ...”

### 8.2 Rappi

- Un `settings.rappi_url` configurable en admin para no “quemar” URL en el código.
- CTA visible en home y footer (mínimo).

### 8.3 Google Maps

- Embed en contacto.
- Coordenadas configurables (settings) para evitar hardcode.

### 8.4 Redes sociales

- Links configurables a Facebook e Instagram (settings).

### 8.5 Analítica

- GA4 + Meta Pixel.
- Definir medición de objetivos:
  - Clics en WhatsApp
  - Envío de formulario
  - Vistas de producto
  - Vistas de promoción

---

## 9) Despliegue y ambientes

### 9.1 Variables de entorno (recomendación)

**Frontend**
- `NEXT_PUBLIC_API_BASE_URL=https://.../api/v1`
- `NEXT_PUBLIC_GA_ID=...`
- `NEXT_PUBLIC_META_PIXEL_ID=...`

**Backend**
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`
- `APP_ENV=prod|dev`
- `APP_URL=https://dromedicinal.com`
- `SESSION_COOKIE_SECURE=1`
- `CORS_ORIGINS=https://dromedicinal.com,https://www.dromedicinal.com`

### 9.2 Opciones de hosting (según capacidades del proveedor)

**Opción A (recomendada si hay soporte Node):**
- Nginx/Apache como reverse proxy.
- Next.js corriendo en Node (SSR/ISR).
- PHP-FPM para API.
- Misma raíz de dominio o subdominio.

**Opción B (si el hosting es solo PHP):**
- Export estático de Next.js para sitio público (SSG).
- Admin puede mantenerse en el mismo build estático + consumo API.
- Limitación: features SSR/ISR se reemplazan por re-builds programados cuando cambie catálogo.

> La decisión final depende del hosting real y si soporta Node.js en producción.

---

## 10) Roadmap de ejecución (4 semanas)

> Basado en el roadmap acordado, con enfoque técnico.

### Semana 1 — Diseño visual + base técnica
- Definir sitemap y arquitectura de rutas (public + admin).
- Setup Next.js + Tailwind + tokens de marca.
- Setup backend PHP (router, core, conexión PDO).
- Diseño de BD y migraciones iniciales.
- Prototipo UI (home, catálogo, producto, contacto).

### Semana 2 — Sitio público + catálogo navegable
- Implementación de páginas públicas.
- Endpoints públicos: categorías, productos, producto detalle.
- CTA WhatsApp/Rappi.
- Carga inicial de categorías y muestra de productos.

### Semana 3 — Panel administrativo + seguridad
- Login + sesiones seguras + RBAC.
- CRUD productos/categorías/imágenes.
- CRUD promociones.
- CRUD servicios/FAQ/enlaces.
- Reportes básicos (catálogo/stock bajo).

### Semana 4 — QA + SEO + lanzamiento
- Pruebas funcionales (public + admin).
- Optimización rendimiento (imágenes, caché, paginación).
- SEO técnico (sitemap, metadata, local schema).
- Analítica (GA4/Pixel) + eventos.
- Capacitación y guía corta de operación.
- Go-live.

---

## 11) Backlog (Fase 2 / opcional)

- Checkout y pagos en línea.
- Cuentas de clientes + historial de pedidos.
- Programa de fidelización.
- Integración avanzada con canales externos.
- Inventario avanzado (multi-ubicación, kardex, etc.).

---

## 12) Checklist de aceptación (Go-Live)

- [ ] SSL activo y redirección a HTTPS
- [ ] Sitemap + robots funcionando
- [ ] Catálogo navegable en móvil (sin fricción)
- [ ] WhatsApp link correcto (mensaje y número)
- [ ] Rappi link correcto
- [ ] Panel admin: login + roles + CRUD funcionando
- [ ] Upload imágenes seguro y estable
- [ ] Backups configurados (DB + uploads)
- [ ] GA4/Pixel registrando eventos clave
- [ ] Capacitación entregada y usuario admin creado


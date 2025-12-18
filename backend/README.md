# Backend API - Dromedicinal

API REST en PHP puro (sin frameworks) para el proyecto Dromedicinal.

## Requisitos

- PHP 8.0 o superior
- MySQL 5.7+ o MariaDB 10.3+
- Apache con mod_rewrite habilitado
- XAMPP (recomendado para desarrollo local)

## Estructura del Proyecto

```
backend/
├── public/
│   ├── index.php          # Front Controller
│   └── .htaccess          # Reescritura de URLs
├── src/
│   ├── Config/
│   │   ├── config.php     # Configuración general
│   │   └── routes.php     # Definición de rutas
│   ├── Core/
│   │   ├── Database.php   # Conexión PDO (Singleton)
│   │   ├── Request.php    # Abstracción de petición HTTP
│   │   ├── Response.php   # Abstracción de respuesta HTTP
│   │   ├── Router.php     # Enrutador
│   │   ├── Session.php    # Manejo de sesiones
│   │   └── Validator.php  # Validación de datos
│   ├── Middleware/
│   │   ├── AuthMiddleware.php
│   │   ├── CorsMiddleware.php
│   │   ├── JsonBodyMiddleware.php
│   │   ├── RateLimitMiddleware.php
│   │   └── RoleMiddleware.php
│   ├── Controllers/       # Controladores REST
│   ├── Services/          # Lógica de negocio
│   ├── Repositories/      # Acceso a datos
│   └── Helpers/           # Utilidades
├── storage/
│   ├── logs/              # Logs de errores
│   └── uploads/           # Archivos subidos
├── scripts/
│   └── create-admin.php   # Script para crear admin
└── .gitignore
```

## Instalación

### 1. Base de datos

Importar el schema en phpMyAdmin o desde consola:

```bash
mysql -u root < ../database/dromedicinal_web_schema.sql
```

### 2. Configuración

Editar `src/Config/config.php` o crear archivo `.env` en la raíz del backend:

```env
APP_ENV=dev
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=dromedicinal_web
DB_USER=root
DB_PASS=

CORS_ORIGINS=http://localhost:3000

SESSION_NAME=dromedicinal_session
SESSION_LIFETIME=7200
```

### 3. Crear usuario administrador

```bash
cd backend
php scripts/create-admin.php
```

### 4. Configurar servidor

#### Opción A: PHP Built-in Server (desarrollo)

```bash
cd backend/public
php -S localhost:8000
```

#### Opción B: XAMPP / Apache

Configurar Virtual Host en `httpd-vhosts.conf`:

```apache
<VirtualHost *:8000>
    DocumentRoot "C:/xampp/htdocs/dromedicinal/backend/public"
    ServerName localhost
    
    <Directory "C:/xampp/htdocs/dromedicinal/backend/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Agregar en `httpd.conf`:
```apache
Listen 8000
```

Reiniciar Apache.

## API Endpoints

### Públicos (sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/public/settings` | Configuración del sitio |
| GET | `/api/v1/public/categories` | Listado de categorías |
| GET | `/api/v1/public/categories/{slug}` | Categoría por slug |
| GET | `/api/v1/public/products` | Listado de productos |
| GET | `/api/v1/public/products/{slug}` | Producto por slug |
| GET | `/api/v1/public/featured-products` | Productos destacados |
| GET | `/api/v1/public/promotions` | Promociones activas |
| GET | `/api/v1/public/promotions/{slug}` | Promoción por slug |
| GET | `/api/v1/public/services` | Servicios |
| GET | `/api/v1/public/faqs` | Preguntas frecuentes |
| GET | `/api/v1/public/links` | Enlaces de interés |
| GET | `/api/v1/public/delivery-zones` | Zonas de cobertura |
| POST | `/api/v1/public/contact` | Enviar formulario de contacto |

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Iniciar sesión |
| POST | `/api/v1/auth/logout` | Cerrar sesión |
| GET | `/api/v1/auth/me` | Usuario actual |

### Admin (requieren autenticación)

#### Categorías
- `GET /api/v1/admin/categories` - Listar
- `POST /api/v1/admin/categories` - Crear
- `GET /api/v1/admin/categories/{id}` - Ver
- `PUT /api/v1/admin/categories/{id}` - Actualizar
- `DELETE /api/v1/admin/categories/{id}` - Eliminar

#### Productos
- `GET /api/v1/admin/products` - Listar
- `POST /api/v1/admin/products` - Crear
- `GET /api/v1/admin/products/{id}` - Ver
- `PUT /api/v1/admin/products/{id}` - Actualizar
- `DELETE /api/v1/admin/products/{id}` - Eliminar
- `POST /api/v1/admin/products/{id}/images` - Subir imagen
- `DELETE /api/v1/admin/products/{id}/images/{imageId}` - Eliminar imagen
- `PUT /api/v1/admin/products/{id}/images/reorder` - Reordenar imágenes

#### Promociones, Servicios, FAQs, Enlaces
- CRUD completo en `/api/v1/admin/[promotions|services|faqs|links]`

#### Usuarios (solo admin)
- CRUD completo en `/api/v1/admin/users`

#### Reportes
- `GET /api/v1/admin/reports/stock-low` - Productos con stock bajo
- `GET /api/v1/admin/reports/catalog-summary` - Resumen del catálogo
- `GET /api/v1/admin/reports/contact-messages` - Mensajes de contacto

#### Settings
- `GET /api/v1/admin/settings` - Ver configuración
- `PUT /api/v1/admin/settings` - Actualizar configuración

## Formato de Respuesta

### Éxito
```json
{
  "data": { ... },
  "meta": { "page": 1, "per_page": 24, "total": 100 },
  "error": null
}
```

### Error
```json
{
  "data": null,
  "meta": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": { "name": "El campo name es obligatorio" }
  }
}
```

## Roles y Permisos

| Rol | Permisos |
|-----|----------|
| `admin` | Acceso total |
| `catalog_manager` | Productos, categorías, servicios, FAQs, enlaces |
| `marketing` | Promociones, productos destacados |
| `viewer` | Solo lectura |

## Seguridad

- Contraseñas hasheadas con bcrypt (cost 12)
- Sesiones con cookies HttpOnly y SameSite
- Protección CSRF por Origin/Referer
- Rate limiting en login
- Validación y sanitización de inputs
- Queries preparadas (PDO)
- CORS configurado

## Desarrollo

### Probar la API

```bash
# Settings públicos
curl http://localhost:8000/api/v1/public/settings

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dromedicinal.com","password":"tu_contraseña"}'
```

### Logs

Los errores se registran en `storage/logs/error.log`


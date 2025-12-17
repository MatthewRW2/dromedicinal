-- ============================================================
-- Base de datos: Droguería Dromedicinal (MVP)
-- Motor: MySQL / MariaDB (XAMPP)
-- Charset recomendado: utf8mb4
-- ------------------------------------------------------------
-- Instrucciones (phpMyAdmin):
-- 1) Abrir phpMyAdmin -> Importar
-- 2) Seleccionar este archivo .sql
-- 3) Ejecutar
-- ------------------------------------------------------------
-- NOTA:
-- - El script crea la BD "dromedicinal_web". Puedes cambiar el nombre si lo deseas.
-- - Incluye datos iniciales (roles, settings, categorías raíz, servicios y zonas de cobertura).
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET SQL_MODE = 'NO_ENGINE_SUBSTITUTION';

-- (Opcional) Instalación limpia: descomenta para borrar la BD
-- DROP DATABASE IF EXISTS dromedicinal_web;

CREATE DATABASE IF NOT EXISTS dromedicinal_web
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dromedicinal_web;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Drop tables (re-ejecutable)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS promotion_products;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS delivery_zones;
DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Tabla: roles
-- ------------------------------------------------------------
CREATE TABLE roles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: users (solo administración del panel)
-- ------------------------------------------------------------
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role_id (role_id),
  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: categories (categorías y subcategorías)
-- Modelo: adjacency list (parent_id)
-- ------------------------------------------------------------
CREATE TABLE categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  parent_id BIGINT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  description TEXT NULL,
  image_path VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug),
  KEY idx_categories_parent_id (parent_id),
  KEY idx_categories_is_active (is_active),
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: products (catálogo)
-- ------------------------------------------------------------
CREATE TABLE products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  sku VARCHAR(60) NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  presentation VARCHAR(180) NULL,
  description TEXT NULL,
  brand VARCHAR(120) NULL,
  requires_prescription TINYINT(1) NOT NULL DEFAULT 0,
  price DECIMAL(12,2) NULL,
  currency CHAR(3) NOT NULL DEFAULT 'COP',
  availability_status ENUM('IN_STOCK','LOW_STOCK','OUT_OF_STOCK','ON_REQUEST') NOT NULL DEFAULT 'IN_STOCK',
  stock_qty INT NULL,
  low_stock_threshold INT NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  featured_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  UNIQUE KEY uq_products_sku (sku),
  KEY idx_products_category_id (category_id),
  KEY idx_products_is_active (is_active),
  KEY idx_products_availability (availability_status),
  KEY idx_products_featured (is_featured, featured_order),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: product_images (imágenes del producto)
-- ------------------------------------------------------------
CREATE TABLE product_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  path VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255) NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_images_product (product_id, sort_order),
  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: promotions (campañas / ofertas)
-- ------------------------------------------------------------
CREATE TABLE promotions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT NULL,
  starts_at DATETIME NULL,
  ends_at DATETIME NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  banner_image_path VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_promotions_slug (slug),
  KEY idx_promotions_active_dates (is_active, starts_at, ends_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: promotion_products (relación promoción <-> productos)
-- ------------------------------------------------------------
CREATE TABLE promotion_products (
  promotion_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (promotion_id, product_id),
  KEY idx_promotion_products_product (product_id),
  CONSTRAINT fk_promotion_products_promotion
    FOREIGN KEY (promotion_id) REFERENCES promotions(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_promotion_products_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: services (servicios)
-- ------------------------------------------------------------
CREATE TABLE services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  description TEXT NULL,
  icon VARCHAR(80) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_services_is_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: faqs (preguntas frecuentes)
-- ------------------------------------------------------------
CREATE TABLE faqs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_faqs_is_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: links (enlaces de interés)
-- ------------------------------------------------------------
CREATE TABLE links (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  url VARCHAR(500) NOT NULL,
  category VARCHAR(80) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_links_is_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: delivery_zones (zonas de cobertura / barrios)
-- ------------------------------------------------------------
CREATE TABLE delivery_zones (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_delivery_zones_name (name),
  KEY idx_delivery_zones_is_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: contact_messages (formulario de contacto)
-- ------------------------------------------------------------
CREATE TABLE contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NULL,
  phone VARCHAR(40) NULL,
  message TEXT NOT NULL,
  source_page VARCHAR(255) NULL,
  status ENUM('NEW','READ','ARCHIVED') NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_messages_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: settings (configuración del sitio)
-- ------------------------------------------------------------
CREATE TABLE settings (
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: audit_logs (auditoría de cambios en admin)
-- before_data / after_data se guardan como JSON (string) para compatibilidad
-- ------------------------------------------------------------
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  action ENUM('CREATE','UPDATE','DELETE','LOGIN','LOGOUT') NOT NULL,
  before_data LONGTEXT NULL,
  after_data LONGTEXT NULL,
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_user (user_id, created_at),
  KEY idx_audit_entity (entity, entity_id),
  CONSTRAINT fk_audit_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Datos iniciales (seed)
-- ============================================================

-- Roles base (ajustables)
INSERT INTO roles (name, description) VALUES
('admin', 'Acceso total al panel (incluye usuarios).'),
('catalog_manager', 'Gestiona productos, categorías e imágenes.'),
('marketing', 'Gestiona promociones, banners y destacados.'),
('viewer', 'Solo lectura del panel y reportes.');

-- IMPORTANTE: crear usuario admin desde tu backend (password_hash con password_hash())
-- Ejemplo (NO usar en producción tal cual): password_hash('Cambiar123', PASSWORD_BCRYPT)

-- Settings base del negocio (puedes actualizar en el panel o desde SQL)
INSERT INTO settings (setting_key, setting_value) VALUES
('business_name', 'Droguería Dromedicinal'),
('address', 'Av. 70 # 79-16, Engativá, Bogotá'),
('whatsapp_number', '573134243625'),
('contact_email', 'contacto@dromedicinal.com'),
('hours_weekdays', 'Lunes a Sábado: 7:30 a.m. – 9:30 p.m.'),
('hours_sundays', 'Domingos y Festivos: 8:30 a.m. – 8:30 p.m.'),
('rappi_url', ''),
('facebook_url', ''),
('instagram_url', ''),
('brand_color_green', '#3BAF5C'),
('brand_color_blue', '#2A7DB1'),
('brand_color_blue_light', '#0096D6'),
('brand_color_red', '#E74C3C'),
('brand_color_gray', '#555555'),
('brand_color_white', '#FFFFFF');

-- Categorías raíz (MVP) — puedes crear subcategorías desde el panel
INSERT INTO categories (parent_id, name, slug, sort_order) VALUES
(NULL, 'Medicamentos', 'medicamentos', 1),
(NULL, 'Nutrición y vida saludable', 'nutricion-y-vida-saludable', 2),
(NULL, 'Belleza', 'belleza', 3),
(NULL, 'Cuidado personal e higiene', 'cuidado-personal-e-higiene', 4),
(NULL, 'Dermocosméticos', 'dermocosmeticos', 5),
(NULL, 'Hogar y mascotas', 'hogar-y-mascotas', 6),
(NULL, 'Mamás y bebés', 'mamas-y-bebes', 7),
(NULL, 'Alimentos, confitería y bebidas', 'alimentos-confiteria-y-bebidas', 8),
(NULL, 'Tecnología y papelería', 'tecnologia-y-papeleria', 9);

-- Servicios (MVP) — editables en panel
INSERT INTO services (title, description, sort_order) VALUES
('Orientación farmacéutica', 'Asesoría profesional para el uso seguro y responsable de medicamentos.', 1),
('Toma de presión arterial', 'Servicio de medición de presión arterial con atención rápida.', 2),
('Control de glicemia', 'Medición de glicemia con orientación básica.', 3),
('Inyectología', 'Aplicación de inyectables según protocolos y normatividad.', 4),
('Domicilios', 'Entrega a domicilio en zonas de cobertura definidas.', 5),
('Recargas', 'Recargas y otros servicios complementarios según disponibilidad.', 6),
('Pago de servicios', 'Apoyo en pago de servicios públicos (según operación).', 7);

-- Zonas de cobertura (según levantamiento) — editables en panel
INSERT INTO delivery_zones (name, sort_order) VALUES
('Bonanza', 1),
('La Estrada', 2),
('Boyacá Real', 3),
('Villa Luz', 4),
('Ciudad Bachué', 5),
('La Granja', 6),
('Las Ferias', 7),
('Santa Helenita', 8),
('Normandía Occidental', 9),
('Bolivia', 10);

-- ============================================================
-- Fin
-- ============================================================

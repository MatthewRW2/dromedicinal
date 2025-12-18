-- ==============================================
-- CREAR USUARIO ADMINISTRADOR DIRECTAMENTE EN BD
-- Dromedicinal
-- ==============================================
-- 
-- INSTRUCCIONES:
-- 1. Abre phpMyAdmin: http://localhost/phpmyadmin
-- 2. Selecciona la base de datos "dromedicinal_web"
-- 3. Ve a la pestaña "SQL"
-- 4. Copia y pega TODO este script
-- 5. Ejecuta (clic en "Continuar")
--
-- ==============================================

USE dromedicinal_web;

-- Verificar que existe el rol admin (si no existe, crearlo)
INSERT IGNORE INTO roles (id, name, description) VALUES
(1, 'admin', 'Acceso total al panel (incluye usuarios).'),
(2, 'catalog_manager', 'Gestiona productos, categorías e imágenes.'),
(3, 'marketing', 'Gestiona promociones, banners y destacados.'),
(4, 'viewer', 'Solo lectura del panel y reportes.');

-- ==============================================
-- CREAR USUARIO ADMINISTRADOR
-- ==============================================
-- 
-- Credenciales por defecto:
-- Email: admin@dromedicinal.com
-- Contraseña: Admin123!
--
-- ⚠️ IMPORTANTE: Cambia la contraseña después del primer login
-- ==============================================

INSERT INTO users (
    name,
    email,
    password_hash,
    role_id,
    is_active,
    created_at,
    updated_at
) VALUES (
    'Administrador Principal',
    'admin@dromedicinal.com',
    -- Hash de la contraseña: Admin123!
    -- Este hash fue generado con: password_hash('Admin123!', PASSWORD_BCRYPT, ['cost' => 12])
    '$2y$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    1, -- ID del rol admin
    1, -- Activo
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    password_hash = VALUES(password_hash),
    is_active = 1,
    updated_at = NOW();

-- ==============================================
-- VERIFICAR QUE SE CREÓ CORRECTAMENTE
-- ==============================================

SELECT 
    u.id,
    u.name,
    u.email,
    u.is_active,
    r.name as role_name,
    r.description as role_description,
    u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email = 'admin@dromedicinal.com';

-- ==============================================
-- Si quieres crear otro usuario admin:
-- ==============================================
-- 
-- INSERT INTO users (name, email, password_hash, role_id, is_active) VALUES
-- ('Nombre del Admin', 'email@ejemplo.com', '$2y$12$HASH_AQUI', 1, 1);
--
-- Para generar un nuevo hash de contraseña, ejecuta:
-- php scripts/generate-password-hash.php
--
-- ==============================================

<?php
/**
 * Configuración principal del backend - Dromedicinal
 * 
 * En producción, estas variables deberían venir de variables de entorno.
 * Para desarrollo local, se pueden modificar directamente aquí.
 */

// Carga un archivo .env y sobreescribe las variables ya definidas si $override = true
function loadEnvFile(string $path, bool $override = false): void {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        [$name, $value] = explode('=', $line, 2);
        $name  = trim($name);
        $value = trim($value);
        if ($override || !array_key_exists($name, $_ENV)) {
            $_ENV[$name] = $value;
            putenv("$name=$value");
        }
    }
}

$baseDir = dirname(__DIR__, 2);

// 1. Carga la configuración base (producción / despliegue)
loadEnvFile($baseDir . '/.env');

// 2. Si existe .env.local Y el entorno NO es producción, sus valores sobreescriben los anteriores
// En producción, .env.local nunca debe tener efecto aunque el archivo esté presente.
$_loadedEnv = $_ENV['APP_ENV'] ?? getenv('APP_ENV') ?? 'dev';
if ($_loadedEnv !== 'production') {
    loadEnvFile($baseDir . '/.env.local', override: true);
}
unset($_loadedEnv);

/**
 * Obtener variable de entorno con valor por defecto
 */
function env(string $key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        $value = $_ENV[$key] ?? $default;
    }
    
    // Convertir strings booleanos
    if ($value === 'true' || $value === 'TRUE') return true;
    if ($value === 'false' || $value === 'FALSE') return false;
    
    return $value;
}

// ==============================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ==============================================

define('APP_ENV', env('APP_ENV', 'dev'));
define('APP_DEBUG', env('APP_DEBUG', true));
define('APP_URL', env('APP_URL', 'http://localhost:8000'));
define('APP_ROOT', dirname(__DIR__, 2));

// ==============================================
// BASE DE DATOS
// ==============================================

define('DB_HOST', env('DB_HOST', 'localhost'));
define('DB_PORT', env('DB_PORT', '3306'));
define('DB_NAME', env('DB_NAME', 'dromedicinal_web'));
define('DB_USER', env('DB_USER', 'root'));
define('DB_PASS', env('DB_PASS', ''));
define('DB_CHARSET', 'utf8mb4');

// ==============================================
// SESIONES
// ==============================================

define('SESSION_NAME', env('SESSION_NAME', 'dromedicinal_session'));
define('SESSION_LIFETIME', (int) env('SESSION_LIFETIME', 7200));
define('SESSION_COOKIE_SECURE', env('SESSION_COOKIE_SECURE', false));
define('SESSION_COOKIE_HTTPONLY', env('SESSION_COOKIE_HTTPONLY', true));
define('SESSION_COOKIE_SAMESITE', env('SESSION_COOKIE_SAMESITE', 'Lax'));

// ==============================================
// CORS
// ==============================================

$corsOrigins = env('CORS_ORIGINS', 'http://localhost:3000');
define('CORS_ORIGINS', array_map('trim', explode(',', $corsOrigins)));

// ==============================================
// RATE LIMITING
// ==============================================

define('RATE_LIMIT_LOGIN_ATTEMPTS', (int) env('RATE_LIMIT_LOGIN_ATTEMPTS', 5));
define('RATE_LIMIT_LOGIN_WINDOW', (int) env('RATE_LIMIT_LOGIN_WINDOW', 900));

// ==============================================
// UPLOADS
// ==============================================

define('UPLOAD_PATH', APP_ROOT . '/storage/uploads');
define('UPLOAD_MAX_SIZE', (int) env('UPLOAD_MAX_SIZE', 5242880)); // 5MB
define('UPLOAD_ALLOWED_TYPES', explode(',', env('UPLOAD_ALLOWED_TYPES', 'jpg,jpeg,png,webp')));

// ==============================================
// LOGS
// ==============================================

define('LOG_PATH', APP_ROOT . '/storage/logs');

// ==============================================
// API
// ==============================================

define('API_VERSION', 'v1');
define('API_PREFIX', '/api/' . API_VERSION);

// Ruta base del backend en el servidor (vacío en local, /backend/public en producción)
define('APP_BASE_PATH', env('APP_BASE_PATH', ''));


<?php
/**
 * Router para el servidor PHP integrado (php -S).
 * Hace que todas las peticiones a /api/v1/... pasen por public/index.php.
 *
 * Uso (desde la carpeta backend):
 *   php -S localhost:8000 server.php
 */

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$pos = strpos($uri, '?');
$path = ($pos !== false) ? substr($uri, 0, $pos) : $uri;
$path = ($path === '') ? '/' : $path;

$publicDir = __DIR__ . '/public';
$file = $publicDir . $path;

// Servir archivos estáticos si existen
if ($path !== '/' && file_exists($file) && is_file($file)) {
    return false;
}

// El resto de peticiones van al front controller
chdir($publicDir);
require $publicDir . '/index.php';
return true;

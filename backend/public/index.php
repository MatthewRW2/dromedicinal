<?php
/**
 * Front Controller - Dromedicinal API
 * 
 * Punto de entrada único para todas las peticiones de la API.
 */

// Reportar errores en desarrollo
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Definir constante de acceso directo
define('DROMEDICINAL', true);

// Cargar configuración
require_once __DIR__ . '/../src/Config/config.php';

// Autoloader simple
spl_autoload_register(function ($class) {
    // Convertir namespace a path
    $prefix = 'App\\';
    $baseDir = APP_ROOT . '/src/';
    
    // Verificar si la clase usa nuestro namespace
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    // Obtener la clase relativa
    $relativeClass = substr($class, $len);
    
    // Convertir namespace separators a directory separators
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    
    // Si el archivo existe, cargarlo
    if (file_exists($file)) {
        require $file;
    }
});

use App\Core\Router;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;
use App\Middleware\CorsMiddleware;
use App\Middleware\JsonBodyMiddleware;

// Iniciar sesión
Session::start();

// Crear instancias
$request = new Request();
$response = new Response();

// Aplicar CORS
$cors = new CorsMiddleware();
$cors->handle($request, $response);

// Si es preflight, terminar aquí
if ($request->method() === 'OPTIONS') {
    $response->send();
    exit;
}

// Parsear body JSON
$jsonBody = new JsonBodyMiddleware();
$jsonBody->handle($request, $response);

// Crear router y cargar rutas
$router = new Router($request, $response);
require_once APP_ROOT . '/src/Config/routes.php';

// Despachar la petición
$router->dispatch();


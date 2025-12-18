<?php

namespace App\Core;

use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;

/**
 * Clase Router - Maneja el enrutamiento de la API
 */
class Router
{
    private Request $request;
    private Response $response;
    private array $routes = [];

    public function __construct(Request $request, Response $response)
    {
        $this->request = $request;
        $this->response = $response;
    }

    /**
     * Registrar ruta GET
     */
    public function get(string $path, string $handler, array $middleware = []): void
    {
        $this->addRoute('GET', $path, $handler, $middleware);
    }

    /**
     * Registrar ruta POST
     */
    public function post(string $path, string $handler, array $middleware = []): void
    {
        $this->addRoute('POST', $path, $handler, $middleware);
    }

    /**
     * Registrar ruta PUT
     */
    public function put(string $path, string $handler, array $middleware = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middleware);
    }

    /**
     * Registrar ruta DELETE
     */
    public function delete(string $path, string $handler, array $middleware = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middleware);
    }

    /**
     * Agregar ruta al registro
     */
    private function addRoute(string $method, string $path, string $handler, array $middleware): void
    {
        // Convertir path con parámetros a regex
        $pattern = preg_replace('/\{([a-zA-Z]+)\}/', '(?P<$1>[^/]+)', $path);
        $pattern = '#^' . $pattern . '$#';

        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'pattern' => $pattern,
            'handler' => $handler,
            'middleware' => $middleware
        ];
    }

    /**
     * Despachar la petición
     */
    public function dispatch(): void
    {
        $method = $this->request->method();
        $uri = $this->request->uri();

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if (preg_match($route['pattern'], $uri, $matches)) {
                // Extraer parámetros nombrados
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $this->request->setParams($params);

                // Ejecutar middleware
                if (!$this->runMiddleware($route['middleware'])) {
                    $this->response->send();
                    return;
                }

                // Ejecutar handler
                $this->executeHandler($route['handler']);
                return;
            }
        }

        // Ruta no encontrada
        $this->response->notFound('Endpoint no encontrado')->send();
    }

    /**
     * Ejecutar middleware
     */
    private function runMiddleware(array $middleware): bool
    {
        foreach ($middleware as $mw) {
            // Verificar si es middleware con parámetros (role:admin,catalog_manager)
            $parts = explode(':', $mw, 2);
            $name = $parts[0];
            $params = isset($parts[1]) ? explode(',', $parts[1]) : [];

            switch ($name) {
                case 'auth':
                    $authMiddleware = new AuthMiddleware();
                    if (!$authMiddleware->handle($this->request, $this->response)) {
                        return false;
                    }
                    break;

                case 'role':
                    $roleMiddleware = new RoleMiddleware($params);
                    if (!$roleMiddleware->handle($this->request, $this->response)) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    /**
     * Ejecutar el handler del controlador
     */
    private function executeHandler(string $handler): void
    {
        try {
            list($controllerName, $method) = explode('@', $handler);
            $controllerClass = "App\\Controllers\\{$controllerName}";

            if (!class_exists($controllerClass)) {
                $this->response->serverError("Controlador no encontrado: {$controllerName}")->send();
                return;
            }

            $controller = new $controllerClass();

            if (!method_exists($controller, $method)) {
                $this->response->serverError("Método no encontrado: {$method}")->send();
                return;
            }

            $result = $controller->$method($this->request, $this->response);

            // Si el controlador no envió la respuesta, enviarla
            if (!$this->response->isSent()) {
                $this->response->send();
            }
        } catch (\Throwable $e) {
            $this->handleException($e);
        }
    }

    /**
     * Manejar excepciones
     */
    private function handleException(\Throwable $e): void
    {
        // Log del error
        $this->logError($e);

        // En desarrollo, mostrar detalles
        if (APP_DEBUG) {
            $this->response->error(
                $e->getMessage(),
                'EXCEPTION',
                [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => explode("\n", $e->getTraceAsString())
                ],
                500
            )->send();
            return;
        }

        // En producción, mensaje genérico
        $this->response->serverError()->send();
    }

    /**
     * Registrar error en log
     */
    private function logError(\Throwable $e): void
    {
        $logFile = LOG_PATH . '/error.log';
        $date = date('Y-m-d H:i:s');
        $message = "[{$date}] {$e->getMessage()} in {$e->getFile()}:{$e->getLine()}\n";
        $message .= $e->getTraceAsString() . "\n\n";
        
        // Crear directorio si no existe
        if (!is_dir(LOG_PATH)) {
            mkdir(LOG_PATH, 0755, true);
        }
        
        error_log($message, 3, $logFile);
    }
}


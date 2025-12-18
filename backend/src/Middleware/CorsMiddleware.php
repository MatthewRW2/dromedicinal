<?php

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;

/**
 * Middleware CORS - Manejo de Cross-Origin Resource Sharing
 */
class CorsMiddleware
{
    /**
     * Manejar CORS
     */
    public function handle(Request $request, Response $response): bool
    {
        $origin = $request->origin();
        
        // Verificar si el origen está permitido
        if ($origin && $this->isAllowedOrigin($origin)) {
            $response->header('Access-Control-Allow-Origin', $origin);
        }

        // Headers comunes
        $response->header('Access-Control-Allow-Credentials', 'true');
        $response->header('Access-Control-Max-Age', '86400');
        
        // Si es preflight (OPTIONS)
        if ($request->method() === 'OPTIONS') {
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->header(
                'Access-Control-Allow-Headers', 
                'Content-Type, Authorization, X-Requested-With, Accept, Origin'
            );
            $response->status(204);
            return false; // Terminar aquí para preflight
        }

        // Headers para respuestas normales
        $response->header('Access-Control-Expose-Headers', 'Content-Length, X-Request-Id');

        return true;
    }

    /**
     * Verificar si el origen está en la lista permitida
     */
    private function isAllowedOrigin(?string $origin): bool
    {
        if (!$origin) {
            return false;
        }

        // En desarrollo, permitir localhost
        if (APP_ENV === 'dev') {
            if (strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false) {
                return true;
            }
        }

        return in_array($origin, CORS_ORIGINS, true);
    }
}


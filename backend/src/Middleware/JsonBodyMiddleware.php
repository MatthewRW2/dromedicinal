<?php

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;

/**
 * Middleware JsonBody - Parsea el body JSON de las peticiones
 */
class JsonBodyMiddleware
{
    /**
     * Parsear body JSON
     */
    public function handle(Request $request, Response $response): bool
    {
        // Solo procesar si hay contenido y es JSON
        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            return true;
        }

        $contentType = $request->header('CONTENT-TYPE', '');
        
        // Si no es JSON, no procesar
        if (strpos($contentType, 'application/json') === false) {
            return true;
        }

        // Leer el body raw
        $rawBody = file_get_contents('php://input');
        
        if (empty($rawBody)) {
            $request->setBody([]);
            return true;
        }

        // Decodificar JSON
        $data = json_decode($rawBody, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $response->error(
                'JSON inválido: ' . json_last_error_msg(),
                'INVALID_JSON',
                null,
                400
            )->send();
            return false;
        }

        $request->setBody($data ?? []);
        return true;
    }
}


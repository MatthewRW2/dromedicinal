<?php

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;
use App\Core\Session;

/**
 * Middleware Auth - Verifica autenticación del usuario
 */
class AuthMiddleware
{
    /**
     * Verificar que el usuario esté autenticado
     */
    public function handle(Request $request, Response $response): bool
    {
        // Verificar si hay sesión activa
        if (!Session::isAuthenticated()) {
            $response->unauthorized('Sesión no válida o expirada');
            return false;
        }

        // Verificar tiempo de inactividad (opcional, ya manejado por session lifetime)
        $authTime = Session::get('auth_time');
        if ($authTime && (time() - $authTime) > SESSION_LIFETIME) {
            Session::logout();
            $response->unauthorized('Sesión expirada');
            return false;
        }

        return true;
    }
}


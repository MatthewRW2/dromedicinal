<?php

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;
use App\Core\Session;

/**
 * Middleware Role - Verifica roles/permisos del usuario
 */
class RoleMiddleware
{
    private array $allowedRoles;

    public function __construct(array $roles = [])
    {
        $this->allowedRoles = $roles;
    }

    /**
     * Verificar que el usuario tenga el rol requerido
     */
    public function handle(Request $request, Response $response): bool
    {
        // Obtener rol del usuario actual
        $userRole = Session::get('user_role');
        
        if (!$userRole) {
            $response->unauthorized('Usuario no autenticado');
            return false;
        }

        // Admin siempre tiene acceso
        if ($userRole === 'admin') {
            return true;
        }

        // Verificar si el rol está en la lista permitida
        if (!empty($this->allowedRoles) && !in_array($userRole, $this->allowedRoles, true)) {
            $response->forbidden('No tienes permisos para realizar esta acción');
            return false;
        }

        return true;
    }
}


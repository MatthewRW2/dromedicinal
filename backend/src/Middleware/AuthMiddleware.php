<?php

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;
use App\Helpers\JWT;
use App\Repositories\UserRepository;

/**
 * Middleware Auth - Verifica autenticación JWT
 */
class AuthMiddleware
{
    private static ?array $currentUser = null;

    /**
     * Verificar que el usuario esté autenticado via JWT
     */
    public function handle(Request $request, Response $response): bool
    {
        // Extraer token del header Authorization
        $token = JWT::extractFromHeader();

        if (!$token) {
            $response->unauthorized('Token no proporcionado');
            return false;
        }

        // Validar token
        $payload = JWT::validate($token);

        if (!$payload) {
            $response->unauthorized('Token inválido o expirado');
            return false;
        }

        // Verificar que el usuario existe y está activo
        $userRepo = new UserRepository();
        $user = $userRepo->findWithRole($payload['user_id']);

        if (!$user || !$user['is_active']) {
            $response->unauthorized('Usuario no válido');
            return false;
        }

        // Guardar usuario actual para uso en otros lugares
        self::$currentUser = $user;

        return true;
    }

    /**
     * Obtener usuario autenticado actual
     */
    public static function getCurrentUser(): ?array
    {
        return self::$currentUser;
    }

    /**
     * Obtener ID del usuario autenticado
     */
    public static function getUserId(): ?int
    {
        return self::$currentUser['id'] ?? null;
    }

    /**
     * Obtener rol del usuario autenticado
     */
    public static function getUserRole(): ?string
    {
        return self::$currentUser['role_name'] ?? null;
    }

    /**
     * Verificar si el usuario tiene un rol específico
     */
    public static function hasRole(string ...$roles): bool
    {
        $userRole = self::getUserRole();
        return $userRole && in_array($userRole, $roles);
    }
}

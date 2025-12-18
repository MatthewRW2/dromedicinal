<?php

namespace App\Services;

use App\Core\Session;
use App\Helpers\Security;
use App\Repositories\UserRepository;
use App\Repositories\AuditRepository;
use App\Middleware\RateLimitMiddleware;

/**
 * Service de autenticación
 */
class AuthService
{
    private UserRepository $userRepo;
    private AuditRepository $auditRepo;

    public function __construct()
    {
        $this->userRepo = new UserRepository();
        $this->auditRepo = new AuditRepository();
    }

    /**
     * Intentar login
     */
    public function login(string $email, string $password, string $ip): array
    {
        // Buscar usuario
        $user = $this->userRepo->findByEmailWithRole($email);

        if (!$user) {
            RateLimitMiddleware::recordFailedAttempt($ip);
            return [
                'success' => false,
                'error' => 'Credenciales inválidas'
            ];
        }

        // Verificar si está activo
        if (!$user['is_active']) {
            return [
                'success' => false,
                'error' => 'Usuario desactivado. Contacte al administrador.'
            ];
        }

        // Verificar contraseña
        if (!Security::verifyPassword($password, $user['password_hash'])) {
            RateLimitMiddleware::recordFailedAttempt($ip);
            return [
                'success' => false,
                'error' => 'Credenciales inválidas'
            ];
        }

        // Verificar si necesita rehash
        if (Security::needsRehash($user['password_hash'])) {
            $newHash = Security::hashPassword($password);
            $this->userRepo->update($user['id'], ['password_hash' => $newHash]);
        }

        // Login exitoso
        RateLimitMiddleware::clearAttempts($ip);
        
        // Actualizar último login
        $this->userRepo->updateLastLogin($user['id']);
        
        // Crear sesión
        Session::setUser($user);
        
        // Log de auditoría
        $this->auditRepo->logLogin($user['id']);

        return [
            'success' => true,
            'user' => $this->sanitizeUser($user)
        ];
    }

    /**
     * Cerrar sesión
     */
    public function logout(): void
    {
        if (Session::isAuthenticated()) {
            $this->auditRepo->logLogout();
        }
        Session::logout();
    }

    /**
     * Obtener usuario actual
     */
    public function getCurrentUser(): ?array
    {
        if (!Session::isAuthenticated()) {
            return null;
        }

        $userId = Session::getUserId();
        $user = $this->userRepo->findWithRole($userId);

        if (!$user) {
            Session::logout();
            return null;
        }

        return $this->sanitizeUser($user);
    }

    /**
     * Sanitizar datos de usuario (remover password_hash)
     */
    private function sanitizeUser(array $user): array
    {
        unset($user['password_hash']);
        return $user;
    }
}


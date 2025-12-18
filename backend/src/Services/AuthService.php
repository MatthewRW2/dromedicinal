<?php

namespace App\Services;

use App\Core\Session;
use App\Helpers\Security;
use App\Helpers\JWT;
use App\Repositories\UserRepository;
use App\Repositories\AuditRepository;
use App\Middleware\RateLimitMiddleware;

/**
 * Service de autenticación con JWT
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
     * Intentar login y generar JWT
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
        
        // Generar JWT
        $token = JWT::generate([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role_name']
        ]);
        
        // Log de auditoría
        $this->auditRepo->logLogin($user['id']);

        return [
            'success' => true,
            'token' => $token,
            'expires_in' => JWT::getExpiration(),
            'user' => $this->sanitizeUser($user)
        ];
    }

    /**
     * Validar token y obtener usuario
     */
    public function validateToken(string $token): ?array
    {
        $payload = JWT::validate($token);
        
        if (!$payload || !isset($payload['user_id'])) {
            return null;
        }

        $user = $this->userRepo->findWithRole($payload['user_id']);
        
        if (!$user || !$user['is_active']) {
            return null;
        }

        return $this->sanitizeUser($user);
    }

    /**
     * Refrescar token
     */
    public function refreshToken(string $token): ?array
    {
        $newToken = JWT::refresh($token);
        
        if (!$newToken) {
            return null;
        }

        $payload = JWT::validate($newToken);
        $user = $this->userRepo->findWithRole($payload['user_id']);

        return [
            'token' => $newToken,
            'expires_in' => JWT::getExpiration(),
            'user' => $this->sanitizeUser($user)
        ];
    }

    /**
     * Cerrar sesión (logout) - registrar en auditoría
     */
    public function logout(?string $token): void
    {
        if ($token) {
            $payload = JWT::validate($token);
            if ($payload && isset($payload['user_id'])) {
                // Log de auditoría manual ya que no hay sesión
                $this->auditRepo->create([
                    'user_id' => $payload['user_id'],
                    'entity' => 'users',
                    'entity_id' => $payload['user_id'],
                    'action' => 'LOGOUT',
                    'before_data' => null,
                    'after_data' => null,
                    'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
                ]);
            }
        }
    }

    /**
     * Obtener usuario actual desde token
     */
    public function getCurrentUser(?string $token): ?array
    {
        if (!$token) {
            return null;
        }

        return $this->validateToken($token);
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

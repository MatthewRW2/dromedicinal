<?php

namespace App\Core;

/**
 * Clase Session - Manejo de sesiones seguras
 */
class Session
{
    private static bool $started = false;

    /**
     * Iniciar sesión con configuración segura
     */
    public static function start(): void
    {
        if (self::$started || session_status() === PHP_SESSION_ACTIVE) {
            self::$started = true;
            return;
        }

        // Configuración de cookies seguras
        $cookieParams = [
            'lifetime' => SESSION_LIFETIME,
            'path' => '/',
            'domain' => '',
            'secure' => SESSION_COOKIE_SECURE,
            'httponly' => SESSION_COOKIE_HTTPONLY,
            'samesite' => SESSION_COOKIE_SAMESITE
        ];

        session_set_cookie_params($cookieParams);
        session_name(SESSION_NAME);
        
        session_start();
        self::$started = true;

        // Regenerar ID de sesión periódicamente para prevenir session fixation
        if (!isset($_SESSION['_created'])) {
            $_SESSION['_created'] = time();
        } elseif (time() - $_SESSION['_created'] > 1800) { // 30 minutos
            session_regenerate_id(true);
            $_SESSION['_created'] = time();
        }
    }

    /**
     * Obtener valor de sesión
     */
    public static function get(string $key, $default = null)
    {
        return $_SESSION[$key] ?? $default;
    }

    /**
     * Establecer valor en sesión
     */
    public static function set(string $key, $value): void
    {
        $_SESSION[$key] = $value;
    }

    /**
     * Verificar si existe una clave
     */
    public static function has(string $key): bool
    {
        return isset($_SESSION[$key]);
    }

    /**
     * Eliminar valor de sesión
     */
    public static function remove(string $key): void
    {
        unset($_SESSION[$key]);
    }

    /**
     * Obtener todos los datos de sesión
     */
    public static function all(): array
    {
        return $_SESSION ?? [];
    }

    /**
     * Destruir sesión completamente
     */
    public static function destroy(): void
    {
        $_SESSION = [];

        // Eliminar cookie de sesión
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();
        self::$started = false;
    }

    /**
     * Regenerar ID de sesión
     */
    public static function regenerate(): void
    {
        session_regenerate_id(true);
        $_SESSION['_created'] = time();
    }

    /**
     * Obtener ID de sesión actual
     */
    public static function id(): string
    {
        return session_id();
    }

    /**
     * Flash message - guardar para la siguiente petición
     */
    public static function flash(string $key, $value): void
    {
        $_SESSION['_flash'][$key] = $value;
    }

    /**
     * Obtener y eliminar flash message
     */
    public static function getFlash(string $key, $default = null)
    {
        $value = $_SESSION['_flash'][$key] ?? $default;
        unset($_SESSION['_flash'][$key]);
        return $value;
    }

    /**
     * Verificar si la sesión está activa
     */
    public static function isActive(): bool
    {
        return session_status() === PHP_SESSION_ACTIVE;
    }

    // ===================================
    // Métodos específicos para Auth
    // ===================================

    /**
     * Guardar usuario autenticado en sesión
     */
    public static function setUser(array $user): void
    {
        self::set('user_id', $user['id']);
        self::set('user_email', $user['email']);
        self::set('user_name', $user['name']);
        self::set('user_role', $user['role_name'] ?? $user['role']);
        self::set('auth_time', time());
        self::regenerate();
    }

    /**
     * Obtener ID del usuario autenticado
     */
    public static function getUserId(): ?int
    {
        return self::get('user_id');
    }

    /**
     * Obtener datos del usuario autenticado
     */
    public static function getUser(): ?array
    {
        $userId = self::getUserId();
        
        if (!$userId) {
            return null;
        }

        return [
            'id' => $userId,
            'email' => self::get('user_email'),
            'name' => self::get('user_name'),
            'role' => self::get('user_role')
        ];
    }

    /**
     * Verificar si hay usuario autenticado
     */
    public static function isAuthenticated(): bool
    {
        return self::getUserId() !== null;
    }

    /**
     * Verificar rol del usuario
     */
    public static function hasRole(string ...$roles): bool
    {
        $userRole = self::get('user_role');
        return $userRole && in_array($userRole, $roles);
    }

    /**
     * Cerrar sesión de usuario
     */
    public static function logout(): void
    {
        self::remove('user_id');
        self::remove('user_email');
        self::remove('user_name');
        self::remove('user_role');
        self::remove('auth_time');
        self::regenerate();
    }
}


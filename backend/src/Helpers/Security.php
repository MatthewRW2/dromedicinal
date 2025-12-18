<?php

namespace App\Helpers;

/**
 * Helper Security - Funciones de seguridad
 */
class Security
{
    /**
     * Sanitizar string para salida HTML
     */
    public static function escape(string $string): string
    {
        return htmlspecialchars($string, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Sanitizar array recursivamente
     */
    public static function escapeArray(array $data): array
    {
        $result = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $result[$key] = self::escapeArray($value);
            } elseif (is_string($value)) {
                $result[$key] = self::escape($value);
            } else {
                $result[$key] = $value;
            }
        }
        return $result;
    }

    /**
     * Generar hash de contraseña seguro
     */
    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * Verificar contraseña contra hash
     */
    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * Verificar si el hash necesita ser actualizado
     */
    public static function needsRehash(string $hash): bool
    {
        return password_needs_rehash($hash, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * Generar token aleatorio seguro
     */
    public static function generateToken(int $length = 32): string
    {
        return bin2hex(random_bytes($length));
    }

    /**
     * Comparar strings de forma segura (timing-safe)
     */
    public static function compareStrings(string $known, string $user): bool
    {
        return hash_equals($known, $user);
    }

    /**
     * Validar CSRF basado en Origin/Referer
     */
    public static function validateOrigin(): bool
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
        $referer = $_SERVER['HTTP_REFERER'] ?? null;

        // Si no hay ni origin ni referer, rechazar en producción
        if (!$origin && !$referer) {
            return APP_ENV === 'dev';
        }

        // Verificar origin
        if ($origin) {
            return self::isAllowedOrigin($origin);
        }

        // Verificar referer
        if ($referer) {
            $host = parse_url($referer, PHP_URL_HOST);
            $scheme = parse_url($referer, PHP_URL_SCHEME);
            $port = parse_url($referer, PHP_URL_PORT);
            
            $refererOrigin = $scheme . '://' . $host;
            if ($port) {
                $refererOrigin .= ':' . $port;
            }
            
            return self::isAllowedOrigin($refererOrigin);
        }

        return false;
    }

    /**
     * Verificar si un origen está permitido
     */
    private static function isAllowedOrigin(string $origin): bool
    {
        // En desarrollo, permitir localhost
        if (APP_ENV === 'dev') {
            if (strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false) {
                return true;
            }
        }

        return in_array($origin, CORS_ORIGINS, true);
    }

    /**
     * Sanitizar nombre de archivo
     */
    public static function sanitizeFilename(string $filename): string
    {
        // Remover caracteres peligrosos
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
        
        // Remover .. para prevenir path traversal
        $filename = str_replace('..', '', $filename);
        
        // Limitar longitud
        if (strlen($filename) > 200) {
            $filename = substr($filename, 0, 200);
        }
        
        return $filename;
    }

    /**
     * Validar que una ruta esté dentro del directorio permitido
     */
    public static function isPathSafe(string $path, string $baseDir): bool
    {
        $realPath = realpath($path);
        $realBaseDir = realpath($baseDir);
        
        if ($realPath === false || $realBaseDir === false) {
            return false;
        }
        
        return strpos($realPath, $realBaseDir) === 0;
    }

    /**
     * Limpiar input de caracteres de control
     */
    public static function cleanInput(string $input): string
    {
        // Remover caracteres de control excepto tabs, newlines
        return preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $input);
    }

    /**
     * Validar que la IP no esté en blacklist (placeholder para expansión)
     */
    public static function isIPAllowed(string $ip): bool
    {
        // Por ahora siempre permitir
        // En el futuro se puede implementar blacklist
        return true;
    }
}


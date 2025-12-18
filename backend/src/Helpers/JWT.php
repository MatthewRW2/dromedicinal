<?php

namespace App\Helpers;

/**
 * Helper JWT - Generación y validación de JSON Web Tokens
 * Implementación simple sin librerías externas
 */
class JWT
{
    private static string $secret;
    private static int $expiration = 7200; // 2 horas por defecto

    /**
     * Inicializar con secreto
     */
    public static function init(): void
    {
        // Generar secreto basado en configuración o usar uno por defecto
        self::$secret = defined('JWT_SECRET') ? JWT_SECRET : hash('sha256', DB_NAME . DB_HOST . 'dromedicinal_jwt_secret_2024');
        self::$expiration = defined('JWT_EXPIRATION') ? JWT_EXPIRATION : SESSION_LIFETIME;
    }

    /**
     * Generar token JWT
     */
    public static function generate(array $payload): string
    {
        self::init();

        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];

        // Agregar timestamps al payload
        $payload['iat'] = time(); // Issued at
        $payload['exp'] = time() + self::$expiration; // Expiration

        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        $signature = self::sign($headerEncoded . '.' . $payloadEncoded);
        $signatureEncoded = self::base64UrlEncode($signature);

        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }

    /**
     * Validar y decodificar token JWT
     */
    public static function validate(string $token): ?array
    {
        self::init();

        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }

        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;

        // Verificar firma
        $expectedSignature = self::sign($headerEncoded . '.' . $payloadEncoded);
        $signature = self::base64UrlDecode($signatureEncoded);

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        // Decodificar payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);

        if (!$payload) {
            return null;
        }

        // Verificar expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    /**
     * Obtener payload sin validar (para debugging)
     */
    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }

        return json_decode(self::base64UrlDecode($parts[1]), true);
    }

    /**
     * Refrescar token (generar nuevo con mismo payload)
     */
    public static function refresh(string $token): ?string
    {
        $payload = self::validate($token);
        
        if (!$payload) {
            return null;
        }

        // Remover timestamps viejos
        unset($payload['iat'], $payload['exp']);

        return self::generate($payload);
    }

    /**
     * Extraer token del header Authorization
     */
    public static function extractFromHeader(): ?string
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader)) {
            // También buscar en $_SERVER
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        }

        if (preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Firmar datos con HMAC SHA256
     */
    private static function sign(string $data): string
    {
        return hash_hmac('sha256', $data, self::$secret, true);
    }

    /**
     * Codificar en Base64 URL-safe
     */
    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Decodificar Base64 URL-safe
     */
    private static function base64UrlDecode(string $data): string
    {
        $padding = strlen($data) % 4;
        if ($padding) {
            $data .= str_repeat('=', 4 - $padding);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Obtener tiempo de expiración configurado
     */
    public static function getExpiration(): int
    {
        self::init();
        return self::$expiration;
    }
}


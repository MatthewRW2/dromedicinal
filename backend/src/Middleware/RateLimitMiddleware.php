<?php

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;
use App\Core\Session;

/**
 * Middleware RateLimit - Limita intentos de login
 */
class RateLimitMiddleware
{
    private int $maxAttempts;
    private int $windowSeconds;

    public function __construct(int $maxAttempts = null, int $windowSeconds = null)
    {
        $this->maxAttempts = $maxAttempts ?? RATE_LIMIT_LOGIN_ATTEMPTS;
        $this->windowSeconds = $windowSeconds ?? RATE_LIMIT_LOGIN_WINDOW;
    }

    /**
     * Verificar rate limit
     */
    public function handle(Request $request, Response $response): bool
    {
        $ip = $request->ip();
        $key = 'rate_limit_' . md5($ip);
        
        // Obtener datos de rate limit de la sesión
        $attempts = Session::get($key, ['count' => 0, 'first_attempt' => null]);
        
        // Si pasó la ventana de tiempo, reiniciar
        if ($attempts['first_attempt'] && (time() - $attempts['first_attempt']) > $this->windowSeconds) {
            $attempts = ['count' => 0, 'first_attempt' => null];
        }

        // Verificar si excedió el límite
        if ($attempts['count'] >= $this->maxAttempts) {
            $remaining = $this->windowSeconds - (time() - $attempts['first_attempt']);
            $response->tooManyRequests(
                "Demasiados intentos. Intente de nuevo en " . ceil($remaining / 60) . " minutos"
            );
            return false;
        }

        return true;
    }

    /**
     * Registrar intento fallido
     */
    public static function recordFailedAttempt(string $ip): void
    {
        $key = 'rate_limit_' . md5($ip);
        $attempts = Session::get($key, ['count' => 0, 'first_attempt' => null]);
        
        if (!$attempts['first_attempt']) {
            $attempts['first_attempt'] = time();
        }
        
        $attempts['count']++;
        Session::set($key, $attempts);
    }

    /**
     * Limpiar intentos (después de login exitoso)
     */
    public static function clearAttempts(string $ip): void
    {
        $key = 'rate_limit_' . md5($ip);
        Session::remove($key);
    }
}


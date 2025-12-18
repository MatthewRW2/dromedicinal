<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\AuthService;
use App\Helpers\JWT;
use App\Middleware\RateLimitMiddleware;

/**
 * Controller de autenticación con JWT
 */
class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    /**
     * POST /auth/login
     */
    public function login(Request $request, Response $response): void
    {
        // Rate limiting
        $rateLimit = new RateLimitMiddleware();
        if (!$rateLimit->handle($request, $response)) {
            return;
        }

        // Validación
        $validator = Validator::make($request->input(), [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $data = $validator->validated();
        
        $result = $this->authService->login(
            $data['email'],
            $data['password'],
            $request->ip()
        );

        if (!$result['success']) {
            $response->error($result['error'], 'AUTH_ERROR', null, 401);
            return;
        }

        // Respuesta con token JWT
        $response->json([
            'token' => $result['token'],
            'expires_in' => $result['expires_in'],
            'user' => $result['user']
        ]);
    }

    /**
     * POST /auth/logout
     */
    public function logout(Request $request, Response $response): void
    {
        $token = JWT::extractFromHeader();
        $this->authService->logout($token);
        
        $response->json(['message' => 'Sesión cerrada correctamente']);
    }

    /**
     * GET /auth/me
     */
    public function me(Request $request, Response $response): void
    {
        $token = JWT::extractFromHeader();
        $user = $this->authService->getCurrentUser($token);

        if (!$user) {
            $response->unauthorized('No autenticado o token inválido');
            return;
        }

        $response->json($user);
    }

    /**
     * POST /auth/refresh
     */
    public function refresh(Request $request, Response $response): void
    {
        $token = JWT::extractFromHeader();
        
        if (!$token) {
            $response->unauthorized('Token no proporcionado');
            return;
        }

        $result = $this->authService->refreshToken($token);

        if (!$result) {
            $response->unauthorized('No se pudo refrescar el token');
            return;
        }

        $response->json($result);
    }
}

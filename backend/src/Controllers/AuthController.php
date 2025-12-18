<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Core\Session;
use App\Services\AuthService;
use App\Middleware\RateLimitMiddleware;

/**
 * Controller de autenticación
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

        $response->json($result['user']);
    }

    /**
     * POST /auth/logout
     */
    public function logout(Request $request, Response $response): void
    {
        $this->authService->logout();
        $response->json(['message' => 'Sesión cerrada correctamente']);
    }

    /**
     * GET /auth/me
     */
    public function me(Request $request, Response $response): void
    {
        $user = $this->authService->getCurrentUser();

        if (!$user) {
            $response->unauthorized('No autenticado');
            return;
        }

        $response->json($user);
    }
}


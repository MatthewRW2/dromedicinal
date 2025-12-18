<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Middleware\AuthMiddleware;
use App\Services\UserService;

/**
 * Controller de usuarios (admin)
 */
class UserController
{
    private UserService $userService;

    public function __construct()
    {
        $this->userService = new UserService();
    }

    /**
     * GET /admin/users
     */
    public function index(Request $request, Response $response): void
    {
        $users = $this->userService->getAll();
        $response->json($users);
    }

    /**
     * GET /admin/users/{id}
     */
    public function show(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $user = $this->userService->find($id);

        if (!$user) {
            $response->notFound('Usuario no encontrado');
            return;
        }

        $response->json($user);
    }

    /**
     * POST /admin/users
     */
    public function store(Request $request, Response $response): void
    {
        $validator = Validator::make($request->input(), [
            'name' => 'required|string|min:2|max:120',
            'email' => 'required|email|max:190',
            'password' => 'required|string|min:8|max:100',
            'role_id' => 'required|integer',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $result = $this->userService->create($validator->validated());

        if (!$result['success']) {
            $response->error($result['error'], 'CREATE_ERROR', null, 400);
            return;
        }

        $response->created($result['user']);
    }

    /**
     * PUT /admin/users/{id}
     */
    public function update(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');

        $validator = Validator::make($request->input(), [
            'name' => 'nullable|string|min:2|max:120',
            'email' => 'nullable|email|max:190',
            'password' => 'nullable|string|min:8|max:100',
            'role_id' => 'nullable|integer',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $result = $this->userService->update($id, $validator->validated());

        if (!$result['success']) {
            if ($result['error'] === 'Usuario no encontrado') {
                $response->notFound($result['error']);
            } else {
                $response->error($result['error'], 'UPDATE_ERROR', null, 400);
            }
            return;
        }

        $response->json($result['user']);
    }

    /**
     * DELETE /admin/users/{id}
     */
    public function destroy(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $currentUserId = AuthMiddleware::getUserId();
        
        $result = $this->userService->delete($id, $currentUserId);

        if (!$result['success']) {
            $status = $result['error'] === 'Usuario no encontrado' ? 404 : 400;
            $response->error($result['error'], 'DELETE_ERROR', null, $status);
            return;
        }

        $response->json(['message' => 'Usuario eliminado correctamente']);
    }
}


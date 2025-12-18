<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Repositories\RoleRepository;
use App\Repositories\AuditRepository;
use App\Helpers\Security;

/**
 * Service de usuarios
 */
class UserService
{
    private UserRepository $userRepo;
    private RoleRepository $roleRepo;
    private AuditRepository $auditRepo;

    public function __construct()
    {
        $this->userRepo = new UserRepository();
        $this->roleRepo = new RoleRepository();
        $this->auditRepo = new AuditRepository();
    }

    /**
     * Obtener todos los usuarios
     */
    public function getAll(): array
    {
        return $this->userRepo->allWithRoles();
    }

    /**
     * Obtener todos los roles
     */
    public function getRoles(): array
    {
        return $this->roleRepo->all();
    }

    /**
     * Obtener usuario por ID
     */
    public function find(int $id): ?array
    {
        $user = $this->userRepo->findWithRole($id);
        if ($user) {
            unset($user['password_hash']);
        }
        return $user;
    }

    /**
     * Crear usuario
     */
    public function create(array $data): array
    {
        // Verificar email único
        if ($this->userRepo->emailExists($data['email'])) {
            return ['success' => false, 'error' => 'El email ya está en uso'];
        }

        // Verificar que el rol existe
        $role = $this->roleRepo->find($data['role_id']);
        if (!$role) {
            return ['success' => false, 'error' => 'Rol no válido'];
        }

        // Hash de la contraseña
        $data['password_hash'] = Security::hashPassword($data['password']);
        unset($data['password']);

        // Valores por defecto
        $data['is_active'] = $data['is_active'] ?? 1;

        $id = $this->userRepo->create($data);
        $user = $this->userRepo->findWithRole($id);
        unset($user['password_hash']);

        // Auditoría
        $this->auditRepo->logCreate('users', $id, $user);

        return ['success' => true, 'user' => $user];
    }

    /**
     * Actualizar usuario
     */
    public function update(int $id, array $data): array
    {
        $before = $this->userRepo->findWithRole($id);
        
        if (!$before) {
            return ['success' => false, 'error' => 'Usuario no encontrado'];
        }

        // Verificar email único si cambia
        if (isset($data['email']) && $data['email'] !== $before['email']) {
            if ($this->userRepo->emailExists($data['email'], $id)) {
                return ['success' => false, 'error' => 'El email ya está en uso'];
            }
        }

        // Verificar rol si cambia
        if (isset($data['role_id']) && $data['role_id'] !== $before['role_id']) {
            $role = $this->roleRepo->find($data['role_id']);
            if (!$role) {
                return ['success' => false, 'error' => 'Rol no válido'];
            }
        }

        // Si se proporciona contraseña, hashearla
        if (!empty($data['password'])) {
            $data['password_hash'] = Security::hashPassword($data['password']);
        }
        unset($data['password']);

        $this->userRepo->update($id, $data);
        $after = $this->userRepo->findWithRole($id);

        // Auditoría (sin password_hash)
        unset($before['password_hash'], $after['password_hash']);
        $this->auditRepo->logUpdate('users', $id, $before, $after);

        return ['success' => true, 'user' => $after];
    }

    /**
     * Eliminar usuario
     */
    public function delete(int $id, int $currentUserId): array
    {
        // No permitir auto-eliminación
        if ($id === $currentUserId) {
            return ['success' => false, 'error' => 'No puedes eliminar tu propio usuario'];
        }

        $user = $this->userRepo->findWithRole($id);
        
        if (!$user) {
            return ['success' => false, 'error' => 'Usuario no encontrado'];
        }

        $this->userRepo->delete($id);

        // Auditoría
        unset($user['password_hash']);
        $this->auditRepo->logDelete('users', $id, $user);

        return ['success' => true];
    }
}


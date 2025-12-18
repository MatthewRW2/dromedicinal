<?php

namespace App\Repositories;

/**
 * Repository para usuarios
 */
class UserRepository extends BaseRepository
{
    protected string $table = 'users';

    /**
     * Buscar usuario por email
     */
    public function findByEmail(string $email): ?array
    {
        return $this->findBy('email', $email);
    }

    /**
     * Obtener usuario con su rol
     */
    public function findWithRole(int $id): ?array
    {
        $sql = "
            SELECT u.*, r.name as role_name, r.description as role_description
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ?
        ";
        return $this->db->fetchOne($sql, [$id]);
    }

    /**
     * Obtener usuario por email con rol
     */
    public function findByEmailWithRole(string $email): ?array
    {
        $sql = "
            SELECT u.*, r.name as role_name, r.description as role_description
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.email = ?
        ";
        return $this->db->fetchOne($sql, [$email]);
    }

    /**
     * Obtener todos los usuarios con roles
     */
    public function allWithRoles(): array
    {
        $sql = "
            SELECT u.id, u.name, u.email, u.is_active, u.last_login_at, 
                   u.created_at, u.updated_at, r.name as role_name, r.id as role_id
            FROM users u
            JOIN roles r ON u.role_id = r.id
            ORDER BY u.created_at DESC
        ";
        return $this->db->fetchAll($sql);
    }

    /**
     * Actualizar último login
     */
    public function updateLastLogin(int $id): void
    {
        $this->db->query(
            "UPDATE users SET last_login_at = NOW() WHERE id = ?",
            [$id]
        );
    }

    /**
     * Verificar si email ya existe (excluyendo un ID)
     */
    public function emailExists(string $email, ?int $excludeId = null): bool
    {
        $sql = "SELECT COUNT(*) as count FROM users WHERE email = ?";
        $params = [$email];
        
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }

        $result = $this->db->fetchOne($sql, $params);
        return $result['count'] > 0;
    }

    /**
     * Obtener usuarios activos
     */
    public function getActiveUsers(): array
    {
        return $this->findAllBy('is_active', 1, ['name' => 'ASC']);
    }
}


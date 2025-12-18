<?php

namespace App\Repositories;

use App\Middleware\AuthMiddleware;

/**
 * Repository para logs de auditoría
 */
class AuditRepository extends BaseRepository
{
    protected string $table = 'audit_logs';

    /**
     * Registrar acción de auditoría
     */
    public function log(
        string $entity,
        ?int $entityId,
        string $action,
        ?array $before = null,
        ?array $after = null
    ): int {
        return $this->create([
            'user_id' => AuthMiddleware::getUserId(),
            'entity' => $entity,
            'entity_id' => $entityId,
            'action' => $action,
            'before_data' => $before ? json_encode($before) : null,
            'after_data' => $after ? json_encode($after) : null,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
        ]);
    }

    /**
     * Registrar creación
     */
    public function logCreate(string $entity, int $entityId, array $data): int
    {
        return $this->log($entity, $entityId, 'CREATE', null, $data);
    }

    /**
     * Registrar actualización
     */
    public function logUpdate(string $entity, int $entityId, array $before, array $after): int
    {
        return $this->log($entity, $entityId, 'UPDATE', $before, $after);
    }

    /**
     * Registrar eliminación
     */
    public function logDelete(string $entity, int $entityId, array $data): int
    {
        return $this->log($entity, $entityId, 'DELETE', $data, null);
    }

    /**
     * Registrar login
     */
    public function logLogin(int $userId): int
    {
        return $this->create([
            'user_id' => $userId,
            'entity' => 'users',
            'entity_id' => $userId,
            'action' => 'LOGIN',
            'before_data' => null,
            'after_data' => null,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
        ]);
    }

    /**
     * Registrar logout
     */
    public function logLogout(): int
    {
        $userId = AuthMiddleware::getUserId();
        
        return $this->create([
            'user_id' => $userId,
            'entity' => 'users',
            'entity_id' => $userId,
            'action' => 'LOGOUT',
            'before_data' => null,
            'after_data' => null,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
        ]);
    }

    /**
     * Obtener logs por entidad
     */
    public function getByEntity(string $entity, int $entityId, int $limit = 50): array
    {
        $sql = "
            SELECT al.*, u.name as user_name, u.email as user_email
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.entity = ? AND al.entity_id = ?
            ORDER BY al.created_at DESC
            LIMIT ?
        ";
        return $this->db->fetchAll($sql, [$entity, $entityId, $limit]);
    }

    /**
     * Obtener logs por usuario
     */
    public function getByUser(int $userId, int $limit = 100): array
    {
        $sql = "
            SELECT * FROM audit_logs 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        ";
        return $this->db->fetchAll($sql, [$userId, $limit]);
    }

    /**
     * Obtener logs recientes
     */
    public function getRecent(int $limit = 100): array
    {
        $sql = "
            SELECT al.*, u.name as user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT ?
        ";
        return $this->db->fetchAll($sql, [$limit]);
    }
}

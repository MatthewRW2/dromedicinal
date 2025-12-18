<?php

namespace App\Repositories;

/**
 * Repository para mensajes de contacto
 */
class ContactRepository extends BaseRepository
{
    protected string $table = 'contact_messages';

    /**
     * Obtener mensajes con paginación
     */
    public function getMessages(int $page = 1, int $perPage = 20, ?string $status = null): array
    {
        $where = '1=1';
        $params = [];

        if ($status) {
            $where .= " AND status = ?";
            $params[] = $status;
        }

        $total = $this->count($where, $params);
        
        $offset = ($page - 1) * $perPage;
        $sql = "SELECT * FROM contact_messages WHERE {$where} ORDER BY created_at DESC LIMIT {$perPage} OFFSET {$offset}";
        
        $items = $this->db->fetchAll($sql, $params);

        return [
            'items' => $items,
            'meta' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => (int)ceil($total / $perPage)
            ]
        ];
    }

    /**
     * Marcar como leído
     */
    public function markAsRead(int $id): bool
    {
        return $this->update($id, ['status' => 'READ']);
    }

    /**
     * Archivar mensaje
     */
    public function archive(int $id): bool
    {
        return $this->update($id, ['status' => 'ARCHIVED']);
    }

    /**
     * Contar mensajes nuevos
     */
    public function countNew(): int
    {
        return $this->count("status = 'NEW'");
    }

    /**
     * Obtener estadísticas
     */
    public function getStats(): array
    {
        $sql = "
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'NEW' THEN 1 ELSE 0 END) as new_count,
                SUM(CASE WHEN status = 'READ' THEN 1 ELSE 0 END) as read_count,
                SUM(CASE WHEN status = 'ARCHIVED' THEN 1 ELSE 0 END) as archived_count
            FROM contact_messages
        ";
        return $this->db->fetchOne($sql);
    }
}


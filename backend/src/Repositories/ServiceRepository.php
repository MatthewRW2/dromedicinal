<?php

namespace App\Repositories;

/**
 * Repository para servicios
 */
class ServiceRepository extends BaseRepository
{
    protected string $table = 'services';

    /**
     * Obtener servicios activos
     */
    public function getActive(): array
    {
        $sql = "SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, title ASC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Obtener todos ordenados para admin
     */
    public function getAllForAdmin(): array
    {
        return $this->all(['sort_order' => 'ASC', 'title' => 'ASC']);
    }

    /**
     * Obtener siguiente orden
     */
    public function getNextSortOrder(): int
    {
        $sql = "SELECT MAX(sort_order) as max_order FROM services";
        $result = $this->db->fetchOne($sql);
        return ($result['max_order'] ?? 0) + 1;
    }
}


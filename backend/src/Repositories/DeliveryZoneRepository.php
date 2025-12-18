<?php

namespace App\Repositories;

/**
 * Repository para zonas de cobertura
 */
class DeliveryZoneRepository extends BaseRepository
{
    protected string $table = 'delivery_zones';

    /**
     * Obtener zonas activas
     */
    public function getActive(): array
    {
        $sql = "SELECT * FROM delivery_zones WHERE is_active = 1 ORDER BY sort_order ASC, name ASC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Obtener todas ordenadas para admin
     */
    public function getAllForAdmin(): array
    {
        return $this->all(['sort_order' => 'ASC', 'name' => 'ASC']);
    }
}


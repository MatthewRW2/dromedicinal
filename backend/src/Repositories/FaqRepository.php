<?php

namespace App\Repositories;

/**
 * Repository para FAQs (preguntas frecuentes)
 */
class FaqRepository extends BaseRepository
{
    protected string $table = 'faqs';

    /**
     * Obtener FAQs activos
     */
    public function getActive(): array
    {
        $sql = "SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC, question ASC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Obtener todos ordenados para admin
     */
    public function getAllForAdmin(): array
    {
        return $this->all(['sort_order' => 'ASC', 'question' => 'ASC']);
    }

    /**
     * Obtener siguiente orden
     */
    public function getNextSortOrder(): int
    {
        $sql = "SELECT MAX(sort_order) as max_order FROM faqs";
        $result = $this->db->fetchOne($sql);
        return ($result['max_order'] ?? 0) + 1;
    }
}


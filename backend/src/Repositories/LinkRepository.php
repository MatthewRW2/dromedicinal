<?php

namespace App\Repositories;

/**
 * Repository para enlaces de interés
 */
class LinkRepository extends BaseRepository
{
    protected string $table = 'links';

    /**
     * Obtener enlaces activos
     */
    public function getActive(): array
    {
        $sql = "SELECT * FROM links WHERE is_active = 1 ORDER BY sort_order ASC, title ASC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Obtener enlaces por categoría
     */
    public function getByCategory(string $category): array
    {
        $sql = "SELECT * FROM links WHERE is_active = 1 AND category = ? ORDER BY sort_order ASC";
        return $this->db->fetchAll($sql, [$category]);
    }

    /**
     * Obtener categorías de enlaces
     */
    public function getCategories(): array
    {
        $sql = "SELECT DISTINCT category FROM links WHERE category IS NOT NULL AND category != '' ORDER BY category";
        return array_column($this->db->fetchAll($sql), 'category');
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
        $sql = "SELECT MAX(sort_order) as max_order FROM links";
        $result = $this->db->fetchOne($sql);
        return ($result['max_order'] ?? 0) + 1;
    }
}


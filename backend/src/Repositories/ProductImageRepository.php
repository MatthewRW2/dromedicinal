<?php

namespace App\Repositories;

/**
 * Repository para imágenes de productos
 */
class ProductImageRepository extends BaseRepository
{
    protected string $table = 'product_images';

    /**
     * Obtener imágenes de un producto
     */
    public function getByProduct(int $productId): array
    {
        $sql = "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC";
        return $this->db->fetchAll($sql, [$productId]);
    }

    /**
     * Obtener imagen principal de un producto
     */
    public function getPrimary(int $productId): ?array
    {
        $sql = "SELECT * FROM product_images WHERE product_id = ? AND is_primary = 1 LIMIT 1";
        return $this->db->fetchOne($sql, [$productId]);
    }

    /**
     * Establecer imagen como principal
     */
    public function setPrimary(int $productId, int $imageId): void
    {
        // Quitar primary de todas las imágenes del producto
        $this->db->query(
            "UPDATE product_images SET is_primary = 0 WHERE product_id = ?",
            [$productId]
        );
        
        // Establecer la nueva como primary
        $this->db->query(
            "UPDATE product_images SET is_primary = 1 WHERE id = ? AND product_id = ?",
            [$imageId, $productId]
        );
    }

    /**
     * Obtener siguiente orden
     */
    public function getNextSortOrder(int $productId): int
    {
        $sql = "SELECT MAX(sort_order) as max_order FROM product_images WHERE product_id = ?";
        $result = $this->db->fetchOne($sql, [$productId]);
        return ($result['max_order'] ?? 0) + 1;
    }

    /**
     * Reordenar imágenes
     */
    public function reorder(int $productId, array $imageIds): void
    {
        $order = 1;
        foreach ($imageIds as $imageId) {
            $this->db->query(
                "UPDATE product_images SET sort_order = ? WHERE id = ? AND product_id = ?",
                [$order, $imageId, $productId]
            );
            $order++;
        }
    }

    /**
     * Eliminar todas las imágenes de un producto
     */
    public function deleteByProduct(int $productId): int
    {
        return $this->db->delete('product_images', 'product_id = ?', [$productId]);
    }

    /**
     * Contar imágenes de un producto
     */
    public function countByProduct(int $productId): int
    {
        return $this->count('product_id = ?', [$productId]);
    }
}


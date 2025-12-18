<?php

namespace App\Repositories;

/**
 * Repository para promociones
 */
class PromotionRepository extends BaseRepository
{
    protected string $table = 'promotions';

    /**
     * Obtener promociones activas (vigentes)
     */
    public function getActive(): array
    {
        $sql = "
            SELECT * FROM promotions 
            WHERE is_active = 1 
              AND (starts_at IS NULL OR starts_at <= NOW())
              AND (ends_at IS NULL OR ends_at >= NOW())
            ORDER BY created_at DESC
        ";
        return $this->db->fetchAll($sql);
    }

    /**
     * Buscar por slug
     */
    public function findBySlug(string $slug): ?array
    {
        return $this->findBy('slug', $slug);
    }

    /**
     * Obtener promoción con productos
     */
    public function findWithProducts(int $id): ?array
    {
        $promotion = $this->find($id);
        
        if (!$promotion) {
            return null;
        }

        $promotion['products'] = $this->getProducts($id);
        return $promotion;
    }

    /**
     * Obtener promoción por slug con productos
     */
    public function findBySlugWithProducts(string $slug): ?array
    {
        $promotion = $this->findBySlug($slug);
        
        if (!$promotion) {
            return null;
        }

        $promotion['products'] = $this->getProducts($promotion['id']);
        return $promotion;
    }

    /**
     * Obtener productos de una promoción
     */
    public function getProducts(int $promotionId): array
    {
        $sql = "
            SELECT p.*, pp.sort_order as promo_order,
                   (SELECT path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
                   c.name as category_name
            FROM promotion_products pp
            JOIN products p ON pp.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE pp.promotion_id = ? AND p.is_active = 1
            ORDER BY pp.sort_order ASC
        ";
        return $this->db->fetchAll($sql, [$promotionId]);
    }

    /**
     * Agregar producto a promoción
     */
    public function addProduct(int $promotionId, int $productId, int $sortOrder = 0): void
    {
        $sql = "INSERT INTO promotion_products (promotion_id, product_id, sort_order) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order)";
        $this->db->query($sql, [$promotionId, $productId, $sortOrder]);
    }

    /**
     * Remover producto de promoción
     */
    public function removeProduct(int $promotionId, int $productId): void
    {
        $this->db->delete('promotion_products', 'promotion_id = ? AND product_id = ?', [$promotionId, $productId]);
    }

    /**
     * Establecer productos de una promoción
     */
    public function setProducts(int $promotionId, array $productIds): void
    {
        // Eliminar productos actuales
        $this->db->delete('promotion_products', 'promotion_id = ?', [$promotionId]);
        
        // Agregar nuevos productos
        $order = 1;
        foreach ($productIds as $productId) {
            $this->addProduct($promotionId, (int)$productId, $order);
            $order++;
        }
    }

    /**
     * Verificar si slug existe
     */
    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $sql = "SELECT COUNT(*) as count FROM promotions WHERE slug = ?";
        $params = [$slug];
        
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }

        $result = $this->db->fetchOne($sql, $params);
        return $result['count'] > 0;
    }

    /**
     * Obtener todas para admin
     */
    public function getAllForAdmin(): array
    {
        $sql = "
            SELECT p.*, 
                   (SELECT COUNT(*) FROM promotion_products WHERE promotion_id = p.id) as product_count
            FROM promotions p
            ORDER BY p.created_at DESC
        ";
        return $this->db->fetchAll($sql);
    }
}


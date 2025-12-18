<?php

namespace App\Repositories;

/**
 * Repository para productos
 */
class ProductRepository extends BaseRepository
{
    protected string $table = 'products';

    /**
     * Obtener productos con paginación y filtros
     */
    public function getProducts(array $filters = [], int $page = 1, int $perPage = 24): array
    {
        $where = ['p.is_active = 1'];
        $params = [];

        // Filtro por categoría
        if (!empty($filters['category'])) {
            $where[] = "(c.slug = ? OR c.id = ?)";
            $params[] = $filters['category'];
            $params[] = is_numeric($filters['category']) ? (int)$filters['category'] : 0;
        }

        // Filtro por búsqueda
        if (!empty($filters['q'])) {
            $where[] = "(p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)";
            $searchTerm = '%' . $filters['q'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        // Filtro por marca
        if (!empty($filters['brand'])) {
            $where[] = "p.brand = ?";
            $params[] = $filters['brand'];
        }

        // Filtro por disponibilidad
        if (!empty($filters['availability'])) {
            $where[] = "p.availability_status = ?";
            $params[] = $filters['availability'];
        }

        // Filtro por precio
        if (!empty($filters['min_price'])) {
            $where[] = "p.price >= ?";
            $params[] = (float)$filters['min_price'];
        }
        if (!empty($filters['max_price'])) {
            $where[] = "p.price <= ?";
            $params[] = (float)$filters['max_price'];
        }

        $whereClause = implode(' AND ', $where);
        
        // Contar total
        $countSql = "
            SELECT COUNT(*) as total 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE {$whereClause}
        ";
        $totalResult = $this->db->fetchOne($countSql, $params);
        $total = (int)$totalResult['total'];

        // Obtener productos
        $offset = ($page - 1) * $perPage;
        $sql = "
            SELECT p.*, c.name as category_name, c.slug as category_slug,
                   (SELECT path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE {$whereClause}
            ORDER BY p.is_featured DESC, p.featured_order ASC, p.name ASC
            LIMIT {$perPage} OFFSET {$offset}
        ";

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
     * Buscar por slug
     */
    public function findBySlug(string $slug): ?array
    {
        $sql = "
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.slug = ?
        ";
        return $this->db->fetchOne($sql, [$slug]);
    }

    /**
     * Obtener producto con imágenes
     */
    public function findWithImages(int $id): ?array
    {
        $product = $this->find($id);
        
        if (!$product) {
            return null;
        }

        $product['images'] = $this->getImages($id);
        return $product;
    }

    /**
     * Obtener producto por slug con imágenes
     */
    public function findBySlugWithImages(string $slug): ?array
    {
        $product = $this->findBySlug($slug);
        
        if (!$product) {
            return null;
        }

        $product['images'] = $this->getImages($product['id']);
        return $product;
    }

    /**
     * Obtener imágenes de un producto
     */
    public function getImages(int $productId): array
    {
        $sql = "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC";
        return $this->db->fetchAll($sql, [$productId]);
    }

    /**
     * Obtener productos destacados
     */
    public function getFeatured(int $limit = 8): array
    {
        $sql = "
            SELECT p.*, c.name as category_name, c.slug as category_slug,
                   (SELECT path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1 AND p.is_featured = 1
            ORDER BY p.featured_order ASC
            LIMIT ?
        ";
        return $this->db->fetchAll($sql, [$limit]);
    }

    /**
     * Obtener productos con stock bajo
     */
    public function getLowStock(): array
    {
        $sql = "
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1 
              AND p.stock_qty IS NOT NULL 
              AND p.low_stock_threshold IS NOT NULL
              AND p.stock_qty <= p.low_stock_threshold
            ORDER BY p.stock_qty ASC
        ";
        return $this->db->fetchAll($sql);
    }

    /**
     * Obtener todos para admin con información extra
     */
    public function getAllForAdmin(int $page = 1, int $perPage = 50, array $filters = []): array
    {
        $where = ['1=1'];
        $params = [];

        if (isset($filters['is_active'])) {
            $where[] = "p.is_active = ?";
            $params[] = (int)$filters['is_active'];
        }

        if (!empty($filters['category_id'])) {
            $where[] = "p.category_id = ?";
            $params[] = (int)$filters['category_id'];
        }

        if (!empty($filters['q'])) {
            $where[] = "(p.name LIKE ? OR p.sku LIKE ?)";
            $searchTerm = '%' . $filters['q'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereClause = implode(' AND ', $where);
        
        $countSql = "SELECT COUNT(*) as total FROM products p WHERE {$whereClause}";
        $totalResult = $this->db->fetchOne($countSql, $params);
        $total = (int)$totalResult['total'];

        $offset = ($page - 1) * $perPage;
        $sql = "
            SELECT p.*, c.name as category_name,
                   (SELECT path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE {$whereClause}
            ORDER BY p.created_at DESC
            LIMIT {$perPage} OFFSET {$offset}
        ";

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
     * Verificar si slug existe
     */
    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $sql = "SELECT COUNT(*) as count FROM products WHERE slug = ?";
        $params = [$slug];
        
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }

        $result = $this->db->fetchOne($sql, $params);
        return $result['count'] > 0;
    }

    /**
     * Verificar si SKU existe
     */
    public function skuExists(string $sku, ?int $excludeId = null): bool
    {
        $sql = "SELECT COUNT(*) as count FROM products WHERE sku = ?";
        $params = [$sku];
        
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }

        $result = $this->db->fetchOne($sql, $params);
        return $result['count'] > 0;
    }

    /**
     * Obtener resumen del catálogo
     */
    public function getCatalogSummary(): array
    {
        $sql = "
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN availability_status = 'IN_STOCK' THEN 1 ELSE 0 END) as in_stock,
                SUM(CASE WHEN availability_status = 'LOW_STOCK' THEN 1 ELSE 0 END) as low_stock,
                SUM(CASE WHEN availability_status = 'OUT_OF_STOCK' THEN 1 ELSE 0 END) as out_of_stock,
                SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured
            FROM products
        ";
        return $this->db->fetchOne($sql);
    }
}


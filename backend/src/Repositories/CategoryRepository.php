<?php

namespace App\Repositories;

/**
 * Repository para categorías
 */
class CategoryRepository extends BaseRepository
{
    protected string $table = 'categories';

    /**
     * Obtener categorías activas ordenadas
     */
    public function getActive(): array
    {
        $sql = "SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, name ASC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Obtener categorías principales (sin padre)
     */
    public function getRootCategories(bool $activeOnly = true): array
    {
        $sql = "SELECT * FROM categories WHERE parent_id IS NULL";
        
        if ($activeOnly) {
            $sql .= " AND is_active = 1";
        }
        
        $sql .= " ORDER BY sort_order ASC, name ASC";
        
        return $this->db->fetchAll($sql);
    }

    /**
     * Obtener subcategorías de una categoría
     */
    public function getChildren(int $parentId, bool $activeOnly = true): array
    {
        $sql = "SELECT * FROM categories WHERE parent_id = ?";
        $params = [$parentId];
        
        if ($activeOnly) {
            $sql .= " AND is_active = 1";
        }
        
        $sql .= " ORDER BY sort_order ASC, name ASC";
        
        return $this->db->fetchAll($sql, $params);
    }

    /**
     * Buscar por slug
     */
    public function findBySlug(string $slug): ?array
    {
        return $this->findBy('slug', $slug);
    }

    /**
     * Obtener categoría con subcategorías
     */
    public function getWithChildren(int $id): ?array
    {
        $category = $this->find($id);
        
        if (!$category) {
            return null;
        }
        
        $category['children'] = $this->getChildren($id);
        return $category;
    }

    /**
     * Obtener árbol completo de categorías
     */
    public function getTree(bool $activeOnly = true): array
    {
        $categories = $activeOnly ? $this->getActive() : $this->all(['sort_order' => 'ASC']);
        return $this->buildTree($categories);
    }

    /**
     * Construir árbol de categorías
     */
    private function buildTree(array $categories, ?int $parentId = null): array
    {
        $branch = [];
        
        foreach ($categories as $category) {
            if ($category['parent_id'] == $parentId) {
                $children = $this->buildTree($categories, $category['id']);
                if ($children) {
                    $category['children'] = $children;
                }
                $branch[] = $category;
            }
        }
        
        return $branch;
    }

    /**
     * Verificar si slug existe
     */
    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $sql = "SELECT COUNT(*) as count FROM categories WHERE slug = ?";
        $params = [$slug];
        
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }

        $result = $this->db->fetchOne($sql, $params);
        return $result['count'] > 0;
    }

    /**
     * Contar productos en categoría
     */
    public function countProducts(int $categoryId): int
    {
        return $this->db->count('products', 'category_id = ?', [$categoryId]);
    }

    /**
     * Obtener todas las categorías para admin
     */
    public function getAllForAdmin(): array
    {
        $sql = "
            SELECT c.*, 
                   pc.name as parent_name,
                   (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
            FROM categories c
            LEFT JOIN categories pc ON c.parent_id = pc.id
            ORDER BY c.parent_id IS NULL DESC, c.sort_order ASC, c.name ASC
        ";
        return $this->db->fetchAll($sql);
    }
}


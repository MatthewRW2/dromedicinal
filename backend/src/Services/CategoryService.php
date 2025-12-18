<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Repositories\AuditRepository;
use App\Helpers\Slug;

/**
 * Service de categorías
 */
class CategoryService
{
    private CategoryRepository $categoryRepo;
    private AuditRepository $auditRepo;

    public function __construct()
    {
        $this->categoryRepo = new CategoryRepository();
        $this->auditRepo = new AuditRepository();
    }

    /**
     * Obtener todas las categorías (público)
     */
    public function getPublicCategories(): array
    {
        return $this->categoryRepo->getTree(true);
    }

    /**
     * Obtener categoría por slug (público)
     */
    public function getPublicCategory(string $slug): ?array
    {
        $category = $this->categoryRepo->findBySlug($slug);
        
        if (!$category || !$category['is_active']) {
            return null;
        }

        // Agregar subcategorías si existen
        $category['children'] = $this->categoryRepo->getChildren($category['id'], true);
        
        return $category;
    }

    /**
     * Obtener todas las categorías para admin
     */
    public function getAllForAdmin(): array
    {
        return $this->categoryRepo->getAllForAdmin();
    }

    /**
     * Obtener categoría por ID
     */
    public function find(int $id): ?array
    {
        return $this->categoryRepo->find($id);
    }

    /**
     * Crear categoría
     */
    public function create(array $data): array
    {
        // Generar slug único
        $data['slug'] = Slug::generateUnique($data['name'], 'categories');

        // Valores por defecto
        $data['is_active'] = $data['is_active'] ?? 1;
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $id = $this->categoryRepo->create($data);
        $category = $this->categoryRepo->find($id);

        // Auditoría
        $this->auditRepo->logCreate('categories', $id, $category);

        return $category;
    }

    /**
     * Actualizar categoría
     */
    public function update(int $id, array $data): ?array
    {
        $before = $this->categoryRepo->find($id);
        
        if (!$before) {
            return null;
        }

        // Si cambia el nombre, regenerar slug
        if (isset($data['name']) && $data['name'] !== $before['name']) {
            $data['slug'] = Slug::generateUnique($data['name'], 'categories', 'slug', $id);
        }

        $this->categoryRepo->update($id, $data);
        $after = $this->categoryRepo->find($id);

        // Auditoría
        $this->auditRepo->logUpdate('categories', $id, $before, $after);

        return $after;
    }

    /**
     * Eliminar categoría
     */
    public function delete(int $id): array
    {
        $category = $this->categoryRepo->find($id);
        
        if (!$category) {
            return ['success' => false, 'error' => 'Categoría no encontrada'];
        }

        // Verificar si tiene productos
        $productCount = $this->categoryRepo->countProducts($id);
        if ($productCount > 0) {
            return [
                'success' => false,
                'error' => "No se puede eliminar: la categoría tiene {$productCount} producto(s) asociado(s)"
            ];
        }

        // Verificar si tiene subcategorías
        $children = $this->categoryRepo->getChildren($id, false);
        if (!empty($children)) {
            return [
                'success' => false,
                'error' => 'No se puede eliminar: la categoría tiene subcategorías'
            ];
        }

        $this->categoryRepo->delete($id);
        
        // Auditoría
        $this->auditRepo->logDelete('categories', $id, $category);

        return ['success' => true];
    }
}


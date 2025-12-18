<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use App\Repositories\ProductImageRepository;
use App\Repositories\AuditRepository;
use App\Helpers\Slug;
use App\Helpers\Files;

/**
 * Service de productos
 */
class ProductService
{
    private ProductRepository $productRepo;
    private ProductImageRepository $imageRepo;
    private AuditRepository $auditRepo;

    public function __construct()
    {
        $this->productRepo = new ProductRepository();
        $this->imageRepo = new ProductImageRepository();
        $this->auditRepo = new AuditRepository();
    }

    /**
     * Obtener productos públicos con filtros y paginación
     */
    public function getPublicProducts(array $filters = [], int $page = 1, int $perPage = 24): array
    {
        return $this->productRepo->getProducts($filters, $page, $perPage);
    }

    /**
     * Obtener producto público por slug
     */
    public function getPublicProduct(string $slug): ?array
    {
        $product = $this->productRepo->findBySlugWithImages($slug);
        
        if (!$product || !$product['is_active']) {
            return null;
        }

        return $product;
    }

    /**
     * Obtener productos destacados
     */
    public function getFeaturedProducts(int $limit = 8): array
    {
        return $this->productRepo->getFeatured($limit);
    }

    /**
     * Obtener productos para admin
     */
    public function getAllForAdmin(int $page = 1, int $perPage = 50, array $filters = []): array
    {
        return $this->productRepo->getAllForAdmin($page, $perPage, $filters);
    }

    /**
     * Obtener producto por ID con imágenes
     */
    public function find(int $id): ?array
    {
        return $this->productRepo->findWithImages($id);
    }

    /**
     * Crear producto
     */
    public function create(array $data): array
    {
        // Generar slug único
        $data['slug'] = Slug::generateUnique($data['name'], 'products');

        // Verificar SKU único si se proporciona
        if (!empty($data['sku']) && $this->productRepo->skuExists($data['sku'])) {
            return ['success' => false, 'error' => 'El SKU ya existe'];
        }

        // Valores por defecto
        $data['is_active'] = $data['is_active'] ?? 1;
        $data['is_featured'] = $data['is_featured'] ?? 0;
        $data['availability_status'] = $data['availability_status'] ?? 'IN_STOCK';
        $data['currency'] = $data['currency'] ?? 'COP';

        $id = $this->productRepo->create($data);
        $product = $this->productRepo->find($id);

        // Auditoría
        $this->auditRepo->logCreate('products', $id, $product);

        return ['success' => true, 'product' => $product];
    }

    /**
     * Actualizar producto
     */
    public function update(int $id, array $data): array
    {
        $before = $this->productRepo->find($id);
        
        if (!$before) {
            return ['success' => false, 'error' => 'Producto no encontrado'];
        }

        // Si cambia el nombre, regenerar slug
        if (isset($data['name']) && $data['name'] !== $before['name']) {
            $data['slug'] = Slug::generateUnique($data['name'], 'products', 'slug', $id);
        }

        // Verificar SKU único si se cambia
        if (!empty($data['sku']) && $data['sku'] !== $before['sku']) {
            if ($this->productRepo->skuExists($data['sku'], $id)) {
                return ['success' => false, 'error' => 'El SKU ya existe'];
            }
        }

        $this->productRepo->update($id, $data);
        $after = $this->productRepo->findWithImages($id);

        // Auditoría
        $this->auditRepo->logUpdate('products', $id, $before, $after);

        return ['success' => true, 'product' => $after];
    }

    /**
     * Eliminar producto
     */
    public function delete(int $id): array
    {
        $product = $this->productRepo->findWithImages($id);
        
        if (!$product) {
            return ['success' => false, 'error' => 'Producto no encontrado'];
        }

        // Eliminar imágenes del sistema de archivos
        if (!empty($product['images'])) {
            foreach ($product['images'] as $image) {
                Files::delete($image['path']);
            }
        }

        // Las imágenes en BD se eliminan automáticamente por CASCADE
        $this->productRepo->delete($id);

        // Auditoría
        $this->auditRepo->logDelete('products', $id, $product);

        return ['success' => true];
    }

    /**
     * Subir imagen de producto
     */
    public function uploadImage(int $productId, array $file): array
    {
        // Verificar que el producto existe
        $product = $this->productRepo->find($productId);
        if (!$product) {
            return ['success' => false, 'error' => 'Producto no encontrado'];
        }

        // Subir archivo
        $result = Files::uploadImage($file, "products/{$productId}");
        
        if (!$result['success']) {
            return $result;
        }

        // Determinar si es la primera imagen (será primary)
        $imageCount = $this->imageRepo->countByProduct($productId);
        $isPrimary = $imageCount === 0 ? 1 : 0;

        // Guardar en BD
        $imageId = $this->imageRepo->create([
            'product_id' => $productId,
            'path' => $result['path'],
            'alt_text' => $product['name'],
            'is_primary' => $isPrimary,
            'sort_order' => $this->imageRepo->getNextSortOrder($productId)
        ]);

        $image = $this->imageRepo->find($imageId);

        return ['success' => true, 'image' => $image];
    }

    /**
     * Eliminar imagen de producto
     */
    public function deleteImage(int $productId, int $imageId): array
    {
        $image = $this->imageRepo->find($imageId);
        
        if (!$image || $image['product_id'] != $productId) {
            return ['success' => false, 'error' => 'Imagen no encontrada'];
        }

        // Eliminar archivo
        Files::delete($image['path']);
        
        // Eliminar de BD
        $this->imageRepo->delete($imageId);

        // Si era primary, establecer otra como primary
        if ($image['is_primary']) {
            $images = $this->imageRepo->getByProduct($productId);
            if (!empty($images)) {
                $this->imageRepo->setPrimary($productId, $images[0]['id']);
            }
        }

        return ['success' => true];
    }

    /**
     * Reordenar imágenes
     */
    public function reorderImages(int $productId, array $imageIds): array
    {
        $this->imageRepo->reorder($productId, $imageIds);
        
        // Si el primer elemento no es primary, actualizarlo
        if (!empty($imageIds)) {
            $this->imageRepo->setPrimary($productId, $imageIds[0]);
        }

        return ['success' => true, 'images' => $this->imageRepo->getByProduct($productId)];
    }

    /**
     * Obtener productos con stock bajo
     */
    public function getLowStock(): array
    {
        return $this->productRepo->getLowStock();
    }

    /**
     * Obtener resumen del catálogo
     */
    public function getCatalogSummary(): array
    {
        return $this->productRepo->getCatalogSummary();
    }
}


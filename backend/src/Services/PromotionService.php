<?php

namespace App\Services;

use App\Repositories\PromotionRepository;
use App\Repositories\AuditRepository;
use App\Helpers\Slug;
use App\Helpers\Files;

/**
 * Service de promociones
 */
class PromotionService
{
    private PromotionRepository $promoRepo;
    private AuditRepository $auditRepo;

    public function __construct()
    {
        $this->promoRepo = new PromotionRepository();
        $this->auditRepo = new AuditRepository();
    }

    /**
     * Obtener promociones activas (público)
     */
    public function getPublicPromotions(): array
    {
        return $this->promoRepo->getActive();
    }

    /**
     * Obtener promoción por slug con productos (público)
     */
    public function getPublicPromotion(string $slug): ?array
    {
        $promotion = $this->promoRepo->findBySlugWithProducts($slug);
        
        if (!$promotion || !$promotion['is_active']) {
            return null;
        }

        // Verificar vigencia
        $now = date('Y-m-d H:i:s');
        if ($promotion['starts_at'] && $promotion['starts_at'] > $now) {
            return null;
        }
        if ($promotion['ends_at'] && $promotion['ends_at'] < $now) {
            return null;
        }

        return $promotion;
    }

    /**
     * Obtener todas las promociones para admin
     */
    public function getAllForAdmin(): array
    {
        return $this->promoRepo->getAllForAdmin();
    }

    /**
     * Obtener promoción por ID
     */
    public function find(int $id): ?array
    {
        return $this->promoRepo->findWithProducts($id);
    }

    /**
     * Crear promoción
     */
    public function create(array $data): array
    {
        // Generar slug único
        $data['slug'] = Slug::generateUnique($data['title'], 'promotions');

        // Valores por defecto
        $data['is_active'] = $data['is_active'] ?? 1;

        // Extraer product_ids si vienen
        $productIds = $data['product_ids'] ?? [];
        unset($data['product_ids']);

        $id = $this->promoRepo->create($data);
        
        // Agregar productos
        if (!empty($productIds)) {
            $this->promoRepo->setProducts($id, $productIds);
        }

        $promotion = $this->promoRepo->findWithProducts($id);

        // Auditoría
        $this->auditRepo->logCreate('promotions', $id, $promotion);

        return ['success' => true, 'promotion' => $promotion];
    }

    /**
     * Actualizar promoción
     */
    public function update(int $id, array $data): array
    {
        $before = $this->promoRepo->findWithProducts($id);
        
        if (!$before) {
            return ['success' => false, 'error' => 'Promoción no encontrada'];
        }

        // Si cambia el título, regenerar slug
        if (isset($data['title']) && $data['title'] !== $before['title']) {
            $data['slug'] = Slug::generateUnique($data['title'], 'promotions', 'slug', $id);
        }

        // Extraer product_ids si vienen
        $productIds = $data['product_ids'] ?? null;
        unset($data['product_ids']);

        // Actualizar datos básicos
        $this->promoRepo->update($id, $data);
        
        // Actualizar productos si se proporcionan
        if ($productIds !== null) {
            $this->promoRepo->setProducts($id, $productIds);
        }

        $after = $this->promoRepo->findWithProducts($id);

        // Auditoría
        $this->auditRepo->logUpdate('promotions', $id, $before, $after);

        return ['success' => true, 'promotion' => $after];
    }

    /**
     * Eliminar promoción
     */
    public function delete(int $id): array
    {
        $promotion = $this->promoRepo->findWithProducts($id);
        
        if (!$promotion) {
            return ['success' => false, 'error' => 'Promoción no encontrada'];
        }

        // Eliminar banner si existe
        if (!empty($promotion['banner_image_path'])) {
            Files::delete($promotion['banner_image_path']);
        }

        // Los productos asociados se eliminan automáticamente por CASCADE
        $this->promoRepo->delete($id);

        // Auditoría
        $this->auditRepo->logDelete('promotions', $id, $promotion);

        return ['success' => true];
    }
}


<?php

namespace App\Services;

use App\Repositories\ServiceRepository;
use App\Repositories\FaqRepository;
use App\Repositories\LinkRepository;
use App\Repositories\DeliveryZoneRepository;
use App\Repositories\AuditRepository;

/**
 * Service para contenido (servicios, FAQs, enlaces, zonas)
 */
class ContentService
{
    private ServiceRepository $serviceRepo;
    private FaqRepository $faqRepo;
    private LinkRepository $linkRepo;
    private DeliveryZoneRepository $zoneRepo;
    private AuditRepository $auditRepo;

    public function __construct()
    {
        $this->serviceRepo = new ServiceRepository();
        $this->faqRepo = new FaqRepository();
        $this->linkRepo = new LinkRepository();
        $this->zoneRepo = new DeliveryZoneRepository();
        $this->auditRepo = new AuditRepository();
    }

    // ===================
    // SERVICIOS
    // ===================

    public function getPublicServices(): array
    {
        return $this->serviceRepo->getActive();
    }

    public function getAllServicesForAdmin(): array
    {
        return $this->serviceRepo->getAllForAdmin();
    }

    public function findService(int $id): ?array
    {
        return $this->serviceRepo->find($id);
    }

    public function createService(array $data): array
    {
        $data['is_active'] = $data['is_active'] ?? 1;
        $data['sort_order'] = $data['sort_order'] ?? $this->serviceRepo->getNextSortOrder();

        $id = $this->serviceRepo->create($data);
        $service = $this->serviceRepo->find($id);
        
        $this->auditRepo->logCreate('services', $id, $service);

        return $service;
    }

    public function updateService(int $id, array $data): ?array
    {
        $before = $this->serviceRepo->find($id);
        if (!$before) return null;

        $this->serviceRepo->update($id, $data);
        $after = $this->serviceRepo->find($id);
        
        $this->auditRepo->logUpdate('services', $id, $before, $after);

        return $after;
    }

    public function deleteService(int $id): bool
    {
        $service = $this->serviceRepo->find($id);
        if (!$service) return false;

        $this->serviceRepo->delete($id);
        $this->auditRepo->logDelete('services', $id, $service);

        return true;
    }

    // ===================
    // FAQs
    // ===================

    public function getPublicFAQs(): array
    {
        return $this->faqRepo->getActive();
    }

    public function getAllFAQsForAdmin(): array
    {
        return $this->faqRepo->getAllForAdmin();
    }

    public function findFAQ(int $id): ?array
    {
        return $this->faqRepo->find($id);
    }

    public function createFAQ(array $data): array
    {
        $data['is_active'] = $data['is_active'] ?? 1;
        $data['sort_order'] = $data['sort_order'] ?? $this->faqRepo->getNextSortOrder();

        $id = $this->faqRepo->create($data);
        $faq = $this->faqRepo->find($id);
        
        $this->auditRepo->logCreate('faqs', $id, $faq);

        return $faq;
    }

    public function updateFAQ(int $id, array $data): ?array
    {
        $before = $this->faqRepo->find($id);
        if (!$before) return null;

        $this->faqRepo->update($id, $data);
        $after = $this->faqRepo->find($id);
        
        $this->auditRepo->logUpdate('faqs', $id, $before, $after);

        return $after;
    }

    public function deleteFAQ(int $id): bool
    {
        $faq = $this->faqRepo->find($id);
        if (!$faq) return false;

        $this->faqRepo->delete($id);
        $this->auditRepo->logDelete('faqs', $id, $faq);

        return true;
    }

    // ===================
    // ENLACES
    // ===================

    public function getPublicLinks(): array
    {
        return $this->linkRepo->getActive();
    }

    public function getAllLinksForAdmin(): array
    {
        return $this->linkRepo->getAllForAdmin();
    }

    public function findLink(int $id): ?array
    {
        return $this->linkRepo->find($id);
    }

    public function createLink(array $data): array
    {
        $data['is_active'] = $data['is_active'] ?? 1;
        $data['sort_order'] = $data['sort_order'] ?? $this->linkRepo->getNextSortOrder();

        $id = $this->linkRepo->create($data);
        $link = $this->linkRepo->find($id);
        
        $this->auditRepo->logCreate('links', $id, $link);

        return $link;
    }

    public function updateLink(int $id, array $data): ?array
    {
        $before = $this->linkRepo->find($id);
        if (!$before) return null;

        $this->linkRepo->update($id, $data);
        $after = $this->linkRepo->find($id);
        
        $this->auditRepo->logUpdate('links', $id, $before, $after);

        return $after;
    }

    public function deleteLink(int $id): bool
    {
        $link = $this->linkRepo->find($id);
        if (!$link) return false;

        $this->linkRepo->delete($id);
        $this->auditRepo->logDelete('links', $id, $link);

        return true;
    }

    // ===================
    // ZONAS DE COBERTURA
    // ===================

    public function getPublicDeliveryZones(): array
    {
        return $this->zoneRepo->getActive();
    }
}


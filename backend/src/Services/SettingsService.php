<?php

namespace App\Services;

use App\Repositories\SettingsRepository;
use App\Repositories\AuditRepository;

/**
 * Service de settings (configuración)
 */
class SettingsService
{
    private SettingsRepository $settingsRepo;
    private AuditRepository $auditRepo;

    public function __construct()
    {
        $this->settingsRepo = new SettingsRepository();
        $this->auditRepo = new AuditRepository();
    }

    /**
     * Obtener todos los settings públicos
     */
    public function getPublicSettings(): array
    {
        $settings = $this->settingsRepo->getAllAsArray();
        
        // Filtrar solo settings públicos
        $publicKeys = [
            'business_name',
            'address',
            'whatsapp_number',
            'contact_email',
            'hours_weekdays',
            'hours_sundays',
            'rappi_url',
            'facebook_url',
            'instagram_url',
            'brand_color_green',
            'brand_color_blue',
            'brand_color_blue_light',
            'brand_color_red',
            'brand_color_gray',
            'brand_color_white',
        ];

        return array_intersect_key($settings, array_flip($publicKeys));
    }

    /**
     * Obtener todos los settings para admin
     */
    public function getAllForAdmin(): array
    {
        return $this->settingsRepo->getAllAsArray();
    }

    /**
     * Obtener un setting específico
     */
    public function get(string $key, $default = null): ?string
    {
        return $this->settingsRepo->get($key, $default);
    }

    /**
     * Actualizar settings
     */
    public function update(array $settings): array
    {
        $before = $this->settingsRepo->getAllAsArray();
        
        $this->settingsRepo->setMany($settings);
        
        $after = $this->settingsRepo->getAllAsArray();

        // Auditoría
        $this->auditRepo->log('settings', null, 'UPDATE', $before, $after);

        return $after;
    }
}


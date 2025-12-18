<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\SettingsService;

/**
 * Controller de settings (admin)
 */
class SettingsController
{
    private SettingsService $settingsService;

    public function __construct()
    {
        $this->settingsService = new SettingsService();
    }

    /**
     * GET /admin/settings
     */
    public function index(Request $request, Response $response): void
    {
        $settings = $this->settingsService->getAllForAdmin();
        $response->json($settings);
    }

    /**
     * PUT /admin/settings
     */
    public function update(Request $request, Response $response): void
    {
        // Validar campos permitidos
        $allowedKeys = [
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

        $data = $request->input();
        
        // Filtrar solo keys permitidas
        $settings = [];
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedKeys)) {
                $settings[$key] = $value;
            }
        }

        if (empty($settings)) {
            $response->error('No se proporcionaron configuraciones válidas', 'VALIDATION_ERROR', null, 400);
            return;
        }

        $updated = $this->settingsService->update($settings);
        $response->json($updated);
    }
}


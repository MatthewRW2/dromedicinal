<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\ContentService;

/**
 * Controller de servicios (admin)
 */
class ServiceController
{
    private ContentService $contentService;

    public function __construct()
    {
        $this->contentService = new ContentService();
    }

    /**
     * GET /admin/services
     */
    public function index(Request $request, Response $response): void
    {
        $services = $this->contentService->getAllServicesForAdmin();
        $response->json($services);
    }

    /**
     * GET /admin/services/{id}
     */
    public function show(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $service = $this->contentService->findService($id);

        if (!$service) {
            $response->notFound('Servicio no encontrado');
            return;
        }

        $response->json($service);
    }

    /**
     * POST /admin/services
     */
    public function store(Request $request, Response $response): void
    {
        $validator = Validator::make($request->input(), [
            'title' => 'required|string|min:2|max:160',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:80',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min_value:0'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $service = $this->contentService->createService($validator->validated());
        $response->created($service);
    }

    /**
     * PUT /admin/services/{id}
     */
    public function update(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');

        $validator = Validator::make($request->input(), [
            'title' => 'nullable|string|min:2|max:160',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:80',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min_value:0'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $service = $this->contentService->updateService($id, $validator->validated());

        if (!$service) {
            $response->notFound('Servicio no encontrado');
            return;
        }

        $response->json($service);
    }

    /**
     * DELETE /admin/services/{id}
     */
    public function destroy(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        
        if (!$this->contentService->deleteService($id)) {
            $response->notFound('Servicio no encontrado');
            return;
        }

        $response->json(['message' => 'Servicio eliminado correctamente']);
    }
}


<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\ContentService;

/**
 * Controller de enlaces (admin)
 */
class LinkController
{
    private ContentService $contentService;

    public function __construct()
    {
        $this->contentService = new ContentService();
    }

    /**
     * GET /admin/links
     */
    public function index(Request $request, Response $response): void
    {
        $links = $this->contentService->getAllLinksForAdmin();
        $response->json($links);
    }

    /**
     * GET /admin/links/{id}
     */
    public function show(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $link = $this->contentService->findLink($id);

        if (!$link) {
            $response->notFound('Enlace no encontrado');
            return;
        }

        $response->json($link);
    }

    /**
     * POST /admin/links
     */
    public function store(Request $request, Response $response): void
    {
        $validator = Validator::make($request->input(), [
            'title' => 'required|string|min:2|max:180',
            'url' => 'required|url|max:500',
            'category' => 'nullable|string|max:80',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min_value:0'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $link = $this->contentService->createLink($validator->validated());
        $response->created($link);
    }

    /**
     * PUT /admin/links/{id}
     */
    public function update(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');

        $validator = Validator::make($request->input(), [
            'title' => 'nullable|string|min:2|max:180',
            'url' => 'nullable|url|max:500',
            'category' => 'nullable|string|max:80',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min_value:0'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $link = $this->contentService->updateLink($id, $validator->validated());

        if (!$link) {
            $response->notFound('Enlace no encontrado');
            return;
        }

        $response->json($link);
    }

    /**
     * DELETE /admin/links/{id}
     */
    public function destroy(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        
        if (!$this->contentService->deleteLink($id)) {
            $response->notFound('Enlace no encontrado');
            return;
        }

        $response->json(['message' => 'Enlace eliminado correctamente']);
    }
}


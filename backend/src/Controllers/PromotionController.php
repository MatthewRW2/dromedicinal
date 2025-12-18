<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\PromotionService;

/**
 * Controller de promociones (admin)
 */
class PromotionController
{
    private PromotionService $promotionService;

    public function __construct()
    {
        $this->promotionService = new PromotionService();
    }

    /**
     * GET /admin/promotions
     */
    public function index(Request $request, Response $response): void
    {
        $promotions = $this->promotionService->getAllForAdmin();
        $response->json($promotions);
    }

    /**
     * GET /admin/promotions/{id}
     */
    public function show(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $promotion = $this->promotionService->find($id);

        if (!$promotion) {
            $response->notFound('Promoción no encontrada');
            return;
        }

        $response->json($promotion);
    }

    /**
     * POST /admin/promotions
     */
    public function store(Request $request, Response $response): void
    {
        $validator = Validator::make($request->input(), [
            'title' => 'required|string|min:2|max:160',
            'description' => 'nullable|string',
            'starts_at' => 'nullable|datetime',
            'ends_at' => 'nullable|datetime',
            'is_active' => 'nullable|boolean',
            'banner_image_path' => 'nullable|string|max:255',
            'product_ids' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $result = $this->promotionService->create($validator->validated());

        if (!$result['success']) {
            $response->error($result['error'], 'CREATE_ERROR', null, 400);
            return;
        }

        $response->created($result['promotion']);
    }

    /**
     * PUT /admin/promotions/{id}
     */
    public function update(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');

        $validator = Validator::make($request->input(), [
            'title' => 'nullable|string|min:2|max:160',
            'description' => 'nullable|string',
            'starts_at' => 'nullable|datetime',
            'ends_at' => 'nullable|datetime',
            'is_active' => 'nullable|boolean',
            'banner_image_path' => 'nullable|string|max:255',
            'product_ids' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $result = $this->promotionService->update($id, $validator->validated());

        if (!$result['success']) {
            $response->error($result['error'], 'UPDATE_ERROR', null, 400);
            return;
        }

        $response->json($result['promotion']);
    }

    /**
     * DELETE /admin/promotions/{id}
     */
    public function destroy(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $result = $this->promotionService->delete($id);

        if (!$result['success']) {
            $response->error($result['error'], 'DELETE_ERROR', null, 400);
            return;
        }

        $response->json(['message' => 'Promoción eliminada correctamente']);
    }
}


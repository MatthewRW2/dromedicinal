<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\CategoryService;

/**
 * Controller de categorías (admin)
 */
class CategoryController
{
    private CategoryService $categoryService;

    public function __construct()
    {
        $this->categoryService = new CategoryService();
    }

    /**
     * GET /admin/categories
     */
    public function index(Request $request, Response $response): void
    {
        $categories = $this->categoryService->getAllForAdmin();
        $response->json($categories);
    }

    /**
     * GET /admin/categories/{id}
     */
    public function show(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $category = $this->categoryService->find($id);

        if (!$category) {
            $response->notFound('Categoría no encontrada');
            return;
        }

        $response->json($category);
    }

    /**
     * POST /admin/categories
     */
    public function store(Request $request, Response $response): void
    {
        $validator = Validator::make($request->input(), [
            'name' => 'required|string|min:2|max:120',
            'parent_id' => 'nullable|integer',
            'description' => 'nullable|string|max:1000',
            'image_path' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min_value:0'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $category = $this->categoryService->create($validator->validated());
        $response->created($category);
    }

    /**
     * PUT /admin/categories/{id}
     */
    public function update(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        
        $validator = Validator::make($request->input(), [
            'name' => 'nullable|string|min:2|max:120',
            'parent_id' => 'nullable|integer',
            'description' => 'nullable|string|max:1000',
            'image_path' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min_value:0'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $category = $this->categoryService->update($id, $validator->validated());

        if (!$category) {
            $response->notFound('Categoría no encontrada');
            return;
        }

        $response->json($category);
    }

    /**
     * DELETE /admin/categories/{id}
     */
    public function destroy(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $result = $this->categoryService->delete($id);

        if (!$result['success']) {
            $response->error($result['error'], 'DELETE_ERROR', null, 400);
            return;
        }

        $response->json(['message' => 'Categoría eliminada correctamente']);
    }
}


<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\ProductService;

/**
 * Controller de productos (admin)
 */
class ProductController
{
    private ProductService $productService;

    public function __construct()
    {
        $this->productService = new ProductService();
    }

    /**
     * GET /admin/products
     */
    public function index(Request $request, Response $response): void
    {
        $filters = [
            'is_active' => $request->query('is_active'),
            'category_id' => $request->query('category_id'),
            'q' => $request->query('q'),
        ];
        $filters = array_filter($filters, fn($v) => $v !== null && $v !== '');

        $page = max(1, (int) $request->query('page', 1));
        $perPage = min(100, max(1, (int) $request->query('per_page', 50)));

        $result = $this->productService->getAllForAdmin($page, $perPage, $filters);
        $response->json($result['items'], $result['meta']);
    }

    /**
     * GET /admin/products/{id}
     */
    public function show(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $product = $this->productService->find($id);

        if (!$product) {
            $response->notFound('Producto no encontrado');
            return;
        }

        $response->json($product);
    }

    /**
     * POST /admin/products
     */
    public function store(Request $request, Response $response): void
    {
        $validator = Validator::make($request->input(), [
            'name' => 'required|string|min:2|max:200',
            'category_id' => 'required|integer',
            'sku' => 'nullable|string|max:60',
            'presentation' => 'nullable|string|max:180',
            'description' => 'nullable|string',
            'brand' => 'nullable|string|max:120',
            'requires_prescription' => 'nullable|boolean',
            'price' => 'nullable|numeric|min_value:0',
            'currency' => 'nullable|string|max:3',
            'availability_status' => 'nullable|in:IN_STOCK,LOW_STOCK,OUT_OF_STOCK,ON_REQUEST',
            'stock_qty' => 'nullable|integer|min_value:0',
            'low_stock_threshold' => 'nullable|integer|min_value:0',
            'is_featured' => 'nullable|boolean',
            'featured_order' => 'nullable|integer|min_value:0',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $result = $this->productService->create($validator->validated());

        if (!$result['success']) {
            $response->error($result['error'], 'CREATE_ERROR', null, 400);
            return;
        }

        $response->created($result['product']);
    }

    /**
     * PUT /admin/products/{id}
     */
    public function update(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');

        $validator = Validator::make($request->input(), [
            'name' => 'nullable|string|min:2|max:200',
            'category_id' => 'nullable|integer',
            'sku' => 'nullable|string|max:60',
            'presentation' => 'nullable|string|max:180',
            'description' => 'nullable|string',
            'brand' => 'nullable|string|max:120',
            'requires_prescription' => 'nullable|boolean',
            'price' => 'nullable|numeric|min_value:0',
            'currency' => 'nullable|string|max:3',
            'availability_status' => 'nullable|in:IN_STOCK,LOW_STOCK,OUT_OF_STOCK,ON_REQUEST',
            'stock_qty' => 'nullable|integer|min_value:0',
            'low_stock_threshold' => 'nullable|integer|min_value:0',
            'is_featured' => 'nullable|boolean',
            'featured_order' => 'nullable|integer|min_value:0',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $result = $this->productService->update($id, $validator->validated());

        if (!$result['success']) {
            if ($result['error'] === 'Producto no encontrado') {
                $response->notFound($result['error']);
            } else {
                $response->error($result['error'], 'UPDATE_ERROR', null, 400);
            }
            return;
        }

        $response->json($result['product']);
    }

    /**
     * DELETE /admin/products/{id}
     */
    public function destroy(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $result = $this->productService->delete($id);

        if (!$result['success']) {
            $response->error($result['error'], 'DELETE_ERROR', null, 400);
            return;
        }

        $response->json(['message' => 'Producto eliminado correctamente']);
    }

    /**
     * POST /admin/products/{id}/images
     */
    public function uploadImage(Request $request, Response $response): void
    {
        $productId = (int) $request->param('id');
        $file = $request->file('image');

        if (!$file) {
            $response->error('No se recibió ninguna imagen', 'UPLOAD_ERROR', null, 400);
            return;
        }

        $result = $this->productService->uploadImage($productId, $file);

        if (!$result['success']) {
            $response->error($result['error'], 'UPLOAD_ERROR', null, 400);
            return;
        }

        $response->created($result['image']);
    }

    /**
     * DELETE /admin/products/{id}/images/{imageId}
     */
    public function deleteImage(Request $request, Response $response): void
    {
        $productId = (int) $request->param('id');
        $imageId = (int) $request->param('imageId');

        $result = $this->productService->deleteImage($productId, $imageId);

        if (!$result['success']) {
            $response->error($result['error'], 'DELETE_ERROR', null, 400);
            return;
        }

        $response->json(['message' => 'Imagen eliminada correctamente']);
    }

    /**
     * PUT /admin/products/{id}/images/reorder
     */
    public function reorderImages(Request $request, Response $response): void
    {
        $productId = (int) $request->param('id');
        
        $validator = Validator::make($request->input(), [
            'image_ids' => 'required|array'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $imageIds = $request->input('image_ids');
        $result = $this->productService->reorderImages($productId, $imageIds);

        $response->json($result['images']);
    }
}


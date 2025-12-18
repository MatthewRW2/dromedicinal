<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Core\Validator;
use App\Services\ContentService;

/**
 * Controller de FAQs (admin)
 */
class FaqController
{
    private ContentService $contentService;

    public function __construct()
    {
        $this->contentService = new ContentService();
    }

    /**
     * GET /admin/faqs
     */
    public function index(Request $request, Response $response): void
    {
        $faqs = $this->contentService->getAllFAQsForAdmin();
        $response->json($faqs);
    }

    /**
     * GET /admin/faqs/{id}
     */
    public function show(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        $faq = $this->contentService->findFAQ($id);

        if (!$faq) {
            $response->notFound('FAQ no encontrada');
            return;
        }

        $response->json($faq);
    }

    /**
     * POST /admin/faqs
     */
    public function store(Request $request, Response $response): void
    {
        $validator = Validator::make($request->input(), [
            'question' => 'required|string|min:5|max:255',
            'answer' => 'required|string|min:10',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min_value:0'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $faq = $this->contentService->createFAQ($validator->validated());
        $response->created($faq);
    }

    /**
     * PUT /admin/faqs/{id}
     */
    public function update(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');

        $validator = Validator::make($request->input(), [
            'question' => 'nullable|string|min:5|max:255',
            'answer' => 'nullable|string|min:10',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min_value:0'
        ]);

        if ($validator->fails()) {
            $response->validationError($validator->errors());
            return;
        }

        $faq = $this->contentService->updateFAQ($id, $validator->validated());

        if (!$faq) {
            $response->notFound('FAQ no encontrada');
            return;
        }

        $response->json($faq);
    }

    /**
     * DELETE /admin/faqs/{id}
     */
    public function destroy(Request $request, Response $response): void
    {
        $id = (int) $request->param('id');
        
        if (!$this->contentService->deleteFAQ($id)) {
            $response->notFound('FAQ no encontrada');
            return;
        }

        $response->json(['message' => 'FAQ eliminada correctamente']);
    }
}


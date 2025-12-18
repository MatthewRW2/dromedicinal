<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\ProductService;
use App\Services\ContactService;

/**
 * Controller de reportes (admin)
 */
class ReportController
{
    private ProductService $productService;
    private ContactService $contactService;

    public function __construct()
    {
        $this->productService = new ProductService();
        $this->contactService = new ContactService();
    }

    /**
     * GET /admin/reports/stock-low
     */
    public function stockLow(Request $request, Response $response): void
    {
        $products = $this->productService->getLowStock();
        $response->json($products);
    }

    /**
     * GET /admin/reports/catalog-summary
     */
    public function catalogSummary(Request $request, Response $response): void
    {
        $summary = $this->productService->getCatalogSummary();
        $response->json($summary);
    }

    /**
     * GET /admin/reports/contact-messages
     */
    public function contactMessages(Request $request, Response $response): void
    {
        $page = max(1, (int) $request->query('page', 1));
        $perPage = min(100, max(1, (int) $request->query('per_page', 20)));
        $status = $request->query('status');

        $result = $this->contactService->getMessages($page, $perPage, $status);
        $stats = $this->contactService->getStats();

        $response->json([
            'messages' => $result['items'],
            'stats' => $stats
        ], $result['meta']);
    }
}


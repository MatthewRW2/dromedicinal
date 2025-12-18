<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\SettingsService;
use App\Services\CategoryService;
use App\Services\ProductService;
use App\Services\PromotionService;
use App\Services\ContentService;

/**
 * Controller para endpoints públicos
 */
class PublicController
{
    private SettingsService $settingsService;
    private CategoryService $categoryService;
    private ProductService $productService;
    private PromotionService $promotionService;
    private ContentService $contentService;

    public function __construct()
    {
        $this->settingsService = new SettingsService();
        $this->categoryService = new CategoryService();
        $this->productService = new ProductService();
        $this->promotionService = new PromotionService();
        $this->contentService = new ContentService();
    }

    /**
     * GET /public/settings
     */
    public function getSettings(Request $request, Response $response): void
    {
        $settings = $this->settingsService->getPublicSettings();
        $response->json($settings);
    }

    /**
     * GET /public/categories
     */
    public function getCategories(Request $request, Response $response): void
    {
        $categories = $this->categoryService->getPublicCategories();
        $response->json($categories);
    }

    /**
     * GET /public/categories/{slug}
     */
    public function getCategory(Request $request, Response $response): void
    {
        $slug = $request->param('slug');
        $category = $this->categoryService->getPublicCategory($slug);

        if (!$category) {
            $response->notFound('Categoría no encontrada');
            return;
        }

        $response->json($category);
    }

    /**
     * GET /public/products
     */
    public function getProducts(Request $request, Response $response): void
    {
        $filters = [
            'category' => $request->query('category'),
            'q' => $request->query('q'),
            'brand' => $request->query('brand'),
            'availability' => $request->query('availability'),
            'min_price' => $request->query('min_price'),
            'max_price' => $request->query('max_price'),
        ];
        
        // Remover filtros vacíos
        $filters = array_filter($filters, fn($v) => $v !== null && $v !== '');

        $page = max(1, (int) $request->query('page', 1));
        $perPage = min(100, max(1, (int) $request->query('per_page', 24)));

        $result = $this->productService->getPublicProducts($filters, $page, $perPage);
        
        $response->json($result['items'], $result['meta']);
    }

    /**
     * GET /public/products/{slug}
     */
    public function getProduct(Request $request, Response $response): void
    {
        $slug = $request->param('slug');
        $product = $this->productService->getPublicProduct($slug);

        if (!$product) {
            $response->notFound('Producto no encontrado');
            return;
        }

        $response->json($product);
    }

    /**
     * GET /public/featured-products
     */
    public function getFeaturedProducts(Request $request, Response $response): void
    {
        $limit = min(20, max(1, (int) $request->query('limit', 8)));
        $products = $this->productService->getFeaturedProducts($limit);
        $response->json($products);
    }

    /**
     * GET /public/promotions
     */
    public function getPromotions(Request $request, Response $response): void
    {
        $promotions = $this->promotionService->getPublicPromotions();
        $response->json($promotions);
    }

    /**
     * GET /public/promotions/{slug}
     */
    public function getPromotion(Request $request, Response $response): void
    {
        $slug = $request->param('slug');
        $promotion = $this->promotionService->getPublicPromotion($slug);

        if (!$promotion) {
            $response->notFound('Promoción no encontrada');
            return;
        }

        $response->json($promotion);
    }

    /**
     * GET /public/services
     */
    public function getServices(Request $request, Response $response): void
    {
        $services = $this->contentService->getPublicServices();
        $response->json($services);
    }

    /**
     * GET /public/faqs
     */
    public function getFAQs(Request $request, Response $response): void
    {
        $faqs = $this->contentService->getPublicFAQs();
        $response->json($faqs);
    }

    /**
     * GET /public/links
     */
    public function getLinks(Request $request, Response $response): void
    {
        $links = $this->contentService->getPublicLinks();
        $response->json($links);
    }

    /**
     * GET /public/delivery-zones
     */
    public function getDeliveryZones(Request $request, Response $response): void
    {
        $zones = $this->contentService->getPublicDeliveryZones();
        $response->json($zones);
    }
}


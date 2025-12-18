<?php
/**
 * Definición de rutas de la API - Dromedicinal
 */

use App\Core\Router;

/** @var Router $router */

// ==============================================
// RUTAS PÚBLICAS (sin autenticación)
// ==============================================

// Settings
$router->get('/public/settings', 'PublicController@getSettings');

// Categorías
$router->get('/public/categories', 'PublicController@getCategories');
$router->get('/public/categories/{slug}', 'PublicController@getCategory');

// Productos
$router->get('/public/products', 'PublicController@getProducts');
$router->get('/public/products/{slug}', 'PublicController@getProduct');

// Productos destacados
$router->get('/public/featured-products', 'PublicController@getFeaturedProducts');

// Promociones
$router->get('/public/promotions', 'PublicController@getPromotions');
$router->get('/public/promotions/{slug}', 'PublicController@getPromotion');

// Servicios
$router->get('/public/services', 'PublicController@getServices');

// FAQs
$router->get('/public/faqs', 'PublicController@getFAQs');

// Enlaces
$router->get('/public/links', 'PublicController@getLinks');

// Zonas de cobertura
$router->get('/public/delivery-zones', 'PublicController@getDeliveryZones');

// Contacto
$router->post('/public/contact', 'ContactController@store');

// ==============================================
// RUTAS DE AUTENTICACIÓN
// ==============================================

$router->post('/auth/login', 'AuthController@login');
$router->post('/auth/logout', 'AuthController@logout');
$router->get('/auth/me', 'AuthController@me');

// ==============================================
// RUTAS ADMIN (requieren autenticación)
// ==============================================

// --- Categorías ---
$router->get('/admin/categories', 'CategoryController@index', ['auth']);
$router->post('/admin/categories', 'CategoryController@store', ['auth', 'role:admin,catalog_manager']);
$router->get('/admin/categories/{id}', 'CategoryController@show', ['auth']);
$router->put('/admin/categories/{id}', 'CategoryController@update', ['auth', 'role:admin,catalog_manager']);
$router->delete('/admin/categories/{id}', 'CategoryController@destroy', ['auth', 'role:admin,catalog_manager']);

// --- Productos ---
$router->get('/admin/products', 'ProductController@index', ['auth']);
$router->post('/admin/products', 'ProductController@store', ['auth', 'role:admin,catalog_manager']);
$router->get('/admin/products/{id}', 'ProductController@show', ['auth']);
$router->put('/admin/products/{id}', 'ProductController@update', ['auth', 'role:admin,catalog_manager']);
$router->delete('/admin/products/{id}', 'ProductController@destroy', ['auth', 'role:admin,catalog_manager']);

// Imágenes de productos
$router->post('/admin/products/{id}/images', 'ProductController@uploadImage', ['auth', 'role:admin,catalog_manager']);
$router->delete('/admin/products/{id}/images/{imageId}', 'ProductController@deleteImage', ['auth', 'role:admin,catalog_manager']);
$router->put('/admin/products/{id}/images/reorder', 'ProductController@reorderImages', ['auth', 'role:admin,catalog_manager']);

// --- Promociones ---
$router->get('/admin/promotions', 'PromotionController@index', ['auth']);
$router->post('/admin/promotions', 'PromotionController@store', ['auth', 'role:admin,marketing']);
$router->get('/admin/promotions/{id}', 'PromotionController@show', ['auth']);
$router->put('/admin/promotions/{id}', 'PromotionController@update', ['auth', 'role:admin,marketing']);
$router->delete('/admin/promotions/{id}', 'PromotionController@destroy', ['auth', 'role:admin,marketing']);

// --- Servicios ---
$router->get('/admin/services', 'ServiceController@index', ['auth']);
$router->post('/admin/services', 'ServiceController@store', ['auth', 'role:admin,catalog_manager']);
$router->get('/admin/services/{id}', 'ServiceController@show', ['auth']);
$router->put('/admin/services/{id}', 'ServiceController@update', ['auth', 'role:admin,catalog_manager']);
$router->delete('/admin/services/{id}', 'ServiceController@destroy', ['auth', 'role:admin,catalog_manager']);

// --- FAQs ---
$router->get('/admin/faqs', 'FaqController@index', ['auth']);
$router->post('/admin/faqs', 'FaqController@store', ['auth', 'role:admin,catalog_manager']);
$router->get('/admin/faqs/{id}', 'FaqController@show', ['auth']);
$router->put('/admin/faqs/{id}', 'FaqController@update', ['auth', 'role:admin,catalog_manager']);
$router->delete('/admin/faqs/{id}', 'FaqController@destroy', ['auth', 'role:admin,catalog_manager']);

// --- Enlaces ---
$router->get('/admin/links', 'LinkController@index', ['auth']);
$router->post('/admin/links', 'LinkController@store', ['auth', 'role:admin,catalog_manager']);
$router->get('/admin/links/{id}', 'LinkController@show', ['auth']);
$router->put('/admin/links/{id}', 'LinkController@update', ['auth', 'role:admin,catalog_manager']);
$router->delete('/admin/links/{id}', 'LinkController@destroy', ['auth', 'role:admin,catalog_manager']);

// --- Usuarios (solo admin) ---
$router->get('/admin/users', 'UserController@index', ['auth', 'role:admin']);
$router->post('/admin/users', 'UserController@store', ['auth', 'role:admin']);
$router->get('/admin/users/{id}', 'UserController@show', ['auth', 'role:admin']);
$router->put('/admin/users/{id}', 'UserController@update', ['auth', 'role:admin']);
$router->delete('/admin/users/{id}', 'UserController@destroy', ['auth', 'role:admin']);

// --- Reportes ---
$router->get('/admin/reports/stock-low', 'ReportController@stockLow', ['auth']);
$router->get('/admin/reports/catalog-summary', 'ReportController@catalogSummary', ['auth']);
$router->get('/admin/reports/contact-messages', 'ReportController@contactMessages', ['auth']);

// --- Settings (admin) ---
$router->get('/admin/settings', 'SettingsController@index', ['auth']);
$router->put('/admin/settings', 'SettingsController@update', ['auth', 'role:admin']);


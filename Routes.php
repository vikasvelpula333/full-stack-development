<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Default route
$routes->get('/', 'Home::index');

// CORS preflight requests
$routes->options('(:any)', function() {
    return service('response')->setStatusCode(200);
});

// Auth routes (no authentication required)
$routes->group('api/auth', ['namespace' => 'App\Controllers\Auth'], function($routes) {
    $routes->post('register', 'AuthController::register');
    $routes->post('login', 'AuthController::login');
    $routes->post('logout', 'AuthController::logout');
});

// Protected API routes (authentication required)
$routes->group('api', ['namespace' => 'App\Controllers\Api', 'filter' => 'jwt'], function($routes) {
    // User profile routes
    $routes->get('profile', 'Auth\AuthController::profile');

    // Teacher management routes
    $routes->get('teachers', 'TeacherController::index');
    $routes->get('teachers/search', 'TeacherController::search');
    $routes->get('teachers/(:num)', 'TeacherController::show/$1');
    $routes->put('teachers/(:num)', 'TeacherController::update/$1');
    $routes->delete('teachers/(:num)', 'TeacherController::delete/$1');
});

// Health check route
$routes->get('api/health', function() {
    return service('response')->setJSON([
        'status' => 'success',
        'message' => 'API is running',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
});

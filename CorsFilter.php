<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class CorsFilter implements FilterInterface
{
    /**
     * Before filter for handling CORS preflight requests
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        $response = service('response');

        // Get allowed origins from environment
        $allowedOrigins = explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'));
        $origin = $request->getServer('HTTP_ORIGIN');

        // Check if origin is allowed
        if (in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins)) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
        }

        $response->setHeader('Access-Control-Allow-Methods', env('CORS_ALLOWED_METHODS', 'GET,POST,PUT,DELETE,OPTIONS'));
        $response->setHeader('Access-Control-Allow-Headers', env('CORS_ALLOWED_HEADERS', 'Content-Type,Authorization,X-Requested-With'));
        $response->setHeader('Access-Control-Allow-Credentials', 'true');
        $response->setHeader('Access-Control-Max-Age', '86400');

        // Handle preflight OPTIONS request
        if ($request->getMethod() === 'options') {
            return $response->setStatusCode(200);
        }
    }

    /**
     * After filter
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing to do here
    }
}

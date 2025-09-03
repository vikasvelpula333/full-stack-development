<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JWTAuthFilter implements FilterInterface
{
    /**
     * Before filter for JWT authentication
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        $response = service('response');

        // Get authorization header
        $authHeader = $request->getServer('HTTP_AUTHORIZATION');

        if (!$authHeader) {
            return $response->setJSON([
                'status' => 'error',
                'message' => 'Authorization header not found'
            ])->setStatusCode(401);
        }

        // Extract token from Bearer format
        if (strpos($authHeader, 'Bearer ') !== 0) {
            return $response->setJSON([
                'status' => 'error', 
                'message' => 'Invalid authorization format'
            ])->setStatusCode(401);
        }

        $token = substr($authHeader, 7); // Remove "Bearer " prefix

        try {
            // Decode JWT token
            $key = env('JWT_SECRET_KEY');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            // Store user data in request for controller access
            $request->user = $decoded;

            return $request;

        } catch (Exception $e) {
            return $response->setJSON([
                'status' => 'error',
                'message' => 'Invalid or expired token'
            ])->setStatusCode(401);
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

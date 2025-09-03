<?php

namespace App\Controllers\Auth;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use Firebase\JWT\JWT;

class AuthController extends ResourceController
{
    use ResponseTrait;

    protected $authUserModel;
    protected $teacherModel;

    public function __construct()
    {
        $this->authUserModel = new AuthUserModel();
        $this->teacherModel = new TeacherModel();
    }

    /**
     * User Registration API
     */
    public function register()
    {
        $rules = [
            'email'           => 'required|valid_email|is_unique[auth_user.email]',
            'first_name'      => 'required|min_length[2]|max_length[50]|alpha',
            'last_name'       => 'required|min_length[2]|max_length[50]|alpha',
            'password'        => 'required|min_length[6]',
            'university_name' => 'required|min_length[3]|max_length[200]',
            'gender'          => 'required|in_list[Male,Female,Other]',
            'year_joined'     => 'required|integer|greater_than[1900]|less_than_equal_to[' . date('Y') . ']',
            'department'      => 'permit_empty|max_length[100]',
            'qualification'   => 'permit_empty|max_length[100]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $this->validator->getErrors()
            ], 400);
        }

        $data = $this->request->getJSON(true);

        // Start transaction
        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // Create user
            $userData = [
                'email'      => $data['email'],
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'password'   => $data['password']
            ];

            $userId = $this->authUserModel->insert($userData);

            if (!$userId) {
                $db->transRollback();
                return $this->fail([
                    'status' => 'error',
                    'message' => 'Failed to create user',
                    'errors' => $this->authUserModel->errors()
                ], 500);
            }

            // Create teacher profile
            $teacherData = [
                'user_id'         => $userId,
                'university_name' => $data['university_name'],
                'gender'          => $data['gender'],
                'year_joined'     => $data['year_joined'],
                'department'      => $data['department'] ?? null,
                'qualification'   => $data['qualification'] ?? null
            ];

            $teacherId = $this->teacherModel->insert($teacherData);

            if (!$teacherId) {
                $db->transRollback();
                return $this->fail([
                    'status' => 'error',
                    'message' => 'Failed to create teacher profile',
                    'errors' => $this->teacherModel->errors()
                ], 500);
            }

            $db->transComplete();

            // Generate JWT token
            $token = $this->generateJWTToken($userId, $data['email']);

            return $this->respond([
                'status' => 'success',
                'message' => 'Registration successful',
                'data' => [
                    'user_id' => $userId,
                    'teacher_id' => $teacherId,
                    'token' => $token,
                    'user' => [
                        'id' => $userId,
                        'email' => $data['email'],
                        'first_name' => $data['first_name'],
                        'last_name' => $data['last_name']
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            $db->transRollback();
            return $this->fail([
                'status' => 'error',
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * User Login API
     */
    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $this->validator->getErrors()
            ], 400);
        }

        $data = $this->request->getJSON(true);

        // Get user by email
        $user = $this->authUserModel->getUserByEmail($data['email']);

        if (!$user) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Verify password
        if (!$this->authUserModel->verifyPassword($data['password'], $user['password'])) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Generate JWT token
        $token = $this->generateJWTToken($user['id'], $user['email']);

        // Get teacher data
        $teacher = $this->teacherModel->getTeacherByUserId($user['id']);

        return $this->respond([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name']
                ],
                'teacher' => $teacher
            ]
        ], 200);
    }

    /**
     * Get User Profile API
     */
    public function profile()
    {
        $userId = $this->request->user->user_id ?? null;

        if (!$userId) {
            return $this->fail([
                'status' => 'error',
                'message' => 'User ID not found in token'
            ], 400);
        }

        $user = $this->authUserModel->getUserWithTeacher($userId);

        if (!$user) {
            return $this->fail([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Remove password from response
        unset($user['password']);

        return $this->respond([
            'status' => 'success',
            'data' => $user
        ], 200);
    }

    /**
     * Generate JWT Token
     */
    private function generateJWTToken($userId, $email)
    {
        $key = env('JWT_SECRET_KEY');
        $payload = [
            'user_id' => $userId,
            'email' => $email,
            'iat' => time(),
            'exp' => time() + (int)env('JWT_TIME_TO_LIVE', 3600)
        ];

        return JWT::encode($payload, $key, 'HS256');
    }

    /**
     * Logout API (Optional - mainly for frontend token management)
     */
    public function logout()
    {
        return $this->respond([
            'status' => 'success',
            'message' => 'Logout successful'
        ], 200);
    }
}

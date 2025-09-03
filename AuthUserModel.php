<?php

namespace App\Models;

use CodeIgniter\Model;

class AuthUserModel extends Model
{
    protected $table            = 'auth_user';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'email',
        'first_name', 
        'last_name',
        'password',
        'is_active'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'email'      => 'required|valid_email|is_unique[auth_user.email]',
        'first_name' => 'required|min_length[2]|max_length[50]',
        'last_name'  => 'required|min_length[2]|max_length[50]',
        'password'   => 'required|min_length[6]'
    ];

    protected $validationMessages   = [
        'email' => [
            'required'    => 'Email is required',
            'valid_email' => 'Please enter a valid email',
            'is_unique'   => 'Email already exists'
        ],
        'first_name' => [
            'required'   => 'First name is required',
            'min_length' => 'First name must be at least 2 characters',
            'max_length' => 'First name cannot exceed 50 characters'
        ],
        'last_name' => [
            'required'   => 'Last name is required',
            'min_length' => 'Last name must be at least 2 characters', 
            'max_length' => 'Last name cannot exceed 50 characters'
        ],
        'password' => [
            'required'   => 'Password is required',
            'min_length' => 'Password must be at least 6 characters'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['hashPassword'];
    protected $beforeUpdate   = ['hashPassword'];

    /**
     * Hash password before saving to database
     */
    protected function hashPassword(array $data)
    {
        if (isset($data['data']['password'])) {
            $data['data']['password'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
        }

        return $data;
    }

    /**
     * Get user by email
     */
    public function getUserByEmail($email)
    {
        return $this->where('email', $email)
                   ->where('is_active', 1)
                   ->first();
    }

    /**
     * Verify user password
     */
    public function verifyPassword($password, $hashedPassword)
    {
        return password_verify($password, $hashedPassword);
    }

    /**
     * Get user with teacher data
     */
    public function getUserWithTeacher($userId)
    {
        return $this->select('auth_user.*, teachers.university_name, teachers.gender, teachers.year_joined')
                   ->join('teachers', 'teachers.user_id = auth_user.id', 'left')
                   ->where('auth_user.id', $userId)
                   ->first();
    }
}

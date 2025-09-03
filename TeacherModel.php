<?php

namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table            = 'teachers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'user_id',
        'university_name',
        'gender',
        'year_joined',
        'department',
        'qualification',
        'experience_years',
        'specialization'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'user_id'         => 'required|is_natural_no_zero|is_unique[teachers.user_id]',
        'university_name' => 'required|min_length[3]|max_length[200]',
        'gender'          => 'required|in_list[Male,Female,Other]',
        'year_joined'     => 'required|integer|greater_than[1900]|less_than_equal_to[' . date('Y') . ']'
    ];

    protected $validationMessages   = [
        'user_id' => [
            'required'             => 'User ID is required',
            'is_natural_no_zero'   => 'User ID must be a valid number',
            'is_unique'            => 'Teacher profile already exists for this user'
        ],
        'university_name' => [
            'required'   => 'University name is required',
            'min_length' => 'University name must be at least 3 characters',
            'max_length' => 'University name cannot exceed 200 characters'
        ],
        'gender' => [
            'required' => 'Gender is required',
            'in_list'  => 'Gender must be Male, Female, or Other'
        ],
        'year_joined' => [
            'required'              => 'Year joined is required',
            'integer'               => 'Year joined must be a valid year',
            'greater_than'          => 'Year joined must be after 1900',
            'less_than_equal_to'    => 'Year joined cannot be in the future'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;

    /**
     * Get teacher with user details
     */
    public function getTeacherWithUser($teacherId)
    {
        return $this->select('teachers.*, auth_user.first_name, auth_user.last_name, auth_user.email')
                   ->join('auth_user', 'auth_user.id = teachers.user_id')
                   ->where('teachers.id', $teacherId)
                   ->first();
    }

    /**
     * Get all teachers with user details
     */
    public function getAllTeachersWithUser()
    {
        return $this->select('teachers.*, auth_user.first_name, auth_user.last_name, auth_user.email')
                   ->join('auth_user', 'auth_user.id = teachers.user_id')
                   ->orderBy('teachers.created_at', 'DESC')
                   ->findAll();
    }

    /**
     * Get teacher by user_id
     */
    public function getTeacherByUserId($userId)
    {
        return $this->where('user_id', $userId)->first();
    }

    /**
     * Search teachers
     */
    public function searchTeachers($searchTerm)
    {
        return $this->select('teachers.*, auth_user.first_name, auth_user.last_name, auth_user.email')
                   ->join('auth_user', 'auth_user.id = teachers.user_id')
                   ->groupStart()
                       ->like('auth_user.first_name', $searchTerm)
                       ->orLike('auth_user.last_name', $searchTerm)
                       ->orLike('auth_user.email', $searchTerm)
                       ->orLike('teachers.university_name', $searchTerm)
                       ->orLike('teachers.department', $searchTerm)
                   ->groupEnd()
                   ->orderBy('teachers.created_at', 'DESC')
                   ->findAll();
    }
}

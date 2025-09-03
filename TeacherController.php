<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\TeacherModel;
use App\Models\AuthUserModel;

class TeacherController extends ResourceController
{
    use ResponseTrait;

    protected $teacherModel;
    protected $authUserModel;

    public function __construct()
    {
        $this->teacherModel = new TeacherModel();
        $this->authUserModel = new AuthUserModel();
    }

    /**
     * Get all teachers
     */
    public function index()
    {
        try {
            $teachers = $this->teacherModel->getAllTeachersWithUser();

            return $this->respond([
                'status' => 'success',
                'data' => $teachers,
                'count' => count($teachers)
            ], 200);

        } catch (\Exception $e) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Failed to retrieve teachers: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific teacher
     */
    public function show($id = null)
    {
        if (!$id) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Teacher ID is required'
            ], 400);
        }

        try {
            $teacher = $this->teacherModel->getTeacherWithUser($id);

            if (!$teacher) {
                return $this->fail([
                    'status' => 'error',
                    'message' => 'Teacher not found'
                ], 404);
            }

            return $this->respond([
                'status' => 'success',
                'data' => $teacher
            ], 200);

        } catch (\Exception $e) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Failed to retrieve teacher: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update teacher profile
     */
    public function update($id = null)
    {
        if (!$id) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Teacher ID is required'
            ], 400);
        }

        $rules = [
            'university_name' => 'required|min_length[3]|max_length[200]',
            'gender'          => 'required|in_list[Male,Female,Other]',
            'year_joined'     => 'required|integer|greater_than[1900]|less_than_equal_to[' . date('Y') . ']',
            'department'      => 'permit_empty|max_length[100]',
            'qualification'   => 'permit_empty|max_length[100]',
            'experience_years'=> 'permit_empty|integer',
            'specialization'  => 'permit_empty|max_length[500]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $this->validator->getErrors()
            ], 400);
        }

        try {
            $data = $this->request->getJSON(true);

            // Check if teacher exists
            $teacher = $this->teacherModel->find($id);
            if (!$teacher) {
                return $this->fail([
                    'status' => 'error',
                    'message' => 'Teacher not found'
                ], 404);
            }

            // Update teacher data
            $updateData = [
                'university_name'  => $data['university_name'],
                'gender'           => $data['gender'],
                'year_joined'      => $data['year_joined'],
                'department'       => $data['department'] ?? null,
                'qualification'    => $data['qualification'] ?? null,
                'experience_years' => $data['experience_years'] ?? 0,
                'specialization'   => $data['specialization'] ?? null
            ];

            if (!$this->teacherModel->update($id, $updateData)) {
                return $this->fail([
                    'status' => 'error',
                    'message' => 'Failed to update teacher',
                    'errors' => $this->teacherModel->errors()
                ], 500);
            }

            // Get updated teacher data
            $updatedTeacher = $this->teacherModel->getTeacherWithUser($id);

            return $this->respond([
                'status' => 'success',
                'message' => 'Teacher updated successfully',
                'data' => $updatedTeacher
            ], 200);

        } catch (\Exception $e) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Failed to update teacher: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search teachers
     */
    public function search()
    {
        $searchTerm = $this->request->getGet('q');

        if (!$searchTerm) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Search term is required'
            ], 400);
        }

        try {
            $teachers = $this->teacherModel->searchTeachers($searchTerm);

            return $this->respond([
                'status' => 'success',
                'data' => $teachers,
                'count' => count($teachers),
                'search_term' => $searchTerm
            ], 200);

        } catch (\Exception $e) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Search failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete teacher (soft delete by deactivating user)
     */
    public function delete($id = null)
    {
        if (!$id) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Teacher ID is required'
            ], 400);
        }

        try {
            $teacher = $this->teacherModel->find($id);
            if (!$teacher) {
                return $this->fail([
                    'status' => 'error',
                    'message' => 'Teacher not found'
                ], 404);
            }

            // Deactivate the user instead of deleting
            $this->authUserModel->update($teacher['user_id'], ['is_active' => 0]);

            return $this->respond([
                'status' => 'success',
                'message' => 'Teacher deactivated successfully'
            ], 200);

        } catch (\Exception $e) {
            return $this->fail([
                'status' => 'error',
                'message' => 'Failed to deactivate teacher: ' . $e->getMessage()
            ], 500);
        }
    }
}

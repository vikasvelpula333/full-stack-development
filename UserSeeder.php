<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use App\Models\AuthUserModel;
use App\Models\TeacherModel;

class UserSeeder extends Seeder
{
    public function run()
    {
        $authUserModel = new AuthUserModel();
        $teacherModel = new TeacherModel();

        // Sample users and teachers data
        $usersData = [
            [
                'user' => [
                    'email' => 'john.doe@university.edu',
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'password' => 'password123'
                ],
                'teacher' => [
                    'university_name' => 'Stanford University',
                    'gender' => 'Male',
                    'year_joined' => 2018,
                    'department' => 'Computer Science',
                    'qualification' => 'PhD in Computer Science',
                    'experience_years' => 8,
                    'specialization' => 'Machine Learning, Data Structures'
                ]
            ],
            [
                'user' => [
                    'email' => 'jane.smith@university.edu',
                    'first_name' => 'Jane',
                    'last_name' => 'Smith',
                    'password' => 'password123'
                ],
                'teacher' => [
                    'university_name' => 'MIT',
                    'gender' => 'Female',
                    'year_joined' => 2020,
                    'department' => 'Mathematics',
                    'qualification' => 'PhD in Applied Mathematics',
                    'experience_years' => 5,
                    'specialization' => 'Statistics, Calculus, Linear Algebra'
                ]
            ],
            [
                'user' => [
                    'email' => 'alice.johnson@university.edu',
                    'first_name' => 'Alice',
                    'last_name' => 'Johnson',
                    'password' => 'password123'
                ],
                'teacher' => [
                    'university_name' => 'Harvard University',
                    'gender' => 'Female',
                    'year_joined' => 2015,
                    'department' => 'Physics',
                    'qualification' => 'PhD in Theoretical Physics',
                    'experience_years' => 12,
                    'specialization' => 'Quantum Mechanics, Thermodynamics'
                ]
            ]
        ];

        foreach ($usersData as $data) {
            // Create user
            $userId = $authUserModel->insert($data['user']);

            if ($userId) {
                // Create teacher profile
                $data['teacher']['user_id'] = $userId;
                $teacherModel->insert($data['teacher']);

                echo "Created user: " . $data['user']['email'] . "\n";
            }
        }
    }
}

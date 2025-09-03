-- Teacher Authentication System Database Schema
-- PostgreSQL Version
-- Created: 2024-01-15

-- Create database (run this separately as superuser)
-- CREATE DATABASE teacher_auth_db;

-- Connect to the database
-- \c teacher_auth_db;

-- Create auth_user table
CREATE TABLE IF NOT EXISTS auth_user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active SMALLINT DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on email
CREATE UNIQUE INDEX idx_auth_user_email ON auth_user(email);

-- Create index on created_at for performance
CREATE INDEX idx_auth_user_created_at ON auth_user(created_at);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    university_name VARCHAR(200) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    year_joined INTEGER NOT NULL CHECK (year_joined >= 1900 AND year_joined <= EXTRACT(YEAR FROM CURRENT_DATE)),
    department VARCHAR(100),
    qualification VARCHAR(100),
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    specialization TEXT,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_teachers_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES auth_user(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Create unique index on user_id
CREATE UNIQUE INDEX idx_teachers_user_id ON teachers(user_id);

-- Create indexes for performance
CREATE INDEX idx_teachers_university_name ON teachers(university_name);
CREATE INDEX idx_teachers_created_at ON teachers(created_at);

-- Create migration tracking table (CodeIgniter 4)
CREATE TABLE IF NOT EXISTS migrations (
    id BIGSERIAL PRIMARY KEY,
    version VARCHAR(255) NOT NULL,
    class VARCHAR(255) NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    namespace VARCHAR(255) NOT NULL,
    time INTEGER NOT NULL,
    batch INTEGER NOT NULL
);

-- Insert migration records
INSERT INTO migrations (version, class, group_name, namespace, time, batch) VALUES
('20241201120000', 'App\Database\Migrations\CreateAuthUserTable', 'default', 'App', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP), 1),
('20241201120001', 'App\Database\Migrations\CreateTeachersTable', 'default', 'App', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP), 1);

-- Sample data (for testing purposes)
-- Note: Passwords are hashed using PHP password_hash() function

-- Sample users
INSERT INTO auth_user (email, first_name, last_name, password, is_active) VALUES
('john.doe@stanford.edu', 'John', 'Doe', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1), -- password: password
('jane.smith@mit.edu', 'Jane', 'Smith', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1), -- password: password
('alice.johnson@harvard.edu', 'Alice', 'Johnson', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1); -- password: password

-- Sample teachers
INSERT INTO teachers (user_id, university_name, gender, year_joined, department, qualification, experience_years, specialization) VALUES
(1, 'Stanford University', 'Male', 2018, 'Computer Science', 'PhD in Computer Science', 8, 'Machine Learning, Data Structures, Algorithms'),
(2, 'MIT', 'Female', 2020, 'Mathematics', 'PhD in Applied Mathematics', 5, 'Statistics, Calculus, Linear Algebra'),
(3, 'Harvard University', 'Female', 2015, 'Physics', 'PhD in Theoretical Physics', 12, 'Quantum Mechanics, Thermodynamics, Nuclear Physics');

-- Create stored procedure for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_auth_user_updated_at 
    BEFORE UPDATE ON auth_user 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at 
    BEFORE UPDATE ON teachers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries

-- View for teachers with user information
CREATE VIEW teachers_with_users AS
SELECT 
    t.id,
    t.user_id,
    t.university_name,
    t.gender,
    t.year_joined,
    t.department,
    t.qualification,
    t.experience_years,
    t.specialization,
    t.created_at AS teacher_created_at,
    t.updated_at AS teacher_updated_at,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    EXTRACT(YEAR FROM CURRENT_DATE) - t.year_joined AS calculated_experience
FROM teachers t
JOIN auth_user u ON t.user_id = u.id
WHERE u.is_active = 1;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO teacher_auth_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO teacher_auth_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO teacher_auth_user;

-- Comments for documentation
COMMENT ON TABLE auth_user IS 'User authentication table with basic user information';
COMMENT ON TABLE teachers IS 'Teacher profile information linked to auth_user';
COMMENT ON COLUMN auth_user.email IS 'Unique email address for login';
COMMENT ON COLUMN auth_user.password IS 'Hashed password using PHP password_hash()';
COMMENT ON COLUMN auth_user.is_active IS 'User status: 1=active, 0=inactive';
COMMENT ON COLUMN teachers.user_id IS 'Foreign key reference to auth_user.id';
COMMENT ON COLUMN teachers.year_joined IS 'Year the teacher joined their institution';
COMMENT ON COLUMN teachers.experience_years IS 'Years of teaching experience';

-- Performance optimization
ANALYZE auth_user;
ANALYZE teachers;

-- Show table information
SELECT 
    schemaname,
    tablename,
    attname,
    typename,
    attnotnull,
    atthasdef
FROM pg_catalog.pg_tables t
JOIN pg_catalog.pg_attribute a ON a.attrelid = t.tablename::regclass
JOIN pg_catalog.pg_type ty ON ty.oid = a.atttypid
WHERE schemaname = 'public' 
  AND tablename IN ('auth_user', 'teachers')
  AND attnum > 0
  AND NOT attisdropped
ORDER BY tablename, attnum;

-- For MySQL users, here's the equivalent schema:
/*
-- MySQL Version

CREATE DATABASE IF NOT EXISTS teacher_auth_db;
USE teacher_auth_db;

CREATE TABLE auth_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    university_name VARCHAR(200) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    year_joined YEAR NOT NULL,
    department VARCHAR(100) NULL,
    qualification VARCHAR(100) NULL,
    experience_years INT DEFAULT 0 CHECK (experience_years >= 0),
    specialization TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_university_name (university_name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Migration tracking table
CREATE TABLE migrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(255) NOT NULL,
    class VARCHAR(255) NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    namespace VARCHAR(255) NOT NULL,
    time INT NOT NULL,
    batch INT NOT NULL
) ENGINE=InnoDB;
*/

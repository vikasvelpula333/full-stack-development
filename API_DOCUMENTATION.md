# API Documentation

This document provides comprehensive documentation for the Teacher Authentication System API.

## Base URL
```
http://localhost:8080/api
```

## Authentication

The API uses **JWT (JSON Web Token)** for authentication. After successful login/registration, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {...}
}
```

### Error Response
```json
{
  "status": "error", 
  "message": "Error description",
  "errors": {...}
}
```

## Endpoints

### 1. Authentication Endpoints

#### Register User
Register a new user with teacher profile.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "john.doe@university.edu",
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123",
  "university_name": "Stanford University",
  "gender": "Male",
  "year_joined": 2020,
  "department": "Computer Science",
  "qualification": "PhD in Computer Science"
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "user_id": 1,
    "teacher_id": 1,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "email": "john.doe@university.edu",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

**Validation Rules**:
- `email`: Required, valid email format, unique
- `first_name`: Required, 2-50 characters, alphabetic
- `last_name`: Required, 2-50 characters, alphabetic  
- `password`: Required, minimum 6 characters
- `university_name`: Required, 3-200 characters
- `gender`: Required, must be "Male", "Female", or "Other"
- `year_joined`: Required, integer between 1900 and current year
- `department`: Optional, max 100 characters
- `qualification`: Optional, max 100 characters

#### Login User
Authenticate existing user and get JWT token.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john.doe@university.edu",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "email": "john.doe@university.edu",
      "first_name": "John",
      "last_name": "Doe"
    },
    "teacher": {
      "id": 1,
      "user_id": 1,
      "university_name": "Stanford University",
      "gender": "Male",
      "year_joined": 2020,
      "department": "Computer Science",
      "qualification": "PhD in Computer Science"
    }
  }
}
```

#### Logout User
Logout user (mainly for frontend token cleanup).

**Endpoint**: `POST /api/auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

### 2. User Profile Endpoints

#### Get User Profile
Get authenticated user's profile with teacher information.

**Endpoint**: `GET /api/profile`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "email": "john.doe@university.edu",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "university_name": "Stanford University",
    "gender": "Male",
    "year_joined": 2020,
    "department": "Computer Science",
    "qualification": "PhD in Computer Science"
  }
}
```

### 3. Teacher Management Endpoints

#### Get All Teachers
Retrieve list of all teachers with user information.

**Endpoint**: `GET /api/teachers`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "university_name": "Stanford University",
      "gender": "Male",
      "year_joined": 2020,
      "department": "Computer Science",
      "qualification": "PhD in Computer Science",
      "experience_years": 8,
      "specialization": "Machine Learning, Data Structures",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@university.edu"
    }
  ],
  "count": 1
}
```

#### Get Specific Teacher
Retrieve details of a specific teacher.

**Endpoint**: `GET /api/teachers/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "user_id": 1,
    "university_name": "Stanford University",
    "gender": "Male",
    "year_joined": 2020,
    "department": "Computer Science",
    "qualification": "PhD in Computer Science",
    "experience_years": 8,
    "specialization": "Machine Learning, Data Structures",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@university.edu"
  }
}
```

#### Update Teacher
Update teacher information.

**Endpoint**: `PUT /api/teachers/{id}`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "university_name": "MIT",
  "gender": "Male",
  "year_joined": 2020,
  "department": "Computer Science",
  "qualification": "PhD in Computer Science",
  "experience_years": 8,
  "specialization": "Machine Learning, Artificial Intelligence"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Teacher updated successfully",
  "data": {
    "id": 1,
    "university_name": "MIT",
    "gender": "Male",
    "year_joined": 2020,
    "department": "Computer Science",
    "qualification": "PhD in Computer Science",
    "experience_years": 8,
    "specialization": "Machine Learning, Artificial Intelligence",
    "updated_at": "2024-01-16T11:45:00Z",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@university.edu"
  }
}
```

#### Search Teachers
Search teachers by name, email, university, or department.

**Endpoint**: `GET /api/teachers/search?q={search_term}`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `q`: Search term (required)

**Example**: `GET /api/teachers/search?q=computer`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "university_name": "Stanford University",
      "department": "Computer Science",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@university.edu"
    }
  ],
  "count": 1,
  "search_term": "computer"
}
```

#### Delete Teacher
Deactivate a teacher (soft delete - sets user as inactive).

**Endpoint**: `DELETE /api/teachers/{id}`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Teacher deactivated successfully"
}
```

### 4. Utility Endpoints

#### Health Check
Check API health status.

**Endpoint**: `GET /api/health`

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "API is running",
  "timestamp": "2024-01-15T15:30:45Z"
}
```

## Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created (successful registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Common Error Responses

#### Validation Error (400)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

#### Authentication Error (401)
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

#### Not Found Error (404)
```json
{
  "status": "error",
  "message": "Teacher not found"
}
```

#### Server Error (500)
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## JWT Token Structure

### Token Payload
```json
{
  "user_id": 1,
  "email": "john.doe@university.edu",
  "iat": 1705322645,
  "exp": 1705326245
}
```

### Token Expiration
- Default: 3600 seconds (1 hour)
- Configurable via `JWT_TIME_TO_LIVE` environment variable

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production:
- Registration: 5 attempts per IP per hour
- Login: 10 attempts per IP per hour
- API calls: 1000 requests per authenticated user per hour

## CORS Configuration

The API supports CORS for frontend integration:
- Allowed Origins: Configurable via `CORS_ALLOWED_ORIGINS`
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Headers: Content-Type, Authorization, X-Requested-With

## Code Examples

### JavaScript/Axios Examples

#### Register User
```javascript
import axios from 'axios';

const register = async (userData) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    const { token } = response.data.data;

    // Store token
    localStorage.setItem('auth_token', token);

    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response.data);
    throw error;
  }
};
```

#### Make Authenticated Request
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get teachers
const getTeachers = async () => {
  try {
    const response = await api.get('/teachers');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    throw error;
  }
};
```

### cURL Examples

#### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@university.edu",
    "first_name": "Jane",
    "last_name": "Smith",
    "password": "securepass123",
    "university_name": "MIT",
    "gender": "Female",
    "year_joined": 2019
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@university.edu",
    "password": "securepass123"
  }'
```

#### Get Teachers (with token)
```bash
curl -X GET http://localhost:8080/api/teachers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Testing

### Postman Collection
A Postman collection is available with all endpoints pre-configured. Import the collection and set the following variables:
- `base_url`: http://localhost:8080/api
- `jwt_token`: Your JWT token (obtained from login)

### Automated Testing
Run the backend test suite:
```bash
cd backend
php spark test
```

## Changelog

### Version 1.0.0
- Initial API release
- JWT authentication
- User registration and login
- Teacher CRUD operations
- Search functionality

---

**API Version**: 1.0.0  
**Last Updated**: January 2024  
**Contact**: support@example.com

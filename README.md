# Teacher Authentication System

A comprehensive full-stack authentication system built with **CodeIgniter 4** (Backend) and **React.js** (Frontend), featuring JWT-based authentication and teacher profile management.

## 🚀 Features

### Backend (CodeIgniter 4)
- **JWT Authentication** - Secure token-based authentication
- **RESTful API** - Clean and well-structured API endpoints
- **Database Migrations** - Version-controlled database schema
- **CORS Support** - Cross-origin resource sharing enabled
- **Input Validation** - Server-side form validation
- **Password Hashing** - Secure password storage using bcrypt
- **Database Relationships** - 1:1 relationship between users and teachers

### Frontend (React.js)
- **Modern React** - Built with React 18 and functional components
- **JWT Integration** - Seamless token-based authentication
- **Protected Routes** - Route-level authentication guards
- **Responsive Design** - Mobile-first Bootstrap 5 UI
- **DataTables** - Advanced teacher management interface
- **Form Validation** - Client-side form validation
- **Context API** - Global state management for authentication

## 🛠️ Technology Stack

### Backend
- **PHP 8.1+**
- **CodeIgniter 4.4+**
- **PostgreSQL** (Primary) / **MySQL** (Alternative)
- **Firebase JWT** for token management
- **Composer** for dependency management

### Frontend
- **React 18**
- **React Router 6** for navigation
- **Bootstrap 5** for styling
- **Axios** for HTTP requests
- **React Toastify** for notifications

## 📋 Database Schema

### Tables

#### `auth_user`
- `id` (Primary Key)
- `email` (Unique)
- `first_name`
- `last_name`
- `password` (Hashed)
- `is_active`
- `created_at`
- `updated_at`

#### `teachers`
- `id` (Primary Key)
- `user_id` (Foreign Key → auth_user.id)
- `university_name`
- `gender`
- `year_joined`
- `department` (Optional)
- `qualification` (Optional)
- `experience_years` (Optional)
- `specialization` (Optional)
- `created_at`
- `updated_at`

## 🚀 Quick Start

### Prerequisites

- PHP 8.1 or higher
- Node.js 16+ and npm
- PostgreSQL 12+ or MySQL 8+
- Composer
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd teacher-auth-app/backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

4. **Setup database**
   ```bash
   # Create database
   createdb teacher_auth_db  # For PostgreSQL
   # OR create database in MySQL

   # Run migrations
   php spark migrate

   # Seed sample data (optional)
   php spark db:seed UserSeeder
   ```

5. **Start the server**
   ```bash
   php spark serve
   # Backend will run on http://localhost:8080
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   # Frontend will run on http://localhost:3000
   ```

## 🔗 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Protected Routes (Require JWT Token)
- `GET /api/profile` - Get user profile
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/{id}` - Get specific teacher
- `PUT /api/teachers/{id}` - Update teacher
- `DELETE /api/teachers/{id}` - Deactivate teacher
- `GET /api/teachers/search` - Search teachers

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication Flow

1. **User Registration**: User registers with personal and teacher information
2. **JWT Generation**: System generates JWT token upon successful registration/login
3. **Token Storage**: Frontend stores JWT in localStorage
4. **API Requests**: All protected API requests include JWT in Authorization header
5. **Token Validation**: Backend validates JWT on each protected endpoint

## 📁 Project Structure

```
teacher-auth-app/
├── backend/                    # CodeIgniter 4 Backend
│   ├── app/
│   │   ├── Config/            # Configuration files
│   │   ├── Controllers/       # API Controllers
│   │   ├── Database/          # Migrations & Seeds
│   │   ├── Filters/           # Middleware (CORS, JWT)
│   │   └── Models/            # Data Models
│   ├── public/                # Web root
│   └── vendor/                # Composer dependencies
├── frontend/                   # React Frontend
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   └── package.json
├── database/                   # Database exports
├── docs/                      # Documentation
└── README.md
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
php spark test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Upload files to server
2. Install dependencies: `composer install --no-dev`
3. Set environment to production in `.env`
4. Configure web server (Apache/Nginx)
5. Run migrations: `php spark migrate --env=production`

### Frontend Deployment
1. Build for production: `npm run build`
2. Upload `build/` folder contents to web server
3. Configure web server for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- CodeIgniter community for the excellent framework
- React team for the amazing library
- Bootstrap team for the UI components
- Firebase team for JWT implementation

# Setup Instructions

This document provides detailed step-by-step instructions for setting up the Teacher Authentication System.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **PHP 8.1 or higher** with extensions:
  - `php-json`
  - `php-mbstring`
  - `php-xml`
  - `php-pgsql` (for PostgreSQL) or `php-mysqli` (for MySQL)
  - `php-intl`
  - `php-curl`
- **Node.js 16+** and **npm**
- **PostgreSQL 12+** or **MySQL 8+**
- **Composer** (PHP dependency manager)
- **Git** (version control)

### Optional but Recommended
- **PostgreSQL/MySQL GUI client** (pgAdmin, phpMyAdmin, etc.)
- **Postman** or similar API testing tool
- **VS Code** or your preferred code editor

## Step 1: Environment Setup

### 1.1 Clone the Repository
```bash
git clone <repository-url>
cd teacher-auth-app
```

### 1.2 Verify PHP Installation
```bash
php --version
php -m | grep -E "(json|mbstring|xml|pgsql|mysqli|intl|curl)"
```

### 1.3 Verify Node.js Installation
```bash
node --version
npm --version
```

## Step 2: Database Setup

### Option A: PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql

   # Windows: Download from https://www.postgresql.org/download/
   ```

2. **Create Database and User**:
   ```bash
   # Switch to postgres user
   sudo -u postgres psql

   # Create database
   CREATE DATABASE teacher_auth_db;

   # Create user (optional, you can use postgres user)
   CREATE USER teacher_auth_user WITH PASSWORD 'your_password';

   # Grant permissions
   GRANT ALL PRIVILEGES ON DATABASE teacher_auth_db TO teacher_auth_user;

   # Exit
   \q
   ```

### Option B: MySQL Setup

1. **Install MySQL** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server

   # macOS (using Homebrew)
   brew install mysql
   brew services start mysql

   # Windows: Download from https://dev.mysql.com/downloads/mysql/
   ```

2. **Create Database and User**:
   ```bash
   # Login to MySQL
   mysql -u root -p

   # Create database
   CREATE DATABASE teacher_auth_db;

   # Create user (optional)
   CREATE USER 'teacher_auth_user'@'localhost' IDENTIFIED BY 'your_password';

   # Grant permissions
   GRANT ALL PRIVILEGES ON teacher_auth_db.* TO 'teacher_auth_user'@'localhost';
   FLUSH PRIVILEGES;

   # Exit
   EXIT;
   ```

## Step 3: Backend Setup (CodeIgniter 4)

### 3.1 Navigate to Backend Directory
```bash
cd backend
```

### 3.2 Install PHP Dependencies
```bash
composer install
```

### 3.3 Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

### 3.4 Configure Environment Variables

Edit the `.env` file with your settings:

```ini
#--------------------------------------------------------------------
# ENVIRONMENT
#--------------------------------------------------------------------
CI_ENVIRONMENT = development

#--------------------------------------------------------------------
# APP
#--------------------------------------------------------------------
app.baseURL = 'http://localhost:8080/'

#--------------------------------------------------------------------
# DATABASE (PostgreSQL)
#--------------------------------------------------------------------
database.default.hostname = localhost
database.default.database = teacher_auth_db
database.default.username = postgres
database.default.password = your_password
database.default.DBDriver = Postgre
database.default.port = 5432

# OR for MySQL, uncomment these lines:
# database.default.hostname = localhost
# database.default.database = teacher_auth_db
# database.default.username = root
# database.default.password = your_password
# database.default.DBDriver = MySQLi
# database.default.port = 3306

#--------------------------------------------------------------------
# JWT CONFIGURATION
#--------------------------------------------------------------------
JWT_SECRET_KEY = your-super-secret-jwt-key-change-this-in-production
JWT_TIME_TO_LIVE = 3600

#--------------------------------------------------------------------
# CORS CONFIGURATION
#--------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = http://localhost:3000,http://127.0.0.1:3000
```

### 3.5 Generate Secure JWT Secret
```bash
# Generate a random JWT secret key (Linux/macOS)
openssl rand -base64 32

# Or use online generator: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### 3.6 Run Database Migrations
```bash
# Run migrations to create tables
php spark migrate

# Verify migrations were successful
php spark migrate:status
```

### 3.7 Seed Sample Data (Optional)
```bash
# Add sample data for testing
php spark db:seed UserSeeder
```

### 3.8 Test Backend Server
```bash
# Start development server
php spark serve

# You should see:
# CodeIgniter development server started on http://localhost:8080
```

### 3.9 Verify Backend API
Open your browser or Postman and test:
- `GET http://localhost:8080/api/health` (should return JSON response)

## Step 4: Frontend Setup (React)

### 4.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

### 4.2 Install Node.js Dependencies
```bash
npm install
```

### 4.3 Environment Configuration (Optional)
```bash
# Create environment file if you need custom API URL
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
```

### 4.4 Start Development Server
```bash
npm start
```

The React app will start on `http://localhost:3000` and automatically open in your browser.

## Step 5: Testing the Application

### 5.1 Register a New User
1. Go to `http://localhost:3000/register`
2. Fill out the registration form
3. Submit and verify successful registration

### 5.2 Login
1. Go to `http://localhost:3000/login`
2. Use the credentials you just registered
3. Verify successful login and redirect to dashboard

### 5.3 Test API Endpoints
Use Postman or curl to test API endpoints:

```bash
# Health check
curl -X GET http://localhost:8080/api/health

# Register (example)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "password123",
    "university_name": "Test University",
    "gender": "Male",
    "year_joined": 2020
  }'

# Login (example)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Step 6: Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Issue**: `Class 'Firebase\JWT\JWT' not found`
```bash
# Solution: Install JWT library
composer require firebase/php-jwt:^6.4
```

**Issue**: Database connection failed
```bash
# Check database credentials in .env
# Verify database server is running
sudo systemctl status postgresql  # For PostgreSQL
sudo systemctl status mysql      # For MySQL
```

**Issue**: Permission denied on logs/cache folders
```bash
# Fix writable permissions
chmod -R 755 writable/
```

#### Frontend Issues

**Issue**: `Module not found` errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: CORS errors
- Verify `CORS_ALLOWED_ORIGINS` in backend `.env` includes frontend URL
- Check if backend server is running

**Issue**: API calls fail
- Verify backend is running on correct port
- Check browser developer console for errors
- Verify JWT token is being sent in requests

### Debug Mode

#### Enable Backend Debug Mode
In `.env` file:
```ini
CI_ENVIRONMENT = development
```

#### Enable Frontend Debug Mode
```bash
# Set NODE_ENV to development (default in dev)
export NODE_ENV=development
npm start
```

## Step 7: Production Deployment

### Backend Production Setup
1. Set `CI_ENVIRONMENT = production` in `.env`
2. Use production database credentials
3. Set secure JWT secret key
4. Configure web server (Apache/Nginx)
5. Enable SSL/HTTPS
6. Set proper file permissions

### Frontend Production Build
```bash
# Create production build
npm run build

# Deploy build/ folder contents to web server
```

## Step 8: Additional Configuration

### SSL/HTTPS Setup
For production environments, configure SSL certificates and update:
- Backend `.env`: Update `app.baseURL` to use HTTPS
- Frontend: Update API URL to use HTTPS

### Performance Optimization
- Enable PHP OPcache
- Configure database connection pooling
- Use CDN for frontend assets
- Enable gzip compression

### Security Enhancements
- Change default JWT secret
- Implement rate limiting
- Add input sanitization
- Enable CSRF protection for forms
- Regular security updates

## Support

If you encounter issues not covered in this guide:

1. Check the logs:
   - Backend: `backend/writable/logs/`
   - Frontend: Browser developer console

2. Review the API documentation
3. Create an issue in the project repository

---

**Need Help?**
- 📧 Email: support@example.com
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/teacher-auth-system/issues)

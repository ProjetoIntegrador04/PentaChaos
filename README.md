# SGE App - Sistema de Gestão Empresarial

A Spring Boot backend application with JWT-based authentication, PostgreSQL database, and Docker containerization.

## 🚀 Quick Start

### Prerequisites

- Docker installed
- Git (to clone the repository)

### Environment Setup

**Yes, you need to create a `.env` file** before running the application. This file contains sensitive configuration data that should not be committed to version control.

1. **Create the `.env` file** in the project root directory:

```bash
# Database Configuration
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

# JWT Configuration
JWT_SECRET_KEY=
JWT_EXPIRATION=
JWT_REFRESH_EXPIRATION=
```

2. **Run the application**:

```bash
docker compose up --build -d
```

The application will be available at:
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 🔐 Authentication System

This application implements a robust JWT-based authentication system with the following features:

### Authentication Endpoints

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|------------------------|
| `/auth/register` | POST | Register a new user | No |
| `/auth/login` | POST | Login with username/email and password | No |
| `/auth/refresh` | POST | Refresh access token using refresh token | No |

### Authentication Flow

1. **User Registration**: Users can register with username, email, and password
2. **User Login**: Users can login with either username or email
3. **JWT Token Generation**: Upon successful login, the system returns:
   - Access Token (expires in 24 hours)
   - Refresh Token (expires in 7 days)
   - Token expiration time

### Request/Response Examples

#### User Registration
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "enabled": true,
  "roles": []
}
```

#### User Login
```bash
POST /auth/login
Content-Type: application/json

{
  "usernameOrEmail": "johndoe",  // Can be username or email
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

#### Token Refresh
```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

### Using the Access Token

Include the access token in the `Authorization` header for protected endpoints:

```bash
GET /api/protected-endpoint
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## 🏗️ Architecture

### Technology Stack

- **Backend**: Spring Boot 3.5.6
- **Java Version**: 21
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security 6
- **Containerization**: Docker & Docker Compose
- **Build Tool**: Maven

### Project Structure

```
src/
├── main/
│   ├── java/com/sge/sge_app/
│   │   ├── config/           # Configuration classes
│   │   │   ├── SecurityConfig.java
│   │   │   └── ModelMapperConfig.java
│   │   ├── controller/       # REST Controllers
│   │   │   └── AuthController.java
│   │   ├── domain/model/     # JPA Entities
│   │   │   ├── User.java
│   │   │   └── Role.java
│   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── security/         # Security components
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── CustomUserDetailsService.java
│   │   └── services/         # Business logic
│   └── resources/
│       └── application.properties
```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables (defined in `.env`):

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `POSTGRES_DB` | Database name | `sge_app_db` |
| `POSTGRES_USER` | Database username | `admin_sge` |
| `POSTGRES_PASSWORD` | Database password | `mysecretpassword` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | `i0o++I7jThwmozMy2cNjH+HeC6d6LBqKkoPbi3yYIfA=` |
| `JWT_EXPIRATION` | Access token expiration (ms) | `86400000` (24 hours) |
| `JWT_REFRESH_EXPIRATION` | Refresh token expiration (ms) | `604800000` (7 days) |

### Database Configuration

The application automatically creates the database schema using Hibernate DDL auto-update. The database connection is configured through environment variables in the Docker Compose file.

### CORS Configuration

The application is configured to accept requests from:
- `http://localhost:5173` (Vite development server)
- `http://localhost:3000` (React development server)

## 🐳 Docker Configuration

### Services

1. **Database Service** (`db`):
   - PostgreSQL 15 Alpine
   - Port: 5432
   - Persistent data storage

2. **Application Service** (`app`):
   - Spring Boot application
   - Port: 8080
   - Depends on database service

### Docker Commands

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker compose down -v
```

## 🔒 Security Features

### JWT Implementation

- **Algorithm**: HS512 (HMAC with SHA-512)
- **Access Token**: Short-lived (24 hours)
- **Refresh Token**: Long-lived (7 days)
- **Claims**: Username, roles, issued at, expiration

### Password Security

- Passwords are hashed using Spring Security's BCrypt
- Minimum password length: 6 characters
- Maximum password length: 100 characters

### User Management

- Users can be enabled/disabled
- Account lockout support
- Credential expiration support
- Role-based access control (RBAC)

## 🧪 Testing the Authentication

### Using curl

1. **Register a new user**:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }'
```

3. **Use the access token**:
```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚨 Troubleshooting

### Common Issues

1. **Application won't start**:
   - Ensure `.env` file exists with all required variables
   - Check if ports 8080 and 5432 are available
   - Verify Docker is running

2. **Database connection issues**:
   - Wait for database to fully initialize (may take 30-60 seconds)
   - Check database logs: `docker compose logs db`

3. **JWT token issues**:
   - Ensure JWT_SECRET_KEY is properly set
   - Check token expiration times
   - Verify token format in Authorization header

### Logs

```bash
# View application logs
docker compose logs app

# View database logs
docker compose logs db

# View all logs
docker compose logs
```

## 📝 Development

### Local Development

For local development without Docker:

1. Install Java 21 and Maven
2. Install PostgreSQL and create database
3. Update `application.properties` with local database settings
4. Run: `mvn spring-boot:run`

### Building the Application

```bash
# Build JAR file
mvn clean package

# Run tests
mvn test

# Skip tests during build
mvn clean package -DskipTests
```

## 📚 API Documentation

The application provides RESTful APIs for:

- **Authentication**: User registration, login, token refresh
- **User Management**: User CRUD operations
- **Card Management**: Card operations (if implemented)
- **Clock Entry**: Time tracking (if implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: Remember to keep your `.env` file secure and never commit it to version control. The provided JWT secret key is for development purposes only. Generate a new secure key for production use.


## Documentação:

1. [Padrões de Commits](/docs/commit-pattern.md)
2. [Gerenciamento de Branches](/docs/branch-management.md)
3. [Ferramentas e Dependências](/docs/tools-and-dependencies.md)
4. [Documento de Visão](/docs/vision-document.md)
5. [Documento de Visão Resumido](/docs/summary-vision-document-template.md)
6. [Documento de Requisitos do Produto (PRD)](/docs/prd.md)
7. [Guia de Configuração do Ambiente de Desenvolvimento - SGE](/docs/initial-setup-guide.md)
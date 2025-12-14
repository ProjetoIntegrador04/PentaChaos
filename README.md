# 🎯 PentaChaos - Sistema de Gestão Empresarial# 🎯 PentaChaos - Sistema de Gestão Empresarial



> Sistema completo de gestão de equipes ágeis com controle de ponto por geolocalização, gerenciamento de squads, tarefas e notificações em tempo real.Sistema completo de gestão empresarial com controle de pontos, squads, tarefas e usuários. Desenvolvido com Spring Boot (backend), React (frontend web), React Native/Expo (mobile) e PostgreSQL.



[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)## 🚀 Iniciar o Projeto (Docker)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

[![React Native](https://img.shields.io/badge/React%20Native-0.81-purple.svg)](https://reactnative.dev/)### Pré-requisitos

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)- **Docker** e **Docker Compose** instalados

- Portas disponíveis: 3000, 8080, 8081, 5432

---

### Comando Único

## 📋 Sobre o Projeto

```bash

**PentaChaos** é uma solução integrada para gestão de equipes ágeis, desenvolvida como Projeto Integrador IV do SENAI. O sistema permite:docker compose up -d

```

- ⏰ **Controle de Ponto** com geolocalização GPS

- 👥 **Gestão de Squads** e equipes**Pronto!** O sistema estará disponível em:

- ✅ **Gerenciamento de Tarefas** com prioridades

- 🔔 **Notificações Push** em tempo real| Serviço | URL | Descrição |

- 📊 **Dashboard** com métricas e KPIs|---------|-----|-----------|

- 🔐 **Autenticação JWT** segura| 🌐 **Frontend Web** | http://localhost:3000 | Interface web (coordenadores) |

- 📱 **Multi-plataforma** (Web + Mobile)| 📱 **Mobile App** | http://localhost:8081 | App mobile (membros) |

| 🔧 **Backend API** | http://localhost:8080 | API REST |

### 🏆 Projeto SAGA SENAI de Inovação| 🗄️ **PostgreSQL** | localhost:5432 | Banco de dados |



Este projeto faz parte do programa [SAGA SENAI](https://gpinovacao.senai.br/), respondendo à demanda da indústria por soluções digitais de gestão.### Parar o Sistema



---```bash

docker compose down       # Para os containers

## 🚀 Quick Startdocker compose down -v    # Para + remove dados do banco

```

### Pré-requisitos

## 📦 Arquitetura do Sistema

- **Docker** e **Docker Compose** instalados

- Portas livres: `3000`, `8080`, `8081`, `5432````

pentachaos/

### Iniciar Sistema Completo├── backend/sge-app/          # Spring Boot 3.5 + Java 21

├── frontend/frontProject/     # React + Vite + TypeScript

```bash├── integrador-mobile/         # React Native + Expo

# Clone o repositório└── docker-compose.yml         # Orquestração completa

git clone https://github.com/ProjetoIntegrador04/PentaChaos.git```

cd PentaChaos

### Tecnologias

# Suba todos os serviços

docker compose up -d**Backend:**

- Spring Boot 3.5

# Aguarde ~30 segundos para inicialização- Spring Security + JWT

```- PostgreSQL 15

- Java 21

✅ **Pronto!** Acesse:

**Frontend Web:**

| Serviço | URL | Descrição |- React 18

|---------|-----|-----------|- Vite

| 🌐 **Frontend Web** | http://localhost:3000 | Dashboard coordenadores |- TypeScript

| 📱 **Mobile App** | http://localhost:8081 | App para membros |- TailwindCSS

| 🔧 **API Backend** | http://localhost:8080 | REST API |

| 📊 **API Docs** | http://localhost:8080/swagger-ui.html | Documentação OpenAPI |**Mobile:**

- React Native 0.81

### Parar Sistema- Expo SDK 54

- TypeScript

```bash- Expo Router

docker compose down       # Para containers

docker compose down -v    # Para + remove dados## 🔐 Autenticação

```

### Sistema JWT

---

- **Access Token**: 7 dias de validade

## 👥 Usuários de Teste- **Refresh Token**: 30 dias de validade

- **Armazenamento Seguro**: SecureStore (mobile) / LocalStorage (web)

| Email | Senha | Papel | Descrição |

|-------|-------|-------|-----------|### Usuários Padrão

| `eliezer@pentachaos.com.br` | `senha123` | **ADMIN** | Coordenador (acesso total) |

| `beatriz.alves@pentachaos.com.br` | `senha123` | **USER** | Membro de squad || Email | Senha | Papel | Acesso |

| `mariana.costa@pentachaos.com.br` | `senha123` | **USER** | Membro de squad ||-------|-------|-------|--------|

| eliezer@pentachaos.com.br | senha123 | ADMIN | Web + Mobile |

---| beatriz.alves@pentachaos.com.br | senha123 | USER | Mobile |

| mariana.costa@pentachaos.com.br | senha123 | USER | Mobile |

## 🏗️ Arquitetura

### Endpoints de Autenticação

### Stack Tecnológica

```bash

```POST /api/v1/auth/login         # Login (email/username + senha)

┌─────────────────────────────────────────────────────────┐POST /api/v1/auth/refresh       # Renovar token

│                    FRONTEND WEB                          │GET  /api/v1/users/me           # Dados do usuário logado

│              React 18 + Vite + TypeScript                │  "isAdmin": false

│                   Port: 3000 (Nginx)                     │}

└────────────────────┬────────────────────────────────────┘```

                     │

┌────────────────────┴────────────────────────────────────┐**Note:** 

│                   MOBILE APP                             │- Only `username`, `email`, and `password` are required. All other fields are optional.

│         React Native 0.81 + Expo SDK 54                  │- `isAdmin`: Set to `true` to create a user with ADMIN role (coordinator). Default is `false`.

│                   Port: 8081                             │- `squad`: Not defined during registration. Should be assigned later through user update endpoint.

└────────────────────┬────────────────────────────────────┘

                     │**Response:**

                     │ HTTP/REST + JWT```json

                     ▼{

┌─────────────────────────────────────────────────────────┐  "id": 1,

│                  BACKEND API                             │  "username": "johndoe",

│       Spring Boot 3.5 + Spring Security 6                │  "email": "john@example.com",

│                   Port: 8080                             │  "enabled": true,

└────────────────────┬────────────────────────────────────┘  "roles": []

                     │}

                     │ JDBC```

                     ▼

┌─────────────────────────────────────────────────────────┐**Authorization:** This endpoint requires an ADMIN role token in the Authorization header.

│                  DATABASE                                │

│             PostgreSQL 15-alpine                         │#### User Login

│                   Port: 5432                             │```bash

└─────────────────────────────────────────────────────────┘POST /auth/login

```Content-Type: application/json



### Estrutura do Projeto{

  "usernameOrEmail": "johndoe",  // Can be username or email

```  "password": "securepassword123"

PentaChaos/}

├── 📂 backend/sge-app/          # Spring Boot Backend```

│   ├── src/main/java/           # Código Java

│   ├── src/main/resources/      # Configurações**Response:**

│   ├── Dockerfile               # Container backend```json

│   └── pom.xml                  # Dependências Maven{

│  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",

├── 📂 frontend/frontProject/    # React Frontend  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",

│   ├── src/                     # Código React  "tokenType": "Bearer",

│   ├── Dockerfile               # Container frontend  "expiresIn": 86400000

│   └── package.json             # Dependências npm}

│```

├── 📂 integrador-mobile/        # React Native Mobile

│   ├── app/                     # Telas (Expo Router)#### Token Refresh

│   ├── components/              # Componentes reutilizáveis```bash

│   ├── services/                # API clientsPOST /auth/refresh

│   └── package.json             # Dependências npmContent-Type: application/json

│

├── 📂 docs/                     # Documentação{

│   ├── VISION.md               # Documento de Visão  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."

│   ├── prd.md                  # Product Requirements}

│   ├── branch-management.md    # Git workflow```

│   └── commit-pattern.md       # Padrões de commit

│**Response:**

└── docker-compose.yml          # Orquestração completa```json

```{

  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",

---  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",

  "tokenType": "Bearer",

## ✨ Funcionalidades Principais  "expiresIn": 86400000

}

### 🔐 Autenticação & Autorização```



- **JWT** com access token (7 dias) + refresh token (30 dias)### Using the Access Token

- **Spring Security 6** com filtros personalizados

- **Senhas criptografadas** com BCryptInclude the access token in the `Authorization` header for protected endpoints:

- **Controle de acesso** baseado em roles (ADMIN/USER)

```bash

### ⏰ Controle de PontoGET /api/protected-endpoint

Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...

- **Geolocalização GPS** para registro de entrada/saída```

- **Validação de horários** e regras de negócio

- **Histórico completo** de registros## 🏗️ Architecture

- **Dashboard** com frequência mensal

### Technology Stack

### 👥 Gestão de Squads

- **Backend**: Spring Boot 3.5.6

- **CRUD completo** de squads- **Java Version**: 21

- **Atribuição de membros** e coordenadores- **Database**: PostgreSQL 15

- **Visualização hierárquica** de equipes- **Authentication**: JWT (JSON Web Tokens)

- **Métricas por squad**- **Security**: Spring Security 6

- **Containerization**: Docker & Docker Compose

### ✅ Gerenciamento de Tarefas- **Build Tool**: Maven



- **Criação e atribuição** de tarefas### Project Structure

- **Prioridades** (ALTA, MEDIA, BAIXA)

- **Status** (TODO, IN_PROGRESS, DONE)```

- **Deadline tracking**src/

├── main/

### 🔔 Notificações│   ├── java/com/sge/sge_app/

│   │   ├── config/           # Configuration classes

- **Push notifications** via Expo│   │   │   ├── SecurityConfig.java

- **Notificações in-app** em tempo real│   │   │   └── ModelMapperConfig.java

- **Centro de notificações** com histórico│   │   ├── controller/       # REST Controllers

- **Badges de contador** não lidas│   │   │   └── AuthController.java

│   │   ├── domain/model/     # JPA Entities

---│   │   │   ├── User.java

│   │   │   └── Role.java

## 🔧 Desenvolvimento Local│   │   ├── dto/              # Data Transfer Objects

│   │   │   ├── request/

### Backend (Spring Boot)│   │   │   └── response/

│   │   ├── security/         # Security components

```bash│   │   │   ├── JwtTokenProvider.java

cd backend/sge-app│   │   │   ├── JwtAuthenticationFilter.java

│   │   │   └── CustomUserDetailsService.java

# Com Maven│   │   └── services/         # Business logic

./mvnw spring-boot:run│   └── resources/

│       └── application.properties

# Com Docker```

docker build -t pentachaos-backend .

docker run -p 8080:8080 pentachaos-backend## 🔧 Configuration

```

### Environment Variables

**Configuração:** `backend/sge-app/src/main/resources/application.properties`

The application uses the following environment variables (defined in `.env`):

### Frontend (React)

| Variable | Description | Default Value |

```bash|----------|-------------|---------------|

cd frontend/frontProject| `POSTGRES_DB` | Database name | `sge_app_db` |

| `POSTGRES_USER` | Database username | `admin_sge` |

# Instalar dependências| `POSTGRES_PASSWORD` | Database password | `mysecretpassword` |

npm install| `JWT_SECRET_KEY` | Secret key for JWT signing | `i0o++I7jThwmozMy2cNjH+HeC6d6LBqKkoPbi3yYIfA=` |

| `JWT_EXPIRATION` | Access token expiration (ms) | `86400000` (24 hours) |

# Modo desenvolvimento| `JWT_REFRESH_EXPIRATION` | Refresh token expiration (ms) | `604800000` (7 days) |

npm run dev        # Port 5173

### Database Configuration

# Build produção

npm run buildThe application automatically creates the database schema using Hibernate DDL auto-update. The database connection is configured through environment variables in the Docker Compose file.

npm run preview    # Testar build

```### CORS Configuration



### Mobile (React Native)The application is configured to accept requests from:

- `http://localhost:5173` (Vite development server)

```bash- `http://localhost:3000` (React development server)

cd integrador-mobile

## 🐳 Docker Configuration

# Instalar dependências

npm install### Services



# Iniciar Expo1. **Database Service** (`db`):

npx expo start   - PostgreSQL 15 Alpine

   - Port: 5432

# Opções:   - Persistent data storage

# - Pressione 'w' para web

# - Pressione 'a' para Android2. **Application Service** (`app`):

# - Pressione 'i' para iOS   - Spring Boot application

# - Escaneie QR Code com Expo Go   - Port: 8080

```   - Depends on database service



**⚠️ Importante:** Configure a URL da API em `integrador-mobile/utils/constants.ts`### Docker Commands



---```bash

# Build and start all services

## 🗄️ Banco de Dadosdocker compose up --build -d



### Modelo de Dados# View logs

docker compose logs -f

O sistema utiliza **PostgreSQL 15** com as seguintes tabelas principais:

# Stop services

- `users` - Usuários do sistemadocker compose down

- `roles` - Papéis de acesso (ADMIN, USER)

- `squads` - Squads/equipes# Stop and remove volumes (⚠️ This will delete all data)

- `tasks` - Tarefasdocker compose down -v

- `clock_entries` - Registros de ponto```

- `notifications` - Notificações

## 🔒 Security Features

### Seed Data

### JWT Implementation

O banco é inicializado automaticamente com dados de teste via `data.sql`. Inclui:

- 10 usuários de exemplo- **Algorithm**: HS512 (HMAC with SHA-512)

- 3 squads pré-configurados- **Access Token**: Short-lived (24 hours)

- Tarefas e notificações de exemplo- **Refresh Token**: Long-lived (7 days)

- **Claims**: Username, roles, issued at, expiration

---

### Password Security

## 📡 API Endpoints

- Passwords are hashed using Spring Security's BCrypt

### Autenticação- Minimum password length: 6 characters

- Maximum password length: 100 characters

```http

POST   /api/v1/auth/login          # Login (JWT)### User Management

POST   /api/v1/auth/refresh        # Renovar token

GET    /api/v1/users/me            # Usuário logado- Users can be enabled/disabled

```- Account lockout support

- Credential expiration support

### Usuários- Role-based access control (RBAC)



```http## 🧪 Testing the Authentication

GET    /api/v1/users               # Listar (ADMIN)

POST   /api/v1/users               # Criar (ADMIN)### Using curl

PUT    /api/v1/users/{id}          # Atualizar

DELETE /api/v1/users/{id}          # Deletar (ADMIN)1. **Register a new user**:

``````bash

curl -X POST http://localhost:8080/auth/register \

### Clock Entries (Ponto)  -H "Content-Type: application/json" \

  -d '{

```http    "username": "testuser",

POST   /api/v1/clockentries        # Registrar ponto    "email": "test@example.com",

GET    /api/v1/clockentries/me/today        # Pontos de hoje    "password": "password123"

GET    /api/v1/clockentries/me/history      # Histórico  }'

``````



### Squads2. **Login**:

```bash

```httpcurl -X POST http://localhost:8080/auth/login \

GET    /api/v1/squads              # Listar  -H "Content-Type: application/json" \

POST   /api/v1/squads              # Criar (ADMIN)  -d '{

PUT    /api/v1/squads/{id}         # Atualizar (ADMIN)    "usernameOrEmail": "testuser",

DELETE /api/v1/squads/{id}         # Deletar (ADMIN)    "password": "password123"

```  }'

```

### Tarefas

3. **Use the access token**:

```http```bash

GET    /api/v1/tasks               # Listarcurl -X GET http://localhost:8080/api/protected-endpoint \

POST   /api/v1/tasks               # Criar  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

PUT    /api/v1/tasks/{id}          # Atualizar```

DELETE /api/v1/tasks/{id}          # Deletar

```## 🚨 Troubleshooting



📚 **Documentação completa:** http://localhost:8080/swagger-ui.html### Common Issues



---1. **Application won't start**:

   - Ensure `.env` file exists with all required variables

## 🔒 Segurança   - Check if ports 8080 and 5432 are available

   - Verify Docker is running

### Implementações

2. **Database connection issues**:

✅ **Autenticação JWT** robusta     - Wait for database to fully initialize (may take 30-60 seconds)

✅ **Senhas criptografadas** (BCrypt cost 10)     - Check database logs: `docker compose logs db`

✅ **CORS** configurado  

✅ **SQL Injection** prevenido (JPA)  3. **JWT token issues**:

✅ **XSS Protection** habilitado     - Ensure JWT_SECRET_KEY is properly set

✅ **HTTPS** recomendado em produção     - Check token expiration times

   - Verify token format in Authorization header

### OWASP Top 10 Coverage

### Logs

| Vulnerabilidade | Mitigação |

|----------------|-----------|```bash

| A01: Broken Access Control | Spring Security + RBAC |# View application logs

| A02: Cryptographic Failures | BCrypt + JWT + HTTPS |docker compose logs app

| A03: Injection | JPA Prepared Statements |

| A07: Auth Failures | JWT com expiração |# View database logs

| A08: Software/Data Integrity | Validação de entrada |docker compose logs db



---# View all logs

docker compose logs

## 📚 Documentação Adicional```



- 📖 [**Documento de Visão**](docs/VISION.md) - Visão geral do produto (requisito do projeto)## 📝 Development

- 📝 [**PRD**](docs/prd.md) - Product Requirements Document

- 🌿 [**Git Workflow**](docs/branch-management.md) - Fluxo de branches### Local Development

- 💬 [**Commits**](docs/commit-pattern.md) - Padrão de commits

For local development without Docker:

---

1. Install Java 21 and Maven

## 👥 Equipe2. Install PostgreSQL and create database

3. Update `application.properties` with local database settings

Desenvolvido por alunos do **SENAI** como Projeto Integrador IV:4. Run: `mvn spring-boot:run`



- **Gabriel Eliezer Rodrigues** - Full Stack### Building the Application

- **David Francisco Vieira** - Backend

- **Rafael Rodrigues** - Frontend```bash

- **José Henrique Bernardes Vieira** - Mobile# Build JAR file

- **Pablo Vinicius Domingues Sanches** - DevOpsmvn clean package

- **Daniel Marques De Melos Asiatico** - QA

# Run tests

---mvn test



## 📄 Licença# Skip tests during build

mvn clean package -DskipTests

Este projeto foi desenvolvido para fins acadêmicos no contexto do **Projeto Integrador IV - SENAI**.```



---## 🧪 Testing



## 🔗 Links ÚteisO sistema possui uma suíte abrangente de testes que garante a qualidade e confiabilidade da aplicação.



- 🎨 [Protótipo Figma](https://www.figma.com/design/D6GEmmBtiQgZz95ZBHu6e3/Projeto-Integrador-Final)### **Testes Implementados**

- 🏢 [SAGA SENAI de Inovação](https://gpinovacao.senai.br/)

- 📊 [Kanban Board](https://github.com/orgs/ProjetoIntegrador04/projects/1)#### **1. Testes de Integração**

- **SimpleApplicationTest**: Valida se o contexto completo da aplicação Spring Boot carrega corretamente

---  - ✅ Configurações do banco H2 em memória

  - ✅ Integração entre todas as camadas (Controller, Service, Repository)

## 🆘 Suporte  - ✅ Injeção de dependências



Encontrou um problema? Abra uma [issue](https://github.com/ProjetoIntegrador04/PentaChaos/issues).#### **2. Testes Unitários**

- **ClockEntryServiceSimpleTest**: Testa o serviço de registro de ponto isoladamente

---  - ✅ Mocks com Mockito para isolar dependências

  - ✅ Validação de instanciação do service

<div align="center">  - ✅ Verificação de injeção de dependências



**⭐ Se este projeto foi útil, considere dar uma estrela!**### **Configuração de Testes**



Feito com ❤️ por **PentaChaos Team** - SENAI 2025- **Perfil de teste separado**: `application-test.properties`

- **Banco H2 em memória**: Testes isolados sem dependência do PostgreSQL

</div>- **Framework**: JUnit 5 + Mockito + Spring Boot Test

- **Cobertura atual**: 3/3 testes (100% de sucesso)

### **Executando os Testes**

```bash
# Todos os testes funcionais
./mvnw test -Dtest="SimpleApplicationTest,ClockEntryServiceSimpleTest"

# Teste individual de integração
./mvnw test -Dtest=SimpleApplicationTest

# Teste individual unitário
./mvnw test -Dtest=ClockEntryServiceSimpleTest

# Todos os testes (alguns podem falhar por problemas de compilação)
./mvnw test
```

### **Estrutura dos Testes**

```
src/test/java/
├── com/sge/sge_app/
│   ├── SimpleApplicationTest.java           # Teste de integração
│   └── services/
│       └── ClockEntryServiceSimpleTest.java # Teste unitário
└── resources/
    └── application-test.properties          # Configurações de teste
```

### **Próximas Expansões Planejadas**
- Testes de Repository (JPA)
- Testes de Controller (MockMvc)
- Testes de validação de regras de negócio
- Testes de autenticação JWT

## 📚 API Documentation

### Authentication Endpoints (Public)

#### 1. User Login
```http
POST /auth/login
Content-Type: application/json

{
  "usernameOrEmail": "john.doe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

#### 2. Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

---

### User Management Endpoints

#### 3. Register New User (ADMIN Only)
```http
POST /auth/register
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "ra": "123456",
  "phoneNumber": "(11) 98765-4321",
  "isAdmin": false
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "john.doe",
  "email": "john@example.com",
  "enabled": true,
  "roles": ["ROLE_USER"]
}
```

**Notes:** 
- Required fields: `username`, `email`, and `password`.
- Optional fields: `fullName`, `ra`, `phoneNumber`, `isAdmin`.
- `isAdmin`: Set to `true` to assign ADMIN role. Default is `false` (creates regular user).
- `squad`: Not included in registration. Assign it later via the Update User endpoint.

#### 4. Get Current User Profile
```http
GET /api/v1/users/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john.doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "ra": "123456",
  "squad": "CASE",
  "phoneNumber": "(11) 98765-4321",
  "enabled": true,
  "roles": [
    {
      "id": 1,
      "name": "ROLE_USER"
    }
  ]
}
```

#### 5. Update Current User Profile
```http
PUT /api/v1/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "fullName": "John Updated Doe",
  "phoneNumber": "(11) 99999-9999"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john.doe",
  "email": "newemail@example.com",
  "fullName": "John Updated Doe",
  "ra": "123456",
  "squad": "CASE",
  "phoneNumber": "(11) 99999-9999",
  "enabled": true,
  "roles": [...]
}
```

#### 6. List All Users (ADMIN Only)
```http
GET /api/v1/users
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "john.doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "ra": "123456",
    "squad": "CASE",
    "phoneNumber": "(11) 98765-4321",
    "enabled": true,
    "roles": [...]
  },
  {
    "id": 2,
    "username": "jane.smith",
    "email": "jane@example.com",
    "fullName": "Jane Smith",
    "ra": "654321",
    "squad": "LSD",
    "phoneNumber": "(11) 91234-5678",
    "enabled": true,
    "roles": [...]
  }
]
```

#### 7. Get User by ID (ADMIN Only)
```http
GET /api/v1/users/{id}
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john.doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "ra": "123456",
  "squad": "CASE",
  "phoneNumber": "(11) 98765-4321",
  "enabled": true,
  "roles": [...]
}
```

#### 8. Update User (ADMIN Only)
```http
PUT /api/v1/users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "email": "updated@example.com",
  "username": "john.updated"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john.updated",
  "email": "updated@example.com",
  "fullName": "John Doe",
  "enabled": true,
  "roles": [...]
}
```

#### 9. Toggle User Status (ADMIN Only)
```http
PATCH /api/v1/users/{id}/status
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john.doe",
  "email": "john@example.com",
  "enabled": false,
  "roles": [...]
}
```

---

### Clock Entry Endpoints

#### 10. Register Clock Entry (Punch In/Out)
```http
POST /api/v1/clock-entry
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "john.doe",
  "cardNumber": "12345",
  "entryType": "ENTRY"
}
```

**Request Parameters:**
- `username`: User's username
- `cardNumber`: Card identification number
- `entryType`: Can be `"ENTRY"` (entrada) or `"EXIT"` (saída)

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john.doe",
  "cardNumber": "12345",
  "entryType": "ENTRY",
  "timestamp": "2025-11-21T15:30:00",
  "message": "Ponto registrado com sucesso!"
}
```

#### 11. Get All Clock Entries
```http
GET /api/v1/clock-entry
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "john.doe",
    "cardNumber": "12345",
    "entryType": "ENTRY",
    "timestamp": "2025-11-21T08:00:00"
  },
  {
    "id": 2,
    "username": "john.doe",
    "cardNumber": "12345",
    "entryType": "EXIT",
    "timestamp": "2025-11-21T17:00:00"
  }
]
```

---

### Task Management Endpoints

#### 12. Get All Tasks
```http
GET /api/v1/tasks
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Implementar autenticação",
    "description": "Criar sistema de login com JWT",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "assignedTo": "john.doe",
    "createdAt": "2025-11-21T10:00:00",
    "updatedAt": "2025-11-21T15:30:00"
  }
]
```

#### 13. Get Task by ID
```http
GET /api/v1/tasks/{id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Implementar autenticação",
  "description": "Criar sistema de login com JWT",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "assignedTo": "john.doe",
  "createdAt": "2025-11-21T10:00:00",
  "updatedAt": "2025-11-21T15:30:00"
}
```

#### 14. Create Task (ADMIN Only)
```http
POST /api/v1/tasks
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Nova tarefa",
  "description": "Descrição da tarefa",
  "status": "TODO",
  "priority": "MEDIUM",
  "assignedTo": "john.doe"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Nova tarefa",
  "description": "Descrição da tarefa",
  "status": "TODO",
  "priority": "MEDIUM",
  "assignedTo": "john.doe",
  "createdAt": "2025-11-21T16:00:00",
  "updatedAt": "2025-11-21T16:00:00"
}
```

#### 15. Update Task (ADMIN Only)
```http
PUT /api/v1/tasks/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Tarefa atualizada",
  "status": "IN_PROGRESS"
}
```

**Response (200 OK):**
```json
{
  "id": 2,
  "title": "Tarefa atualizada",
  "description": "Descrição da tarefa",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "assignedTo": "john.doe",
  "createdAt": "2025-11-21T16:00:00",
  "updatedAt": "2025-11-21T16:30:00"
}
```

#### 16. Delete Task (ADMIN Only)
```http
DELETE /api/v1/tasks/{id}
Authorization: Bearer {admin_token}
```

**Response (204 No Content)**

---

### Card Management Endpoints

#### 17. Create Card (ADMIN Only)
```http
POST /api/v1/cards
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "cardNumber": "12345",
  "username": "john.doe",
  "active": true
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "cardNumber": "12345",
  "username": "john.doe",
  "active": true,
  "createdAt": "2025-11-21T10:00:00"
}
```

#### 18. Get All Cards
```http
GET /api/v1/cards
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "cardNumber": "12345",
    "username": "john.doe",
    "active": true,
    "createdAt": "2025-11-21T10:00:00"
  }
]
```

---

### Authorization Levels

| Endpoint | Required Role |
|----------|--------------|
| `POST /auth/login` | Public (No auth) |
| `POST /auth/refresh` | Public (No auth) |
| `POST /auth/register` | **ADMIN** |
| `GET /api/v1/users/me` | USER or ADMIN |
| `PUT /api/v1/users/me` | USER or ADMIN |
| `GET /api/v1/users` | **ADMIN** |
| `GET /api/v1/users/{id}` | **ADMIN** |
| `PUT /api/v1/users/{id}` | **ADMIN** |
| `PATCH /api/v1/users/{id}/status` | **ADMIN** |
| `POST /api/v1/clock-entry` | USER or ADMIN |
| `GET /api/v1/clock-entry` | USER or ADMIN |
| `GET /api/v1/tasks` | USER or ADMIN |
| `GET /api/v1/tasks/{id}` | USER or ADMIN |
| `POST /api/v1/tasks` | **ADMIN** |
| `PUT /api/v1/tasks/{id}` | **ADMIN** |
| `DELETE /api/v1/tasks/{id}` | **ADMIN** |
| `POST /api/v1/cards` | **ADMIN** |
| `GET /api/v1/cards` | USER or ADMIN |

---

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Username is required"
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Access denied. Admin role required."
}
```

#### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

---

### Testing with cURL

**Login and get token:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'
```

**Use token in requests:**
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Register new user (as admin):**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "email":"new@example.com",
    "password":"password123",
    "fullName":"New User",
    "squad":"CASE"
  }'
```

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
8. **[📘 Exemplos de Uso da API](/docs/api-examples.md)** ⭐ Novo!
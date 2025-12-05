# 📘 API Examples - SGE System

Este documento contém exemplos práticos de uso da API do SGE System com diferentes ferramentas.

## 📋 Índice

- [Configuração Inicial](#configuração-inicial)
- [Autenticação](#autenticação)
- [Gerenciamento de Usuários](#gerenciamento-de-usuários)
- [Registro de Ponto](#registro-de-ponto)
- [Gerenciamento de Tasks](#gerenciamento-de-tasks)
- [Postman Collection](#postman-collection)

---

## Configuração Inicial

### Base URL
```
http://localhost:8080
```

### Headers Padrão

```
Content-Type: application/json
```

### Headers com Autenticação

```
Content-Type: application/json
Authorization: Bearer {seu_token_jwt}
```

---

## Autenticação

### 1. Login (Obter Token)

**Endpoint:** `POST /auth/login`

**Requisição:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "admin123"
  }'
```

**Resposta (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYzMjQ4...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYzMj...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

**JavaScript (Fetch):**
```javascript
const login = async () => {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usernameOrEmail: 'admin',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
};
```

**Python (requests):**
```python
import requests

url = "http://localhost:8080/auth/login"
payload = {
    "usernameOrEmail": "admin",
    "password": "admin123"
}

response = requests.post(url, json=payload)
data = response.json()

access_token = data['accessToken']
print(f"Token obtido: {access_token}")
```

---

### 2. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Requisição:**
```bash
curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
  }'
```

**Resposta (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

---

## Gerenciamento de Usuários

### 3. Cadastrar Novo Usuário (ADMIN)

**Endpoint:** `POST /auth/register`

**Headers:** 
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Requisição (campos obrigatórios apenas):**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joao.silva",
    "email": "joao.silva@example.com",
    "password": "senha123"
  }'
```

**Requisição (com todos os campos):**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "maria.souza",
    "email": "maria.souza@example.com",
    "password": "senha123",
    "fullName": "Maria Souza da Silva",
    "ra": "654321",
    "phoneNumber": "(11) 91234-5678",
    "isAdmin": false
  }'
```

**Requisição (criar como coordenador/admin):**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "coordenador",
    "email": "coordenador@example.com",
    "password": "senha123",
    "fullName": "Coordenador Silva",
    "isAdmin": true
  }'
```

**Resposta (201 Created):**
```json
{
  "id": 2,
  "username": "maria.souza",
  "email": "maria.souza@example.com",
  "enabled": true,
  "roles": ["ROLE_USER"]
}
```

**Notas:**
- Campos obrigatórios: `username`, `email`, `password`
- Campos opcionais: `fullName`, `ra`, `phoneNumber`, `isAdmin`
- `isAdmin`: Define se o usuário terá role de ADMIN (coordenador). Default: `false`
- `squad`: Não é definido no cadastro. Deve ser atribuído posteriormente via endpoint de atualização

**JavaScript (com async/await):**
```javascript
const registerUser = async (adminToken, userData) => {
  const response = await fetch('http://localhost:8080/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
};

// Uso - Criar usuário comum
const newUser = {
  username: 'pedro.santos',
  email: 'pedro@example.com',
  password: 'senha123',
  fullName: 'Pedro Santos',
  ra: '123456',
  phoneNumber: '(11) 98888-7777',
  isAdmin: false
};

// Uso - Criar coordenador
const newAdmin = {
  username: 'coord.silva',
  email: 'coord@example.com',
  password: 'senha123',
  fullName: 'Coordenador Silva',
  isAdmin: true
};

registerUser(adminToken, newUser)
  .then(user => console.log('Usuário criado:', user))
  .catch(error => console.error('Erro:', error));
```

---

### 4. Obter Perfil do Usuário Logado

**Endpoint:** `GET /api/v1/users/me`

**Headers:** 
```
Authorization: Bearer {token}
```

**Requisição:**
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "username": "joao.silva",
  "email": "joao.silva@example.com",
  "fullName": "João Silva",
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

**TypeScript (React/React Native):**
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  ra?: string;
  squad?: string;
  phoneNumber?: string;
  enabled: boolean;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
}

const getMyProfile = async (token: string): Promise<User> => {
  const response = await fetch('http://localhost:8080/api/v1/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar perfil');
  }
  
  return await response.json();
};
```

---

### 5. Atualizar Perfil do Usuário Logado

**Endpoint:** `PUT /api/v1/users/me`

**Headers:** 
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Requisição:**
```bash
curl -X PUT http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novoemail@example.com",
    "fullName": "João Silva Santos",
    "phoneNumber": "(11) 99999-9999"
  }'
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "username": "joao.silva",
  "email": "novoemail@example.com",
  "fullName": "João Silva Santos",
  "ra": "123456",
  "squad": "CASE",
  "phoneNumber": "(11) 99999-9999",
  "enabled": true,
  "roles": [...]
}
```

---

### 6. Listar Todos os Usuários (ADMIN)

**Endpoint:** `GET /api/v1/users`

**Headers:** 
```
Authorization: Bearer {admin_token}
```

**Requisição:**
```bash
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "username": "joao.silva",
    "email": "joao@example.com",
    "fullName": "João Silva",
    "ra": "123456",
    "squad": "CASE",
    "phoneNumber": "(11) 98765-4321",
    "enabled": true,
    "roles": [
      { "id": 1, "name": "ROLE_USER" }
    ]
  },
  {
    "id": 2,
    "username": "maria.souza",
    "email": "maria@example.com",
    "fullName": "Maria Souza",
    "ra": "654321",
    "squad": "LSD",
    "phoneNumber": "(11) 91234-5678",
    "enabled": true,
    "roles": [
      { "id": 1, "name": "ROLE_USER" },
      { "id": 2, "name": "ROLE_ADMIN" }
    ]
  }
]
```

**JavaScript (filtrar por squad):**
```javascript
const getUsersBySquad = async (adminToken, squad) => {
  const response = await fetch('http://localhost:8080/api/v1/users', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const users = await response.json();
  return users.filter(user => user.squad === squad);
};

// Obter usuários do squad CASE
getUsersBySquad(adminToken, 'CASE')
  .then(users => console.log(`Usuários do CASE:`, users));
```

---

### 7. Buscar Usuário por ID (ADMIN)

**Endpoint:** `GET /api/v1/users/{id}`

**Headers:** 
```
Authorization: Bearer {admin_token}
```

**Requisição:**
```bash
curl -X GET http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "username": "joao.silva",
  "email": "joao@example.com",
  "fullName": "João Silva",
  "ra": "123456",
  "squad": "CASE",
  "phoneNumber": "(11) 98765-4321",
  "enabled": true,
  "roles": [...]
}
```

---

### 8. Atualizar Usuário (ADMIN)

**Endpoint:** `PUT /api/v1/users/{id}`

**Headers:** 
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Requisição:**
```bash
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "username": "joao.updated"
  }'
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "username": "joao.updated",
  "email": "newemail@example.com",
  "fullName": "João Silva",
  "enabled": true,
  "roles": [...]
}
```

---

### 9. Ativar/Desativar Usuário (ADMIN)

**Endpoint:** `PATCH /api/v1/users/{id}/status`

**Headers:** 
```
Authorization: Bearer {admin_token}
```

**Requisição (desativar usuário):**
```bash
curl -X PATCH http://localhost:8080/api/v1/users/1/status \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "username": "joao.silva",
  "email": "joao@example.com",
  "enabled": false,
  "roles": [...]
}
```

**JavaScript (toggle status):**
```javascript
const toggleUserStatus = async (adminToken, userId) => {
  const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Erro ao alterar status');
  }
  
  return await response.json();
};

// Alternar status do usuário ID 1
toggleUserStatus(adminToken, 1)
  .then(user => console.log(`Novo status: ${user.enabled ? 'Ativo' : 'Inativo'}`));
```

---

## Registro de Ponto

### 10. Registrar Entrada/Saída

**Endpoint:** `POST /api/v1/clock-entry`

**Headers:** 
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Requisição (Entrada):**
```bash
curl -X POST http://localhost:8080/api/v1/clock-entry \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joao.silva",
    "cardNumber": "12345",
    "entryType": "ENTRY"
  }'
```

**Requisição (Saída):**
```bash
curl -X POST http://localhost:8080/api/v1/clock-entry \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joao.silva",
    "cardNumber": "12345",
    "entryType": "EXIT"
  }'
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "username": "joao.silva",
  "cardNumber": "12345",
  "entryType": "ENTRY",
  "timestamp": "2025-11-21T08:30:00",
  "message": "Ponto registrado com sucesso!"
}
```

---

### 11. Listar Registros de Ponto

**Endpoint:** `GET /api/v1/clock-entry`

**Headers:** 
```
Authorization: Bearer {token}
```

**Requisição:**
```bash
curl -X GET http://localhost:8080/api/v1/clock-entry \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "username": "joao.silva",
    "cardNumber": "12345",
    "entryType": "ENTRY",
    "timestamp": "2025-11-21T08:00:00"
  },
  {
    "id": 2,
    "username": "joao.silva",
    "cardNumber": "12345",
    "entryType": "EXIT",
    "timestamp": "2025-11-21T12:00:00"
  },
  {
    "id": 3,
    "username": "joao.silva",
    "cardNumber": "12345",
    "entryType": "ENTRY",
    "timestamp": "2025-11-21T13:00:00"
  },
  {
    "id": 4,
    "username": "joao.silva",
    "cardNumber": "12345",
    "entryType": "EXIT",
    "timestamp": "2025-11-21T17:00:00"
  }
]
```

---

## Gerenciamento de Tasks

### 12. Criar Task (ADMIN)

**Endpoint:** `POST /api/v1/tasks`

**Headers:** 
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Requisição:**
```bash
curl -X POST http://localhost:8080/api/v1/tasks \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar tela de login",
    "description": "Criar interface de login com validação",
    "status": "TODO",
    "priority": "HIGH",
    "assignedTo": "joao.silva"
  }'
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "title": "Implementar tela de login",
  "description": "Criar interface de login com validação",
  "status": "TODO",
  "priority": "HIGH",
  "assignedTo": "joao.silva",
  "createdAt": "2025-11-21T10:00:00",
  "updatedAt": "2025-11-21T10:00:00"
}
```

---

## Postman Collection

### Importar Collection

Crie um arquivo `SGE_API.postman_collection.json`:

```json
{
  "info": {
    "name": "SGE API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{accessToken}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"usernameOrEmail\": \"admin\",\n  \"password\": \"admin123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        },
        {
          "name": "Register User (ADMIN)",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"newuser\",\n  \"email\": \"new@example.com\",\n  \"password\": \"password123\",\n  \"fullName\": \"New User\",\n  \"squad\": \"CASE\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get My Profile",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/v1/users/me",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "users", "me"]
            }
          }
        },
        {
          "name": "List All Users (ADMIN)",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/v1/users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "users"]
            }
          }
        },
        {
          "name": "Toggle User Status (ADMIN)",
          "request": {
            "method": "PATCH",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/v1/users/1/status",
              "host": ["{{baseUrl}}"],
              "path": ["api", "v1", "users", "1", "status"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Tratamento de Erros

### Resposta 400 (Bad Request)

```json
{
  "error": "Validation failed",
  "message": "Username já está em uso"
}
```

### Resposta 401 (Unauthorized)

```json
{
  "error": "Unauthorized",
  "message": "Credenciais inválidas"
}
```

### Resposta 403 (Forbidden)

```json
{
  "error": "Forbidden",
  "message": "Acesso negado. Role ADMIN necessária."
}
```

### Resposta 404 (Not Found)

```json
{
  "error": "Not Found",
  "message": "Usuário não encontrado"
}
```

---

## Fluxo Completo de Teste

### 1. Login como Admin

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'
```

Salve o `accessToken` retornado.

### 2. Cadastrar Novo Usuário

```bash
TOKEN="seu_token_aqui"

curl -X POST http://localhost:8080/auth/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teste.user",
    "email": "teste@example.com",
    "password": "senha123",
    "fullName": "Usuário de Teste",
    "squad": "CASE"
  }'
```

### 3. Listar Usuários

```bash
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Login com Novo Usuário

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"teste.user","password":"senha123"}'
```

### 5. Ver Perfil

```bash
USER_TOKEN="token_do_novo_usuario"

curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $USER_TOKEN"
```

---

**Nota:** Substitua `SEU_TOKEN`, `SEU_TOKEN_ADMIN`, etc. pelos tokens reais obtidos no login.

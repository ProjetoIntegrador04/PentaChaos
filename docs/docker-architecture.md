# Arquitetura Docker - PentaChaos

## 📦 Estrutura de Containers

O projeto PentaChaos utiliza Docker Compose para orquestrar 4 serviços:

### 1. Database (PostgreSQL)
- **Container**: `pentachaos-db`
- **Imagem**: `postgres:15-alpine`
- **Porta**: `5432:5432`
- **Volume**: `postgres_data` (persistência de dados)
- **Healthcheck**: Verificação de disponibilidade a cada 10s

### 2. Backend (Spring Boot)
- **Container**: `pentachaos-backend`
- **Linguagem**: Java 21
- **Framework**: Spring Boot 3.5.6
- **Porta**: `8080:8080`
- **Build**: Multi-stage (Maven + JRE Alpine)
- **Depende de**: `db` (aguarda healthcheck)
- **Healthcheck**: `/actuator/health` a cada 30s

### 3. Frontend (React + Vite)
- **Container**: `pentachaos-frontend`
- **Framework**: React 19 + Vite
- **Servidor**: Nginx Alpine
- **Porta**: `3000:80` (Nginx na 80, mapeada para 3000 no host)
- **Build**: Multi-stage (Node 20 + Nginx)
- **Depende de**: `backend`
- **Features**: SPA routing, cache otimizado, gzip

### 4. Mobile (React Native/Expo)
- **Container**: `pentachaos-mobile`
- **Framework**: React Native com Expo 54
- **Portas**: 
  - `8081:8081` (Metro bundler)
  - `19000:19000` (Expo DevTools)
  - `19001:19001` (Expo Developer Tools)
- **Depende de**: `backend`
- **Hot Reload**: Volumes mapeados para desenvolvimento

## 🌐 Rede

Todos os containers estão na mesma rede Docker Bridge: `pentachaos-network`

Isso permite comunicação interna entre containers usando nomes de serviço:
- Backend pode acessar DB via `db:5432`
- Frontend faz proxy para `backend:8080`
- Mobile acessa API via `backend:8080`

## 🚀 Comandos Úteis

### Iniciar todos os serviços
```bash
docker compose up -d
```

### Iniciar com rebuild
```bash
docker compose up --build -d
```

### Ver logs
```bash
# Todos os serviços
docker compose logs -f

# Serviço específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mobile
docker compose logs -f db
```

### Parar serviços
```bash
docker compose down
```

### Parar e remover volumes
```bash
docker compose down -v
```

### Rebuild de um serviço específico
```bash
docker compose build backend --no-cache
docker compose build frontend --no-cache
docker compose build mobile --no-cache
```

### Status dos containers
```bash
docker compose ps
```

### Acessar shell de um container
```bash
docker compose exec backend sh
docker compose exec frontend sh
docker compose exec db psql -U admin_sge -d sge_app_db
```

## 📂 Volumes

### postgres_data
Volume nomeado para persistência dos dados do PostgreSQL.

**Localização**: Gerenciado pelo Docker

**Backup**:
```bash
docker compose exec db pg_dump -U admin_sge sge_app_db > backup.sql
```

**Restore**:
```bash
cat backup.sql | docker compose exec -T db psql -U admin_sge -d sge_app_db
```

### Mobile Hot Reload
Volumes bind-mount para desenvolvimento:
- `./integrador-mobile:/app` - Código fonte
- `/app/node_modules` - Node modules (volume anônimo)
- `/app/.expo` - Cache do Expo

## 🔧 Variáveis de Ambiente

### Backend
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION`

### Frontend
- `VITE_API_URL` - URL da API backend

### Mobile
- `EXPO_PUBLIC_API_URL` - URL da API backend

### Database
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

## 🏗️ Multi-Stage Builds

### Backend Dockerfile
1. **Stage 1 (builder)**: Compila com Maven
2. **Stage 2 (runtime)**: JRE Alpine + JAR compilado

**Benefício**: Imagem final ~200MB (vs ~800MB com JDK)

### Frontend Dockerfile
1. **Stage 1 (builder)**: Build com Node 20
2. **Stage 2 (runtime)**: Nginx Alpine + arquivos estáticos

**Benefício**: Imagem final ~25MB (vs ~1.2GB com Node)

## 🔍 Troubleshooting

### Backend não inicia
1. Verificar se o DB está saudável: `docker compose ps`
2. Ver logs: `docker compose logs backend`
3. Comum: Aguardar o DB terminar inicialização

### Frontend não carrega
1. Verificar se o build completou: `docker compose logs frontend`
2. Acessar: http://localhost:3000
3. Verificar console do navegador para erros de API

### Mobile não conecta ao backend
1. Verificar `EXPO_PUBLIC_API_URL` no docker-compose.yml
2. No navegador, usar `http://localhost:8080` em vez de `http://backend:8080`
3. Ver logs: `docker compose logs mobile`

### Portas já em uso
```bash
# Verificar portas ocupadas (Windows)
netstat -ano | findstr "8080"
netstat -ano | findstr "3000"
netstat -ano | findstr "8081"

# Alterar portas no docker-compose.yml se necessário
```

## 🎯 Fluxo de Deploy

1. **Desenvolvimento Local**:
   ```bash
   git pull origin develop
   docker compose down
   docker compose build
   docker compose up -d
   ```

2. **Logs em tempo real**:
   ```bash
   docker compose logs -f
   ```

3. **Verificar saúde**:
   ```bash
   curl http://localhost:8080/actuator/health
   curl http://localhost:3000
   curl http://localhost:8081
   ```

## 📊 Recursos

### Requisitos Mínimos
- Docker Desktop 4.0+
- 4GB RAM disponível
- 10GB espaço em disco

### Consumo Aproximado
- **DB**: ~100MB RAM, 500MB disco
- **Backend**: ~512MB RAM, 200MB disco
- **Frontend**: ~10MB RAM, 25MB disco
- **Mobile**: ~200MB RAM, 1.2GB disco

## 🔐 Segurança

### Em Produção
1. **Mudar JWT_SECRET**: Usar chave forte e única
2. **Mudar senhas do DB**: Não usar credenciais padrão
3. **HTTPS**: Usar reverse proxy (Nginx/Traefik)
4. **Limitar portas**: Expor apenas necessárias
5. **Secrets**: Usar Docker Secrets ou variáveis de ambiente seguras

### Exemplo com .env
```bash
# Criar .env na raiz do projeto
POSTGRES_PASSWORD=senha-forte-aqui
JWT_SECRET=chave-jwt-super-secreta-aqui

# Referenciar no docker-compose.yml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

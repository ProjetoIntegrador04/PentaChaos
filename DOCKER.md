# 🐳 Docker Setup - PentaChaos

Este projeto utiliza Docker Compose para executar todo o stack de desenvolvimento em containers.

## 📦 Componentes

- **Backend**: Spring Boot 3.5.6 (Java 21) na porta 8080
- **Mobile**: React Native com Expo na porta 8081
- **Database**: PostgreSQL 15 na porta 5432

## 🚀 Como Usar

### Pré-requisitos
- Docker Desktop instalado
- Pelo menos 4GB de RAM disponível

### Iniciar todos os serviços

```bash
# Na raiz do projeto
docker compose up -d
```

### Iniciar apenas alguns serviços

```bash
# Apenas backend e banco
docker compose up -d backend db

# Apenas mobile
docker compose up -d mobile
```

### Ver logs

```bash
# Logs de todos os serviços
docker compose logs -f

# Logs de um serviço específico
docker compose logs -f backend
docker compose logs -f mobile
docker compose logs -f db
```

### Parar os serviços

```bash
# Parar todos
docker compose down

# Parar e remover volumes (limpa banco de dados)
docker compose down -v
```

### Rebuild após mudanças no código

```bash
# Rebuild do backend
docker compose up -d --build backend

# Rebuild do mobile
docker compose up -d --build mobile

# Rebuild de tudo
docker compose up -d --build
```

## 🌐 Acessar os serviços

Após iniciar os containers:

- **Backend API**: http://localhost:8080
- **Backend Health**: http://localhost:8080/actuator/health
- **Mobile Web**: http://localhost:8081
- **PostgreSQL**: localhost:5432
  - Database: `sge_app_db`
  - User: `admin_sge`
  - Password: `admin123`

## 🔧 Comandos Úteis

```bash
# Ver status dos containers
docker compose ps

# Acessar shell do container backend
docker compose exec backend sh

# Acessar shell do banco
docker compose exec db psql -U admin_sge -d sge_app_db

# Ver uso de recursos
docker stats

# Limpar tudo (containers, volumes, imagens)
docker compose down -v --rmi all
```

## 📝 Desenvolvimento Local (Sem Docker)

Se preferir rodar localmente sem Docker:

### Backend
```bash
cd backend/sge-app
./mvnw spring-boot:run
```

### Mobile
```bash
cd integrador-mobile
npm install
npx expo start
```

### Database (com Docker)
```bash
cd backend/sge-app
docker compose up -d db
```

## 🐛 Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker compose logs backend
docker compose logs mobile

# Verificar se as portas estão em uso
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :5432
```

### Backend não conecta no banco
```bash
# Verificar se o banco está pronto
docker compose exec db pg_isready -U admin_sge

# Reiniciar apenas o backend
docker compose restart backend
```

### Mobile não carrega
```bash
# Limpar cache e rebuild
docker compose down mobile
docker compose up -d --build mobile
```

### Limpar tudo e recomeçar
```bash
# Remove tudo
docker compose down -v
docker system prune -a

# Inicia do zero
docker compose up -d --build
```

## 📱 Acessar o mobile no celular

1. Backend e mobile devem estar rodando
2. Certifique-se que seu celular está na mesma rede WiFi
3. No arquivo `integrador-mobile/utils/constants.ts`, altere:
   ```typescript
   export const API_BASE_URL = 'http://SEU_IP_LOCAL:8080';
   ```
4. No celular, use o app Expo Go e escaneie o QR code

## 🔐 Usuários padrão

Após o primeiro start, use:
- **Username**: `eliezer`
- **Password**: `123456`
- **Roles**: ADMIN, USER

## 📊 Monitoramento

- **Backend Actuator**: http://localhost:8080/actuator
- **Health Check**: http://localhost:8080/actuator/health
- **Metrics**: http://localhost:8080/actuator/metrics

# 🚀 Guia Rápido - Docker

## Iniciar tudo de uma vez

### Windows (PowerShell)
```powershell
.\docker-manager.ps1 start
```

### Linux/Mac (Bash)
```bash
chmod +x docker-manager.sh
./docker-manager.sh start
```

### Ou diretamente
```bash
docker compose up -d
```

---

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `start` | Inicia todos os serviços |
| `stop` | Para todos os serviços |
| `restart` | Reinicia todos os serviços |
| `logs` | Mostra logs em tempo real |
| `status` | Status e uso de recursos |
| `clean` | Remove tudo (⚠️ perde dados) |
| `rebuild` | Rebuild após mudanças |
| `db-shell` | Acessa o PostgreSQL |
| `backend-logs` | Logs apenas do backend |
| `mobile-logs` | Logs apenas do mobile |

---

## 🌐 URLs de Acesso

Após `docker compose up -d`:

- **Backend**: http://localhost:8080
- **Mobile**: http://localhost:8081
- **Database**: localhost:5432
  - DB: `sge_app_db`
  - User: `admin_sge`
  - Pass: `admin123`

---

## 🔧 Comandos Úteis

### Ver logs específicos
```bash
docker compose logs -f backend
docker compose logs -f mobile
docker compose logs -f db
```

### Rebuild apenas um serviço
```bash
docker compose up -d --build backend
docker compose up -d --build mobile
```

### Parar apenas um serviço
```bash
docker compose stop backend
docker compose stop mobile
```

### Acessar shell do container
```bash
docker compose exec backend sh
docker compose exec mobile sh
```

### Executar comando SQL
```bash
docker compose exec db psql -U admin_sge -d sge_app_db -c "SELECT * FROM users;"
```

---

## ⚠️ Troubleshooting

### Porta em uso
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

### Limpar cache e recomeçar
```bash
docker compose down -v
docker system prune -a
docker compose up -d --build
```

### Backend não conecta no banco
```bash
# Aguardar healthcheck
docker compose exec db pg_isready -U admin_sge

# Reiniciar backend
docker compose restart backend
```

---

## 📱 Desenvolvimento

### Hot Reload
O mobile usa volumes para hot reload automático. Basta editar os arquivos e as mudanças aparecem.

### Rebuild após mudanças
```bash
# Backend (após mudar código Java)
docker compose up -d --build backend

# Mobile (após mudar dependências)
docker compose up -d --build mobile
```

---

## 💡 Dicas

1. **Primeira execução é lenta** (baixa imagens, compila código)
2. **Use `docker compose ps`** para ver status
3. **Use `docker stats`** para monitorar recursos
4. **Logs em tempo real**: `docker compose logs -f`
5. **Para desenvolvimento local**, rode apenas o DB no Docker:
   ```bash
   docker compose up -d db
   ```
   E rode backend/mobile localmente

---

## 🎯 Fluxo Típico

```bash
# 1. Iniciar tudo
docker compose up -d

# 2. Ver logs
docker compose logs -f

# 3. Fazer mudanças no código

# 4. Rebuild se necessário
docker compose up -d --build backend

# 5. Ao terminar
docker compose down
```

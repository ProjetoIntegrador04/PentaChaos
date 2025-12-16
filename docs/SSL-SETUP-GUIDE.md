# 🔒 Guia de Configuração SSL na EC2 AWS

> **Objetivo:** Configurar certificado SSL gratuito (Let's Encrypt) na EC2 para permitir acesso HTTPS ao backend Spring Boot através do DuckDNS.

---

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se de ter:

- ✅ **EC2 AWS** rodando com Spring Boot
- ✅ **DuckDNS** configurado: `sge-app.duckdns.org` apontando para o IP público da EC2
- ✅ **Frontend no AWS Amplify**: `https://develop.d3aawq3k9qng9z.amplifyapp.com/`
- ✅ **Acesso SSH** à EC2 (chave .pem)
- ✅ **PostgreSQL** rodando na EC2 ou RDS

---

## 🎯 PARTE 1: CONFIGURAR SECURITY GROUP

### Passo 1: Abrir Portas Necessárias

1. Acesse **AWS Console** → **EC2** → Selecione sua instância
2. Aba **"Security"** → Clique no **Security Group**
3. **"Edit inbound rules"** → **"Add rule"**

**Adicione estas regras:**

| Tipo | Protocolo | Porta | Origem | Descrição |
|------|-----------|-------|---------|-----------|
| HTTP | TCP | 80 | 0.0.0.0/0 | Certbot + Redirect |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Tráfego SSL |
| Custom TCP | TCP | 8080 | 0.0.0.0/0 | Spring Boot (temp) |
| SSH | TCP | 22 | Seu IP | Acesso SSH |
| PostgreSQL | TCP | 5432 | 0.0.0.0/0 | Database (se necessário) |

4. **Save rules**

⚠️ **Importante:** Após configurar o Nginx, você pode remover a regra da porta 8080 por segurança.

---

## 🚀 PARTE 2: INSTALAR SSL NA EC2

### Passo 2: Conectar via SSH

```bash
ssh -i sua-chave.pem ubuntu@IP_PUBLICO_DA_EC2
```

### Passo 3: Atualizar Sistema e Instalar Certbot

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install certbot python3-certbot-nginx -y
```

### Passo 4: Parar Spring Boot Temporariamente

**Opção A - Se estiver rodando como processo:**
```bash
# Encontrar o processo Java
ps aux | grep java

# Matar o processo (substitua PID)
sudo kill -9 PID
```

**Opção B - Se estiver como serviço systemd:**
```bash
sudo systemctl stop sge-app
```

### Passo 5: Liberar Portas 80 e 443

```bash
# Verificar o que está usando as portas
sudo netstat -tulpn | grep -E ':(80|443)'

# Se algo estiver usando, matar:
sudo fuser -k 80/tcp
sudo fuser -k 443/tcp
```

### Passo 6: Gerar Certificado SSL

```bash
sudo certbot certonly --standalone -d sge-app.duckdns.org
```

**Durante o processo, responda:**
- **Email:** `seu-email@exemplo.com` (para notificações de renovação)
- **Termos:** `Y` (aceitar)
- **Newsletter EFF:** `N` (ou `Y` se quiser)

✅ **Sucesso!** Certificados gerados em:
```
/etc/letsencrypt/live/sge-app.duckdns.org/fullchain.pem
/etc/letsencrypt/live/sge-app.duckdns.org/privkey.pem
```

---

## ⚙️ PARTE 3: CONFIGURAR NGINX COMO PROXY REVERSO

### Passo 7: Instalar Nginx

```bash
sudo apt install nginx -y
```

### Passo 8: Criar Configuração do Site

```bash
sudo nano /etc/nginx/sites-available/sge-app
```

**Cole este conteúdo:**

```nginx
# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name sge-app.duckdns.org;
    return 301 https://$server_name$request_uri;
}

# Servidor HTTPS
server {
    listen 443 ssl http2;
    server_name sge-app.duckdns.org;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/sge-app.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sge-app.duckdns.org/privkey.pem;

    # Configurações SSL Modernas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy para Spring Boot
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # WebSocket support (se necessário)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Logs
    access_log /var/log/nginx/sge-app-access.log;
    error_log /var/log/nginx/sge-app-error.log;
}
```

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

### Passo 9: Ativar Configuração

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/sge-app /etc/nginx/sites-enabled/

# Remover configuração padrão (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
sudo nginx -t

# Se aparecer "syntax is ok" e "test is successful":
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Passo 10: Verificar Status do Nginx

```bash
sudo systemctl status nginx
```

Deve mostrar: **"active (running)"** ✅

---

## ☕ PARTE 4: CONFIGURAR SPRING BOOT

### Passo 11: Ajustar application.properties

```bash
# Encontrar o arquivo
sudo find / -name "application.properties" 2>/dev/null

# Editar (ajuste o caminho)
sudo nano /home/ubuntu/app/application.properties
```

**Configuração recomendada:**

```properties
# ===== SERVIDOR =====
server.port=8080
# NÃO precisa SSL no Spring Boot (Nginx cuida disso)

# ===== BANCO DE DADOS =====
spring.datasource.url=jdbc:postgresql://localhost:5432/sge_app_db
spring.datasource.username=admin_sge
spring.datasource.password=SUA_SENHA_AQUI
spring.datasource.driver-class-name=org.postgresql.Driver

# ===== JPA/HIBERNATE =====
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# ===== JWT =====
jwt.secret=i0o++I7jThwmozMy2cNjH+HeC6d6LBqKkoPbi3yYIfA=
jwt.expiration=604800000
jwt.refresh-expiration=2592000000

# ===== LOGGING =====
logging.level.com.sge=INFO
logging.level.org.springframework.security=DEBUG

# ===== ACTUATOR =====
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
```

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

### Passo 12: Criar Serviço Systemd (Recomendado)

```bash
sudo nano /etc/systemd/system/sge-app.service
```

**Cole este conteúdo:**

```ini
[Unit]
Description=SGE Spring Boot Application
After=syslog.target network.target postgresql.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/app
ExecStart=/usr/bin/java -jar /home/ubuntu/app/sge-app.jar
SuccessExitStatus=143
StandardOutput=journal
StandardError=journal
SyslogIdentifier=sge-app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

⚠️ **Ajuste os caminhos:**
- `WorkingDirectory`: pasta onde está o JAR
- `ExecStart`: caminho completo do JAR

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

### Passo 13: Ativar e Iniciar o Serviço

```bash
# Recarregar systemd
sudo systemctl daemon-reload

# Habilitar inicialização automática
sudo systemctl enable sge-app

# Iniciar o serviço
sudo systemctl start sge-app

# Verificar status
sudo systemctl status sge-app
```

### Passo 14: Monitorar Logs

```bash
# Logs em tempo real
sudo journalctl -u sge-app -f

# Últimas 50 linhas
sudo journalctl -u sge-app -n 50

# Logs do Nginx
sudo tail -f /var/log/nginx/sge-app-access.log
sudo tail -f /var/log/nginx/sge-app-error.log
```

---

## 🌐 PARTE 5: CONFIGURAR FRONTEND

### Passo 15: Verificar Configuração do Frontend

O arquivo `.env` do frontend já está configurado:

```bash
VITE_API_URL=https://sge-app.duckdns.org
```

✅ **Nenhuma mudança necessária!**

O AWS Amplify vai rebuildar automaticamente quando você fizer push para a branch `develop`.

---

## ✅ PARTE 6: TESTES

### Passo 16: Testar na EC2

```bash
# Teste 1: Nginx responde
curl -I http://sge-app.duckdns.org
# Deve redirecionar (301) para HTTPS

# Teste 2: HTTPS funciona
curl -I https://sge-app.duckdns.org
# Deve retornar 200 OK

# Teste 3: API Health Check
curl https://sge-app.duckdns.org/actuator/health
# Deve retornar: {"status":"UP"}

# Teste 4: Endpoint de autenticação (deve dar erro de credenciais, não SSL)
curl -X POST https://sge-app.duckdns.org/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"teste","password":"senha123"}'
```

### Passo 17: Testar no Navegador

1. **Acesse:** `https://sge-app.duckdns.org/actuator/health`
   - Deve mostrar: `{"status":"UP"}`
   - **Sem aviso de certificado inválido!** ✅

2. **Acesse o frontend:** `https://develop.d3aawq3k9qng9z.amplifyapp.com/`
   - Tente fazer login
   - **Deve funcionar sem erro de SSL!** ✅

3. **Verifique o certificado:**
   - Clique no **cadeado** ao lado da URL
   - Deve mostrar: **"Let's Encrypt"**
   - Válido até: (3 meses a partir de hoje)

---

## 🔄 PARTE 7: RENOVAÇÃO AUTOMÁTICA

### Passo 18: Configurar Renovação Automática do Certificado

```bash
# Testar renovação (dry-run)
sudo certbot renew --dry-run
```

Se aparecer **"Congratulations, all simulated renewals succeeded"**, está OK! ✅

```bash
# Adicionar ao crontab
sudo crontab -e
```

**Escolha editor:** `1` (nano)

**Adicione esta linha no final:**

```bash
# Renovar certificado SSL a cada 2 meses às 3h da manhã
0 3 1 */2 * certbot renew --quiet --post-hook "systemctl reload nginx"
```

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

---

## 📊 ARQUITETURA FINAL

```
┌──────────────────────────────────────────────────────┐
│   🌐 INTERNET                                         │
└─────────────────┬────────────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────────────┐
│   AWS Amplify (Frontend)                             │
│   https://develop.d3aawq3k9qng9z.amplifyapp.com      │
│   - React + Vite + TypeScript                        │
└─────────────────┬────────────────────────────────────┘
                  │ HTTPS
┌─────────────────▼────────────────────────────────────┐
│   DuckDNS: sge-app.duckdns.org                       │
│   (Aponta para IP da EC2)                            │
└─────────────────┬────────────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────────────┐
│   🔐 AWS EC2 - Ubuntu                                │
│   ┌────────────────────────────────────────────┐    │
│   │  Nginx :443 (HTTPS)                        │    │
│   │  - Certificado Let's Encrypt               │    │
│   │  - Proxy Reverso                           │    │
│   │  - Headers de Segurança                    │    │
│   └──────────────┬─────────────────────────────┘    │
│                  │ HTTP (local)                      │
│   ┌──────────────▼─────────────────────────────┐    │
│   │  Spring Boot :8080                         │    │
│   │  - API REST                                │    │
│   │  - JWT Authentication                      │    │
│   │  - CORS Configurado                        │    │
│   └──────────────┬─────────────────────────────┘    │
│                  │                                    │
│   ┌──────────────▼─────────────────────────────┐    │
│   │  PostgreSQL :5432                          │    │
│   │  - Database sge_app_db                     │    │
│   └────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## 🆘 TROUBLESHOOTING

### Problema: "Address already in use" (Porta 80 ou 443)

```bash
# Descobrir o que está usando
sudo netstat -tulpn | grep -E ':(80|443)'

# Matar processos
sudo fuser -k 80/tcp
sudo fuser -k 443/tcp

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Problema: Nginx não inicia

```bash
# Verificar erros de configuração
sudo nginx -t

# Ver logs de erro
sudo journalctl -u nginx -n 50

# Status do serviço
sudo systemctl status nginx
```

### Problema: Spring Boot não responde

```bash
# Verificar se está rodando
sudo systemctl status sge-app

# Ver logs
sudo journalctl -u sge-app -n 100

# Testar porta local
curl http://localhost:8080/actuator/health

# Reiniciar
sudo systemctl restart sge-app
```

### Problema: Certificado não é gerado

```bash
# Verificar DNS
nslookup sge-app.duckdns.org
dig sge-app.duckdns.org

# Verificar portas abertas no Security Group
# AWS Console → EC2 → Security Groups

# Tentar novamente com verbose
sudo certbot certonly --standalone -d sge-app.duckdns.org --verbose
```

### Problema: Frontend ainda dá erro de SSL

1. **Limpar cache do navegador:** `Ctrl+Shift+Del`
2. **Testar em aba anônima**
3. **Verificar certificado:**
   ```bash
   curl -vI https://sge-app.duckdns.org
   ```
4. **Verificar console do navegador (F12)**

### Problema: CORS Error

O CORS já está configurado no `SecurityConfig.java` para permitir todas as origens (`*`). Se ainda houver erro:

1. Verifique se o Nginx está passando os headers corretamente
2. Adicione no Nginx:
   ```nginx
   add_header Access-Control-Allow-Origin * always;
   add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
   add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
   ```

---

## 📝 CHECKLIST FINAL

- [ ] Security Group com portas 80, 443, 22 abertas
- [ ] Certbot instalado
- [ ] Certificado SSL gerado para `sge-app.duckdns.org`
- [ ] Nginx instalado e configurado como proxy reverso
- [ ] Nginx rodando (porta 443 HTTPS)
- [ ] Spring Boot configurado (porta 8080 HTTP local)
- [ ] Spring Boot rodando como serviço systemd
- [ ] Frontend `.env` configurado: `VITE_API_URL=https://sge-app.duckdns.org`
- [ ] Renovação automática configurada no crontab
- [ ] Testado: `https://sge-app.duckdns.org/actuator/health` retorna UP
- [ ] Testado: Login no frontend funciona sem erro de SSL
- [ ] Logs monitorados: `sudo journalctl -u sge-app -f`

---

## 🎯 COMANDOS ÚTEIS

```bash
# Ver status de todos os serviços
sudo systemctl status nginx
sudo systemctl status sge-app

# Reiniciar serviços
sudo systemctl restart nginx
sudo systemctl restart sge-app

# Ver logs em tempo real
sudo journalctl -u sge-app -f
sudo tail -f /var/log/nginx/sge-app-access.log

# Verificar certificado
sudo certbot certificates

# Renovar certificado manualmente
sudo certbot renew

# Testar API
curl https://sge-app.duckdns.org/actuator/health
```

---

## 📞 SUPORTE

Se precisar de ajuda adicional:

1. **Logs do Spring Boot:** `sudo journalctl -u sge-app -n 100`
2. **Logs do Nginx:** `sudo tail -100 /var/log/nginx/sge-app-error.log`
3. **Testar certificado:** `openssl s_client -connect sge-app.duckdns.org:443`
4. **Verificar conectividade:** `telnet sge-app.duckdns.org 443`

---

## 🎉 CONCLUSÃO

Após seguir todos os passos, você terá:

✅ **Certificado SSL válido** (Let's Encrypt)
✅ **HTTPS funcionando** sem avisos de segurança
✅ **Frontend acessando backend** via HTTPS
✅ **Renovação automática** do certificado
✅ **Logs centralizados** via journald
✅ **Sistema pronto para produção**

**Boa apresentação! 🚀**

---

**Documentação criada em:** 15/12/2025
**Projeto:** PentaChaos - Sistema de Gerenciamento Empresarial (SGE)
**Equipe:** Projeto Integrador IV - SENAI

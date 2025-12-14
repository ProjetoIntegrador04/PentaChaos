# 🚀 Guia de Deploy - PentaChaos

## 📋 Resumo da Configuração

**URL do Backend em Produção:** `https://sge-app.duckdns.org`

---

## 🔄 Arquivos Atualizados

### ✅ Mobile (React Native + Expo)

**Arquivo:** `integrador-mobile/.env`
```env
EXPO_PUBLIC_API_URL=https://sge-app.duckdns.org
```

**Como usar:**
```bash
# 1. Certifique-se de que o .env está configurado
cd integrador-mobile
cat .env

# 2. Reinicie o Expo
npx expo start --clear

# 3. Para build de produção
eas build --platform android --profile production
eas build --platform ios --profile production
```

---

### ✅ Frontend Web (React + Vite)

**Arquivo:** `frontend/frontProject/.env`
```env
VITE_API_URL=https://sge-app.duckdns.org
```

**Como fazer build:**
```bash
# 1. Build para produção
cd frontend/frontProject
npm run build

# 2. Preview local (testa com URL de produção)
npm run preview

# 3. Deploy (exemplo com Vercel)
vercel --prod
```

---

## 🧪 Como Testar

### Teste 1: Verificar se a API está respondendo

```bash
# PowerShell
curl https://sge-app.duckdns.org/api/v1/users

# Deve retornar: 401 Unauthorized (porque não tem token)
# Isso é BOM! Significa que a API está respondendo
```

### Teste 2: Testar Login

```bash
# PowerShell
$body = @{
    username = "eliezer"
    password = "123456"
} | ConvertTo-Json

curl -Method POST -Uri "https://sge-app.duckdns.org/api/v1/auth/login" `
     -ContentType "application/json" `
     -Body $body

# Deve retornar: accessToken e refreshToken
```

### Teste 3: Testar Mobile

1. Abra o app no celular
2. Tente fazer login
3. Verifique nos logs do Expo:
   ```
   📤 REQUEST INTERCEPTOR
   URL: https://sge-app.duckdns.org/api/v1/auth/login
   ```

---

## ⚠️ Troubleshooting

### Problema: "Network request failed"

**Causa:** App está tentando acessar `localhost`

**Solução:**
```bash
# 1. Verifique o .env
cat integrador-mobile/.env

# 2. Limpe o cache do Expo
npx expo start --clear

# 3. Reinstale o app no celular
```

---

### Problema: "CORS error" no frontend

**Causa:** Backend não está configurado para aceitar requisições do domínio do frontend

**Solução:** Atualizar `SecurityConfig.java`
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",
        "https://pentachaos.vercel.app", // Adicione o domínio do frontend
        "https://sge-app.duckdns.org"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

### Problema: "SSL certificate error"

**Causa:** Certificado SSL não está configurado ou expirou

**Solução:**
1. Verifique o certificado: https://www.ssllabs.com/ssltest/analyze.html?d=sge-app.duckdns.org
2. Renove o certificado (Let's Encrypt):
   ```bash
   sudo certbot renew
   ```

---

## 🔐 Segurança em Produção

### ✅ Checklist de Segurança

- [ ] HTTPS ativo (SSL/TLS)
- [ ] JWT_SECRET diferente do desenvolvimento
- [ ] Senhas de database fortes
- [ ] CORS configurado corretamente
- [ ] Logs de erros não expõem dados sensíveis
- [ ] Rate limiting configurado
- [ ] Firewall ativo na VM

### 🔑 Variáveis Sensíveis

**NUNCA commitar no Git:**
```
❌ .env (com valores de produção)
❌ application.properties (com senhas)
❌ Chaves privadas
❌ Certificados SSL
```

**Usar:**
```
✅ Variáveis de ambiente do sistema
✅ Secrets do GitHub/Railway
✅ Vault (HashiCorp Vault)
```

---

## 📊 Monitoramento

### Logs do Backend

```bash
# SSH na VM
ssh usuario@sge-app.duckdns.org

# Ver logs em tempo real
tail -f /var/log/sge-app/application.log

# Buscar erros
grep -i "error" /var/log/sge-app/application.log
```

### Métricas

- **Uptime:** https://uptime.betterstack.com/
- **Logs:** Sentry, LogRocket
- **Performance:** New Relic, DataDog

---

## 🚀 Fluxo de Deploy Completo

```bash
# 1. Atualizar código
git pull origin main

# 2. Build do backend
cd backend/sge-app
./mvnw clean package -DskipTests

# 3. Reiniciar serviço
sudo systemctl restart sge-app

# 4. Build do frontend
cd frontend/frontProject
npm run build
vercel --prod

# 5. Build do mobile
cd integrador-mobile
eas build --platform all --profile production

# 6. Verificar se está funcionando
curl https://sge-app.duckdns.org/actuator/health
```

---

## 📞 Suporte

- **Documentação:** [README.md](../README.md)
- **API Endpoints:** [docs/api-docs.md](api-docs.md)
- **Issues:** https://github.com/ProjetoIntegrador04/PentaChaos/issues

---

## 🎯 Próximos Passos

1. ✅ URLs atualizadas
2. ⏳ Testar login no mobile
3. ⏳ Testar CORS no frontend
4. ⏳ Configurar CI/CD (GitHub Actions)
5. ⏳ Monitoramento e alertas

---

**Data da última atualização:** 14/12/2025  
**Versão da API:** v1.0.0  
**URL de Produção:** https://sge-app.duckdns.org

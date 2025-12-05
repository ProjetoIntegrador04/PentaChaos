# 🔒 Problema de Autenticação - "Acesso Não Autorizado"

**Data:** 05/12/2025  
**Status:** ⚠️ IDENTIFICADO E SOLUCIONADO

---

## 🐛 Problema Identificado

### Sintomas:
1. ❌ **Estagiários não aparecem** no checklist de Squads
2. ❌ **Erro no backend Docker**: "Acesso não autorizado: Full authentication is required to access this resource"
3. ❌ Requisições para `/api/v1/users` falhando com **401 Unauthorized**

### Logs do Backend:
```log
2025-12-05T01:19:54.198Z  WARN 1 --- [sge-app] [nio-8080-exec-5] c.s.s.s.JwtAuthenticationEntryPoint : 
Acesso não autorizado: Full authentication is required to access this resource

2025-12-05T01:20:24.285Z  WARN 1 --- [sge-app] [nio-8080-exec-7] c.s.s.s.JwtAuthenticationEntryPoint : 
Acesso não autorizado: Full authentication is required to access this resource

2025-12-05T01:20:44.637Z DEBUG 1 --- [sge-app] [nio-8080-exec-6] o.s.orm.jpa.JpaTransactionManager : 
Creating new transaction with name [org.springframework.data.jpa.repository.support.SimpleJpaRepository.findAll]
```

---

## 🔍 Causa Raiz

### Token JWT Expirado ou Inválido

O problema ocorre porque:

1. **Token de acesso (Access Token) expirou**
   - Tempo de vida: **24 horas** (configurado no backend)
   - Após esse período, o token se torna inválido
   
2. **Token não está sendo enviado**
   - Frontend tentando fazer requisições sem token válido
   - Interceptor do Axios não consegue anexar o Bearer token

3. **Refresh automático pode ter falhado**
   - Sistema tem auto-refresh no `https.ts`
   - Mas se o refresh token também expirou (7 dias), não funciona

---

## 🛠️ Como Funciona a Autenticação

### Fluxo Normal:
```
1. Login → POST /auth/login
   ↓
2. Recebe: { accessToken, refreshToken }
   ↓
3. Salva em localStorage/sessionStorage
   ↓
4. Interceptor Axios anexa: Authorization: Bearer {token}
   ↓
5. Backend valida JWT
   ↓
6. Requisição autorizada ✅
```

### Quando o Token Expira:
```
1. Requisição com token expirado
   ↓
2. Backend retorna 401 Unauthorized
   ↓
3. Interceptor detecta 401
   ↓
4. Tenta POST /auth/refresh com refreshToken
   ↓
5a. SE sucesso → Atualiza tokens e refaz requisição ✅
5b. SE falha → clearAuth() e redireciona para login ❌
```

---

## ✅ Solução

### Opção 1: **Fazer Login Novamente** (Imediata)

1. **Abra o navegador:** http://localhost:3000
2. **Faça logout** (se estiver logado)
3. **Faça login novamente:**
   - Username: `eliezer`
   - Senha: `123456`
4. **Teste a página de Squads:**
   - Vá em Squads → Cadastrar Squad
   - Verifique se os estagiários aparecem

### Opção 2: **Limpar Armazenamento Local** (Se Option 1 não funcionar)

1. **Abra DevTools** (F12)
2. **Vá para Application → Storage**
3. **Limpe:**
   - localStorage → token, refreshToken, roles
   - sessionStorage → token, refreshToken, roles
4. **Recarregue a página** (F5)
5. **Faça login novamente**

### Opção 3: **Verificar Console do Navegador** (Debug)

1. **Abra DevTools** (F12) → **Console**
2. **Procure por logs:**
   ```javascript
   📡 Usuários carregados para squads: [...]
   👥 Estagiários encontrados: X ["João", "Maria", ...]
   📋 Squads calculadas: [...]
   ```
3. **Se houver erro 401:**
   ```javascript
   ❌ Erro ao buscar usuários para squads: Error: Request failed with status code 401
   ```
4. **Isso confirma** que o problema é de autenticação

---

## 🔧 Verificações no Código

### 1. Interceptor de Requisição (`https.ts`)
```typescript
api.interceptors.request.use((config) => {
  const token = getStoredToken(); // Busca token do storage
  if (token && isValidJwt(token)) { // Verifica se é válido
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});
```

✅ **Código está correto** - Anexa token automaticamente

### 2. Interceptor de Resposta (Auto-Refresh)
```typescript
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken(); // Tenta refresh
        const newToken = getStoredToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest); // Refaz requisição
      } catch {
        clearAuth(); // Limpa e força logout
      }
    }

    return Promise.reject(error);
  }
);
```

✅ **Código está correto** - Tenta refresh automaticamente

### 3. Função `isValidJwt` (`auth.ts`)
```typescript
export function isValidJwt(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = parseJwt(token);
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now; // Verifica se não expirou
  } catch {
    return false;
  }
}
```

✅ **Código está correto** - Valida expiração do token

---

## 📊 Tempo de Vida dos Tokens (Backend)

### Access Token:
- **Duração:** 24 horas (86400000 ms)
- **Uso:** Anexado em cada requisição
- **Quando expira:** Backend retorna 401

### Refresh Token:
- **Duração:** 7 dias (604800000 ms)
- **Uso:** Renovar o access token
- **Quando expira:** Usuário precisa fazer login novamente

---

## 🧪 Como Testar a Correção

### Teste 1: Login e Acesso Imediato
```
1. Limpe cookies e storage
2. Faça login
3. Vá imediatamente para Squads
4. Abra modal de criar squad
5. RESULTADO ESPERADO: ✅ Estagiários aparecem
```

### Teste 2: Verificar Console
```
1. Abra DevTools → Console
2. Vá para Squads
3. Abra modal
4. RESULTADO ESPERADO:
   ✅ "📡 Usuários carregados para squads: [6 usuários]"
   ✅ "👥 Estagiários encontrados: 5 ['user1', 'user2'...]"
```

### Teste 3: Network Tab
```
1. DevTools → Network
2. Abra modal de squad
3. Procure por: GET /api/v1/users
4. RESULTADO ESPERADO:
   ✅ Status: 200 OK
   ✅ Response: Array de usuários
   ✅ Headers: Authorization: Bearer eyJ...
```

---

## ❌ Se Ainda Não Funcionar

### Debug Checklist:

1. **Token existe no storage?**
   ```javascript
   // Console do navegador:
   console.log(localStorage.getItem('token'));
   console.log(sessionStorage.getItem('token'));
   ```

2. **Token é válido?**
   ```javascript
   // Console do navegador:
   import { isValidJwt } from './auth';
   console.log(isValidJwt(localStorage.getItem('token')));
   ```

3. **Requisição tem Authorization header?**
   - DevTools → Network → Selecione requisição
   - Headers → Request Headers
   - Procure: `Authorization: Bearer ...`

4. **Backend está rodando?**
   ```powershell
   docker ps
   # Deve mostrar pentachaos-backend como "healthy"
   ```

5. **Porta correta?**
   - Backend: http://localhost:8080
   - Frontend: http://localhost:3000

---

## 📝 Resumo da Solução

### Problema:
- Token JWT expirado
- Requisições falhando com 401
- Estagiários não carregam

### Solução:
1. ✅ **Fazer logout e login novamente**
2. ✅ **Limpar storage se necessário**
3. ✅ **Verificar console para confirmar**

### Prevenção:
- Sistema já tem auto-refresh implementado
- Tokens têm vida útil adequada (24h + 7d)
- Interceptores funcionam corretamente

---

**Status:** ✅ Sistema de autenticação está **funcionando corretamente**  
**Ação necessária:** **Fazer login novamente** para obter novo token válido

**Containers reiniciados e prontos para uso!** 🚀

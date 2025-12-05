# 📱 Integração Mobile - Backend

## 🎉 Implementação Concluída!

Este documento descreve toda a integração realizada entre o aplicativo mobile React Native (Expo) e o backend Spring Boot.

---

## 📂 Estrutura Criada

```
integrador-mobile/
├── services/              # ✅ Serviços de comunicação com backend
│   ├── api.ts            # Configuração Axios + Interceptors JWT
│   ├── auth.service.ts   # Autenticação (login, logout, refresh)
│   ├── clockentry.service.ts  # Registro de ponto com geolocalização
│   ├── task.service.ts   # CRUD de tarefas
│   └── user.service.ts   # Gerenciamento de usuários
│
├── types/                 # ✅ Definições TypeScript
│   ├── auth.types.ts     # Tipos de autenticação e usuário
│   ├── clockentry.types.ts  # Tipos de registro de ponto
│   └── task.types.ts     # Tipos de tarefas
│
├── utils/                 # ✅ Utilitários
│   ├── constants.ts      # Constantes (API_URL, endpoints)
│   └── storage.ts        # Helpers SecureStore/AsyncStorage
│
├── context/               # ✅ Gerenciamento de estado global
│   └── AuthContext.tsx   # Context de autenticação
│
└── app/                   # ✅ Telas atualizadas
    ├── index.tsx         # Login integrado com backend
    ├── clockentry.tsx    # Nova tela de registro de ponto
    └── _layout.tsx       # AuthProvider wrapper
```

---

## 🔧 Funcionalidades Implementadas

### 1. **Autenticação JWT Completa** ✅

**Arquivos:** `auth.service.ts`, `AuthContext.tsx`, `app/index.tsx`

#### Recursos:
- ✅ Login com email/username e senha
- ✅ Armazenamento seguro de tokens (SecureStore)
- ✅ Refresh automático de token quando expira
- ✅ Context API para estado global do usuário
- ✅ Logout com limpeza de dados

#### Uso:
```typescript
import { useAuth } from '../context/AuthContext';

const { user, login, logout, isAuthenticated, isLoading } = useAuth();

// Login
await login({
  usernameOrEmail: 'user@example.com',
  password: 'senha123'
});

// Logout
await logout();
```

---

### 2. **Registro de Ponto com Geolocalização** ✅

**Arquivos:** `clockentry.service.ts`, `app/clockentry.tsx`

#### Recursos:
- ✅ Captura automática de GPS (latitude/longitude)
- ✅ Registro de ENTRY, EXIT, LUNCH_START, LUNCH_END
- ✅ Visualização no mapa (Google Maps)
- ✅ Histórico de pontos registrados
- ✅ Detecção automática do próximo ponto a bater

#### Uso:
```typescript
import clockEntryService from '../services/clockentry.service';

// Registrar entrada
await clockEntryService.registrarPonto('ENTRY');

// Buscar histórico
const historico = await clockEntryService.buscarHistorico();

// Verificar permissão de localização
const temPermissao = await clockEntryService.verificarPermissaoLocalizacao();
```

---

### 3. **Gerenciamento de Tarefas** ✅

**Arquivos:** `task.service.ts`

#### Recursos:
- ✅ Listar todas as tarefas do usuário
- ✅ Criar nova tarefa (ADMIN)
- ✅ Atualizar tarefa (ADMIN)
- ✅ Deletar tarefa (ADMIN)
- ✅ Filtros por status (PENDENTE, EM_ANDAMENTO, CONCLUIDA)

#### Uso:
```typescript
import taskService from '../services/task.service';

// Listar tarefas
const tasks = await taskService.getAllTasks();

// Criar tarefa (apenas ADMIN)
const newTask = await taskService.createTask({
  titulo: 'Nova Tarefa',
  descricao: 'Descrição',
  prioridade: 'ALTA',
  responsavel: 'username_estagiario',
  status: 'PENDENTE'
});

// Filtrar por status
const pendentes = taskService.getPendingTasks(tasks);
const emAndamento = taskService.getInProgressTasks(tasks);
```

---

### 4. **Gerenciamento de Usuários** ✅

**Arquivos:** `user.service.ts`

#### Recursos:
- ✅ Buscar perfil do usuário logado
- ✅ Atualizar dados do perfil
- ✅ Verificar roles (ADMIN/USER)

#### Uso:
```typescript
import userService from '../services/user.service';

// Buscar meu perfil
const profile = await userService.getMyProfile();

// Atualizar perfil
await userService.updateProfile({
  email: 'novo@email.com'
});

// Verificar se é admin
if (userService.isAdmin(user)) {
  // Exibir funcionalidades de admin
}
```

---

## 🚀 Como Usar

### **Passo 1: Configurar IP do Backend**

⚠️ **IMPORTANTE:** Alterar o IP no arquivo `utils/constants.ts`

```typescript
// utils/constants.ts
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://192.168.1.XXX:8080'  // ← ALTERAR AQUI!
  : 'https://sua-api-producao.com';
```

**Como descobrir seu IP:**
```bash
# Windows
ipconfig

# Procure por "IPv4" na rede Wi-Fi
# Exemplo: 192.168.1.100
```

---

### **Passo 2: Configurar CORS no Backend**

Adicionar o IP do celular/emulador no backend:

```java
// backend SecurityConfig.java
configuration.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:3000",
    "exp://192.168.1.XXX:8081"  // ← Adicionar IP do Expo
));
```

---

### **Passo 3: Executar o Backend**

```bash
cd backend/sge-app
docker-compose up --build

# Backend rodando em: http://192.168.1.XXX:8080
```

---

### **Passo 4: Executar o Mobile**

```bash
cd integrador-mobile
npx expo start

# Escolher:
# a - Android
# i - iOS
# w - Web
```

---

## 🔐 Fluxo de Autenticação

### 1. **Login** (app/index.tsx)
```
Usuário digita credenciais
    ↓
authService.login() → POST /auth/login
    ↓
Backend retorna { accessToken, refreshToken }
    ↓
Tokens salvos no SecureStore
    ↓
userService.getMyProfile() → GET /api/v1/users/me
    ↓
Dados do usuário salvos no Context
    ↓
Navegação para /home
```

### 2. **Requisições Autenticadas**
```
api.get('/api/v1/tasks')
    ↓
Interceptor adiciona: Authorization: Bearer {token}
    ↓
Backend valida JWT
    ↓
Retorna dados
```

### 3. **Token Expirado (Refresh Automático)**
```
api.get('/api/v1/tasks')
    ↓
Backend retorna 401 Unauthorized
    ↓
Interceptor detecta 401
    ↓
POST /auth/refresh com refreshToken
    ↓
Novo accessToken recebido
    ↓
Retry da requisição original
    ↓
Sucesso!
```

---

## 📍 Registro de Ponto - Fluxo Completo

### Tela: `app/clockentry.tsx`

1. **Solicitar Permissão de Localização**
2. **Obter GPS Atual** (latitude, longitude, precisão)
3. **Exibir no Mapa** (Google Maps)
4. **Botão Dinâmico:**
   - Último ponto: ENTRY → Próximo: LUNCH_START
   - Último ponto: LUNCH_START → Próximo: LUNCH_END
   - Último ponto: LUNCH_END → Próximo: EXIT
   - Último ponto: EXIT → Próximo: ENTRY
5. **Enviar ao Backend:**
```json
POST /api/v1/clockentries
{
  "tipo": "ENTRY",
  "timestamp": "2025-11-13T08:30:00",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "precisao": 10.5,
  "fonte": "MOBILE_ANDROID",
  "deviceId": "device123"
}
```
6. **Exibir Histórico** (últimos 5 registros)

---

## 🧪 Testando a Integração

### 1. **Testar Login**
```
1. Inicie o backend (Docker)
2. Inicie o Expo
3. Na tela de login, digite:
   - Email: admin@example.com
   - Senha: admin123
4. Clique em "Entrar"
5. Deve navegar para /home
```

### 2. **Testar Registro de Ponto**
```
1. Na tela principal, adicione um botão:
   <TouchableOpacity onPress={() => router.push('/clockentry')}>
     <Text>Bater Ponto</Text>
   </TouchableOpacity>

2. Clique no botão
3. Aceite permissão de localização
4. Clique em "Entrada"
5. Verifique no backend: logs ou banco de dados
```

### 3. **Testar Tarefas**
```typescript
// Adicione em qualquer tela:
import taskService from '../services/task.service';

useEffect(() => {
  const loadTasks = async () => {
    try {
      const tasks = await taskService.getAllTasks();
      console.log('Tarefas:', tasks);
    } catch (error) {
      console.error('Erro:', error);
    }
  };
  loadTasks();
}, []);
```

---

## 🐛 Solução de Problemas

### Erro: "Network Error" ou "Connection refused"

**Causa:** IP do backend incorreto ou backend não está rodando

**Solução:**
1. Verificar se o backend está ativo: `http://192.168.1.XXX:8080/actuator/health`
2. Confirmar IP em `utils/constants.ts`
3. Verificar se celular e PC estão na mesma rede Wi-Fi

---

### Erro: "401 Unauthorized" em todas as requisições

**Causa:** Token JWT inválido ou expirado

**Solução:**
1. Fazer logout e login novamente
2. Verificar se o backend está configurado corretamente
3. Limpar cache do app: `npx expo start -c`

---

### Erro: "Permissão de localização negada"

**Causa:** Usuário negou permissão de GPS

**Solução:**
1. Android: Configurações → Apps → Expo Go → Permissões → Localização → Permitir
2. iOS: Ajustes → Privacidade → Localização → Expo Go → Sempre

---

### Erro: "CORS Policy"

**Causa:** Backend não permite requisições do mobile

**Solução:**
Adicionar origem no SecurityConfig.java:
```java
configuration.setAllowedOrigins(List.of(
    "exp://192.168.1.XXX:8081",  // Expo
    "http://192.168.1.XXX:8081"  // Metro bundler
));
```

---

## 📚 Próximos Passos Sugeridos

### Telas a Integrar:

1. **Dashboard (home.tsx)**
   - Substituir dados mockados por `taskService.getAllTasks()`
   - Buscar estatísticas de frequência do backend

2. **Tarefas (tarefas.tsx)**
   - Listar tarefas reais
   - Adicionar criação/edição (para ADMINs)
   - Filtros por status

3. **Perfil (usuarios.tsx)**
   - Buscar dados do `userService.getMyProfile()`
   - Permitir edição de perfil

4. **Notificações (notificacoes.tsx)**
   - Integrar com endpoint de notificações do backend

---

## 📦 Dependências Instaladas

Todas já estão no `package.json`:

```json
{
  "axios": "^1.13.2",                         // HTTP client
  "@react-native-async-storage/async-storage": "2.2.0",  // Cache local
  "expo-secure-store": "~15.0.7",             // Armazenamento seguro
  "expo-location": "~19.0.0",                 // GPS
  "react-native-maps": "1.20.1",              // Mapas
  "expo-router": "~6.0.7"                     // Navegação
}
```

---

## 🎯 Resumo Final

✅ **Arquitetura de serviços** implementada e funcionando
✅ **Autenticação JWT** completa com refresh automático
✅ **Registro de ponto** com geolocalização
✅ **Gerenciamento de tarefas** (CRUD completo)
✅ **Context API** para estado global
✅ **TypeScript** tipado em todos os serviços
✅ **Tela de login** integrada
✅ **Tela de registro de ponto** criada

---

## 💡 Dicas de Desenvolvimento

1. **Sempre verifique o console:**
   ```bash
   # Os services logam tudo
   ✅ Login realizado com sucesso
   📤 API REQUEST: POST /auth/login
   ✅ API RESPONSE: 200 /auth/login
   ```

2. **Use o AuthContext em qualquer tela:**
   ```typescript
   const { user, isAuthenticated } = useAuth();
   
   if (!isAuthenticated) {
     return <Text>Não autenticado</Text>;
   }
   
   return <Text>Olá, {user?.username}!</Text>;
   ```

3. **Tratamento de erros:**
   ```typescript
   try {
     await taskService.createTask(task);
   } catch (error: any) {
     if (error.response?.status === 403) {
       Alert.alert('Erro', 'Você não tem permissão para esta ação');
     }
   }
   ```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console (mobile e backend)
2. Confirme que o IP está correto
3. Teste endpoints diretamente: `http://192.168.1.XXX:8080/actuator/health`
4. Limpe o cache: `npx expo start -c`

---

**Desenvolvido com ❤️ para o projeto PentaChaos**

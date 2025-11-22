# SGE Mobile - Sistema de Gestão Empresarial (Mobile)

Aplicativo mobile desenvolvido com React Native e Expo para o Sistema de Gestão Empresarial.

## 🚀 Tecnologias

- **Framework**: React Native 0.81.4
- **Platform**: Expo SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: 
  - SecureStore (iOS/Android - encrypted)
  - AsyncStorage (Web - LocalStorage)

## 📋 Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Backend rodando em `http://localhost:8080`

## 🔧 Instalação

1. **Instale as dependências:**

```bash
npm install
```

2. **Configure a URL da API:**

Edite o arquivo `integrador-mobile/utils/constants.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:8080'; // Backend local
// ou
export const API_BASE_URL = 'http://SEU_IP:8080'; // Para testar em dispositivo físico
```

3. **Inicie o aplicativo:**

```bash
npx expo start
```

## 📱 Executando o App

Após executar `npx expo start`, você pode:

- Pressionar `w` - Abrir no navegador web
- Pressionar `a` - Abrir no emulador Android
- Pressionar `i` - Abrir no simulador iOS
- Escanear o QR Code com o app Expo Go (em dispositivo físico)

## 🏗️ Estrutura do Projeto

```
integrador-mobile/
├── app/                          # Navegação (Expo Router)
│   ├── (tabs)/                  # Abas principais
│   │   ├── home.tsx            # Dashboard
│   │   ├── notificacoes.tsx    # Notificações
│   │   ├── ranking.tsx         # Ranking
│   │   ├── squads.tsx          # Squads
│   │   ├── usuarios.tsx        # Perfil do usuário
│   │   └── uusuarios.tsx       # Controle de usuários (ADMIN)
│   ├── cadastrarUsuarioModal.tsx  # Modal de cadastro
│   ├── _layout.tsx             # Layout global
│   └── index.tsx               # Tela inicial/Login
├── components/                  # Componentes reutilizáveis
│   ├── CustomTabBar.tsx        # Barra de navegação customizada
│   └── ui/                     # Componentes de UI
├── context/                     # Contextos React
│   └── AuthContext.tsx         # Contexto de autenticação
├── services/                    # Serviços de API
│   ├── api.ts                  # Configuração do Axios
│   ├── auth.service.ts         # Serviço de autenticação
│   └── user.service.ts         # Serviço de usuários
├── utils/                       # Utilitários
│   ├── constants.ts            # Constantes e endpoints
│   └── storage.ts              # Storage abstrato (cross-platform)
├── types/                       # Tipos TypeScript
│   └── auth.types.ts           # Tipos de autenticação
└── constants/
    └── theme.ts                # Tema e cores
```

## 🔐 Autenticação

### Login

O app utiliza JWT para autenticação:

```typescript
// AuthContext fornece:
const { user, isLoading, isAuthenticated, login, logout } = useAuth();

// Login
await login({
  usernameOrEmail: 'john.doe',
  password: 'password123'
});
```

### Storage Cross-Platform

O app usa storage específico para cada plataforma:

- **iOS/Android**: SecureStore (criptografado)
- **Web**: AsyncStorage (LocalStorage)

```typescript
import storage from './utils/storage';

// Salvar dados
await storage.setItem('key', 'value');

// Recuperar dados
const value = await storage.getItem('key');

// Remover dados
await storage.removeItem('key');
```

## 📡 Integração com Backend

### Configuração da API

O arquivo `services/api.ts` configura o Axios:

```typescript
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(async (config) => {
  const token = await storage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints Utilizados

#### Autenticação

**Login:**
```typescript
authService.login({
  usernameOrEmail: 'john.doe',
  password: 'password123'
});
// POST /auth/login
```

**Refresh Token:**
```typescript
authService.refreshToken(refreshToken);
// POST /auth/refresh
```

**Cadastrar Novo Usuário (ADMIN):**
```typescript
// Criar usuário comum
authService.register({
  username: 'newuser',
  email: 'new@example.com',
  password: 'password123',
  fullName: 'New User',
  ra: '123456',
  phoneNumber: '(11) 98765-4321',
  isAdmin: false
});

// Criar coordenador (admin)
authService.register({
  username: 'coord.silva',
  email: 'coord@example.com',
  password: 'password123',
  fullName: 'Coordenador Silva',
  isAdmin: true
});

// POST /auth/register
// Requer: Authorization: Bearer {admin_token}
// Nota: O campo 'squad' não é definido no cadastro. Atribua via atualização posteriormente.
```

#### Usuários

**Perfil do Usuário Logado:**
```typescript
userService.getMyProfile();
// GET /api/v1/users/me
```

**Atualizar Perfil:**
```typescript
userService.updateProfile({
  email: 'newemail@example.com',
  fullName: 'Updated Name'
});
// PUT /api/v1/users/me
```

**Listar Todos os Usuários (ADMIN):**
```typescript
userService.getAllUsers();
// GET /api/v1/users
// Requer: ROLE_ADMIN
```

**Alternar Status (ADMIN):**
```typescript
userService.toggleUserStatus(userId);
// PATCH /api/v1/users/{id}/status
// Requer: ROLE_ADMIN
```

## 👥 Controle de Acesso

### Roles

O app possui dois níveis de acesso:

1. **ROLE_USER** (Usuário Comum)
   - ✅ Ver dashboard
   - ✅ Ver suas tasks
   - ✅ Registrar ponto
   - ✅ Ver notificações
   - ✅ Atualizar próprio perfil
   - ❌ Cadastrar usuários
   - ❌ Gerenciar outros usuários

2. **ROLE_ADMIN** (Coordenador)
   - ✅ Todas as permissões de USER
   - ✅ Cadastrar novos usuários
   - ✅ Visualizar lista de usuários
   - ✅ Editar usuários
   - ✅ Ativar/desativar usuários
   - ✅ Criar/editar tasks
   - ✅ Gerar relatórios

### Verificação de Role no Mobile

```typescript
// No AuthContext, o user contém as roles
const { user } = useAuth();

// Verificar se é ADMIN
const isAdmin = user?.roles?.some(role => role.name === 'ROLE_ADMIN');

// Renderização condicional
{isAdmin && (
  <TouchableOpacity onPress={handleAdminAction}>
    <Text>Ação Admin</Text>
  </TouchableOpacity>
)}
```

### Proteção de Telas

Telas protegidas verificam a role ao carregar:

```typescript
useEffect(() => {
  if (user?.roles) {
    const hasAdminRole = user.roles.some(role => role.name === 'ROLE_ADMIN');
    setIsAdmin(hasAdminRole);
    
    if (!hasAdminRole) {
      Alert.alert(
        'Acesso Negado', 
        'Apenas coordenadores podem acessar esta funcionalidade.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }
}, [user]);
```

## 🎨 Telas Principais

### 1. Login (`app/index.tsx`)
- Login com username/email e senha
- Validação de credenciais
- Armazena tokens JWT
- Redireciona para dashboard

### 2. Dashboard (`app/(tabs)/home.tsx`)
- Visão geral do sistema
- Cards de frequência
- Membros da equipe
- Gráficos

### 3. Perfil (`app/(tabs)/usuarios.tsx`)
- Dados do usuário logado
- Editar perfil
- Logout

### 4. Controle de Usuários (`app/(tabs)/uusuarios.tsx`) - ADMIN ONLY
- Lista de todos os usuários
- Busca e filtros
- Cadastrar novo usuário
- Editar usuários
- Ativar/desativar usuários
- Gerar relatórios

### 5. Modal de Cadastro (`app/cadastrarUsuarioModal.tsx`) - ADMIN ONLY
- Formulário completo de cadastro
- Campos obrigatórios: username, email, senha
- Campos opcionais: nome completo, RA, telefone
- Switch para criar como Coordenador (Admin)
- **Squad não é definido no cadastro** - deve ser atribuído posteriormente
- Validação de dados
- Feedback de sucesso/erro

## 🧪 Desenvolvimento

### Executar em Modo Desenvolvimento

```bash
# Web
npx expo start --web

# Android
npx expo start --android

# iOS
npx expo start --ios

# Limpar cache
npx expo start --clear
```

### Debug

```bash
# Ver logs do dispositivo
npx expo start

# Debug remoto (Chrome DevTools)
# Pressione 'm' no terminal e selecione "Debug remote JS"
```

### Build para Produção

```bash
# Android APK
eas build --platform android

# iOS
eas build --platform ios

# Ambos
eas build --platform all
```

## 🔒 Segurança

### Boas Práticas Implementadas

1. **Tokens armazenados de forma segura**
   - SecureStore (criptografado) em iOS/Android
   - LocalStorage em Web (considerar upgrade para IndexedDB)

2. **Refresh Token automático**
   - Renovação automática antes da expiração
   - Logout automático se refresh falhar

3. **Interceptores de requisição**
   - Token JWT adicionado automaticamente
   - Tratamento de erro 401/403

4. **Validação no frontend**
   - Verificação de roles antes de renderizar
   - Alertas para acessos não autorizados

5. **Nunca expor senhas**
   - Campos `secureTextEntry` para senhas
   - Senhas nunca armazenadas localmente

## ⚠️ Problemas Comuns

### Backend não acessível

**Problema:** Erro "Network Error" ou "Connection refused"

**Solução:**
1. Verifique se o backend está rodando: `docker compose ps`
2. Se testar em dispositivo físico, use o IP da máquina ao invés de `localhost`
3. Configure `API_BASE_URL` em `utils/constants.ts`

```typescript
// Para dispositivo físico na mesma rede
export const API_BASE_URL = 'http://192.168.1.100:8080';
```

### Erro 403 Forbidden

**Problema:** Usuário não tem permissão

**Solução:**
- Verifique se o usuário tem a role correta (`ROLE_ADMIN` para ações administrativas)
- Confirme que o token JWT é válido e não expirou

### Storage não funciona

**Problema:** Erro ao salvar/recuperar dados

**Solução:**
- No iOS/Android: Certifique-se que `expo-secure-store` está instalado
- Na Web: Verifique se cookies/localStorage estão habilitados

## 📝 Scripts Disponíveis

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "test": "jest",
  "lint": "eslint ."
}
```

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Faça commit: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

## 📄 Licença

MIT License

---

**Observação:** Certifique-se de que o backend está rodando em `http://localhost:8080` antes de iniciar o mobile.

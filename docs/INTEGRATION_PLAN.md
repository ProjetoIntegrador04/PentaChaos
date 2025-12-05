# 📋 Plano de Integração Frontend-Backend

**Data:** 04/12/2025  
**Status:** 🚀 Iniciando análise completa  
**Objetivo:** Integrar todas as páginas do frontend com os endpoints do backend

---

## 📊 Análise do Frontend

### ✅ Páginas JÁ INTEGRADAS

1. **Login (Coordinator)** ✅ 100%
   - Endpoint: `POST /auth/login`
   - Funciona com username ou email
   - JWT salvo e gerenciado corretamente

2. **Dashboard (Coordinator)** ✅ 90%
   - Endpoint: `GET /api/v1/users`
   - Mostra usuários agrupados por squad
   - ⚠️ Frequência ainda usa dados mockados

3. **Users (Coordinator)** ✅ 100%
   - Endpoints:
     - `GET /api/v1/users` - Listar
     - `POST /auth/register` - Criar
     - `PUT /api/v1/users/{id}` - Editar
   - CRUD completo funcionando

---

### 🔧 Páginas PARCIALMENTE INTEGRADAS

4. **Squads (Coordinator)** 🟡 50%
   - **Arquivo:** `frontend/frontProject/src/pages/Coordinator/Squads.tsx`
   - **Endpoints Disponíveis:**
     - ✅ `GET /api/v1/squads` - Listar squads
     - ✅ `POST /api/v1/squads` - Criar squad
     - ✅ `PUT /api/v1/squads/{id}` - Editar squad
     - ✅ `DELETE /api/v1/squads/{id}` - Deletar squad
     - ✅ `POST /api/v1/squads/{id}/members` - Adicionar membro
     - ✅ `DELETE /api/v1/squads/{id}/members/{userId}` - Remover membro
     - ✅ `GET /api/v1/squads/user/{userId}` - Squads do usuário
   - **Status Atual:** Já tem estrutura de API, mas pode estar usando o campo `user.squad` (string) em vez da tabela de squads
   - **Ação Necessária:** Verificar se está usando a API correta de squads

5. **Task (Coordinator)** 🟡 70%
   - **Arquivo:** `frontend/frontProject/src/pages/Coordinator/Task.tsx`
   - **Endpoints Disponíveis:**
     - ✅ `GET /api/v1/tasks` - Listar todas (ADMIN)
     - ✅ `POST /api/v1/tasks` - Criar tarefa
     - ✅ `PUT /api/v1/tasks/{id}` - Editar tarefa
     - ✅ `DELETE /api/v1/tasks/{id}` - Deletar tarefa
   - **Status Atual:** Já tem integração, verificar se está completo
   - **Ação Necessária:** Testar e validar todas as operações

6. **Point (Intern)** 🟡 60%
   - **Arquivo:** `frontend/frontProject/src/pages/Intern/Point.tsx`
   - **Endpoints Disponíveis:**
     - ✅ `POST /api/v1/clockentries` - Registrar ponto
     - ✅ `GET /api/v1/clockentries/me/today` - Pontos de hoje
   - **Status Atual:** Tem estrutura para POST, mas pode não estar mostrando pontos do dia
   - **Ação Necessária:** Mostrar histórico de pontos do dia atual

7. **Task (Intern)** 🟡 70%
   - **Arquivo:** `frontend/frontProject/src/pages/Intern/Task.tsx`
   - **Endpoints Disponíveis:**
     - ✅ `GET /api/v1/tasks` - Listar minhas tarefas
     - ✅ `PUT /api/v1/tasks/{id}` - Atualizar status
   - **Status Atual:** Já tem integração para buscar tarefas
   - **Ação Necessária:** Validar atualização de status (PENDENTE → EM_ANDAMENTO → CONCLUIDA)

---

### ❌ Páginas NÃO INTEGRADAS

8. **Frequency (Coordinator)** ❌ 0%
   - **Arquivo:** `frontend/frontProject/src/pages/Coordinator/Frequency.tsx`
   - **Endpoints Necessários:**
     - `GET /api/v1/clockentries/users/{userId}/today` - Pontos de um usuário específico
     - Criar endpoint: `GET /api/v1/clockentries/date/{date}` - Todos os pontos de uma data
   - **Status Atual:** Usa dados mockados
   - **O que mostrar:**
     - Tabela com todos os usuários
     - 4 colunas de pontos (Entrada, Almoço Início, Almoço Fim, Saída)
     - Navegação por data (anterior/próximo dia)
     - Busca por nome de usuário
     - Status ATIVO/INATIVO do usuário
   - **Ação Necessária:** Integrar busca de pontos por data

9. **Frequency (Intern)** ❌ 0%
   - **Arquivo:** `frontend/frontProject/src/pages/Intern/Frequency.tsx`
   - **Endpoints Disponíveis:**
     - ✅ `GET /api/v1/clockentries/me/history` - Meu histórico
   - **Status Atual:** Usa dados mockados
   - **O que mostrar:**
     - Histórico de pontos agrupados por dia
     - Navegação por mês
     - 4 pontos por dia: ENTRY, BREAK_START, BREAK_END, EXIT
     - Botão "Solicitar Ajuste" para cada dia
   - **Ação Necessária:** Buscar histórico real do usuário logado

10. **Home (Intern)** ❌ 0%
    - **Arquivo:** `frontend/frontProject/src/pages/Intern/Home.tsx`
    - **Endpoints Necessários:**
      - Criar: `GET /api/v1/users/me` - Dados do usuário logado
      - ✅ `GET /api/v1/tasks` - Minhas próximas tarefas
      - ✅ `GET /api/v1/clockentries/me/today` - Pontos de hoje
    - **Status Atual:** Hardcoded "Olá, Pablo!"
    - **O que mostrar:**
      - Nome real do usuário logado
      - Relógio ao vivo
      - Widget principal: "Registrar Ponto Agora"
      - Cards: Minhas Atividades, Minha Frequência, Configurações
    - **Ação Necessária:** Buscar dados do usuário logado

11. **Settings (Coordinator)** ❌ 0%
    - **Arquivo:** `frontend/frontProject/src/pages/Coordinator/Settings.tsx`
    - **Endpoints Disponíveis:**
      - ✅ `GET /api/v1/users/{id}` - Buscar dados
      - ✅ `PUT /api/v1/users/{id}` - Atualizar perfil
      - Criar: `PUT /api/v1/users/{id}/password` - Alterar senha
    - **Status Atual:** Provavelmente vazio ou mockado
    - **O que mostrar:**
      - Editar perfil (nome, email, telefone, RA)
      - Alterar senha
      - Configurações do sistema
    - **Ação Necessária:** Criar página de configurações

12. **Settings2 (Intern)** ❌ 0%
    - **Arquivo:** `frontend/frontProject/src/pages/Intern/Settings2.tsx`
    - **Endpoints Disponíveis:**
      - ✅ `GET /api/v1/users/{id}` - Buscar dados
      - ✅ `PUT /api/v1/users/{id}` - Atualizar perfil
      - Criar: `PUT /api/v1/users/{id}/password` - Alterar senha
    - **Status Atual:** Provavelmente vazio ou mockado
    - **O que mostrar:**
      - Editar perfil pessoal
      - Alterar senha
      - Foto de perfil
      - Preferências
    - **Ação Necessária:** Criar página de configurações

---

## 🎯 Ordem de Integração Sugerida

### FASE 1: COMPLETAR INTEGRAÇÕES PARCIAIS (Mais Fácil)
1. ✅ **Task (Coordinator)** - Validar CRUD completo
2. ✅ **Task (Intern)** - Validar atualização de status
3. ✅ **Point (Intern)** - Mostrar pontos do dia
4. ✅ **Squads (Coordinator)** - Verificar integração com API de squads

### FASE 2: PÁGINAS DE FREQUÊNCIA (Média Dificuldade)
5. 🔄 **Dashboard (Coordinator)** - Integrar frequência real (já começamos)
6. 🔄 **Frequency (Coordinator)** - Buscar pontos por data
7. 🔄 **Frequency (Intern)** - Buscar histórico pessoal

### FASE 3: PÁGINAS DE CONFIGURAÇÃO E HOME (Mais Simples)
8. 🏠 **Home (Intern)** - Buscar dados do usuário logado
9. ⚙️ **Settings (Coordinator)** - Criar página de configurações
10. ⚙️ **Settings2 (Intern)** - Criar página de configurações

---

## 🔑 Endpoints Backend Disponíveis

### 🔐 Autenticação (`/auth`)
- `POST /auth/login` - Login com username ou email ✅
- `POST /auth/register` - Registrar novo usuário (ADMIN) ✅

### 👥 Usuários (`/api/v1/users`)
- `GET /api/v1/users` - Listar todos (ADMIN) ✅
- `GET /api/v1/users/{id}` - Buscar por ID ✅
- `PUT /api/v1/users/{id}` - Atualizar usuário (ADMIN) ✅
- ❌ **FALTA:** `GET /api/v1/users/me` - Dados do usuário logado

### 👨‍👩‍👦 Squads (`/api/v1/squads`)
- `GET /api/v1/squads` - Listar squads ✅
- `POST /api/v1/squads` - Criar squad (ADMIN) ✅
- `GET /api/v1/squads/{id}` - Buscar squad ✅
- `PUT /api/v1/squads/{id}` - Atualizar squad (ADMIN) ✅
- `DELETE /api/v1/squads/{id}` - Deletar squad (ADMIN) ✅
- `POST /api/v1/squads/{id}/members` - Adicionar membro (ADMIN) ✅
- `DELETE /api/v1/squads/{id}/members/{userId}` - Remover membro (ADMIN) ✅
- `GET /api/v1/squads/user/{userId}` - Squads do usuário ✅

### 📝 Tarefas (`/api/v1/tasks`)
- `GET /api/v1/tasks` - Listar tarefas (filtra por role) ✅
- `GET /api/v1/tasks/{id}` - Buscar tarefa ✅
- `POST /api/v1/tasks` - Criar tarefa (ADMIN) ✅
- `PUT /api/v1/tasks/{id}` - Atualizar tarefa (ADMIN) ✅
- `DELETE /api/v1/tasks/{id}` - Deletar tarefa (ADMIN) ✅

### ⏰ Ponto (`/api/v1/clockentries`)
- `POST /api/v1/clockentries` - Registrar ponto ✅
- `GET /api/v1/clockentries/{id}` - Buscar ponto ✅
- `GET /api/v1/clockentries/me/today` - Meus pontos de hoje ✅
- `GET /api/v1/clockentries/me/history` - Meu histórico ✅
- `GET /api/v1/clockentries/users/{userId}/today` - Pontos do usuário (ADMIN) ✅
- ❌ **FALTA:** `GET /api/v1/clockentries/date/{date}` - Pontos de todos em uma data
- ❌ **FALTA:** `GET /api/v1/clockentries/users/{userId}/range?start={}&end={}` - Range de datas

---

## 🚀 Próximos Passos

### Agora (Prioridade ALTA):
1. **Validar Task (Coordinator)** - Verificar se CRUD está completo
2. **Validar Task (Intern)** - Testar atualização de status
3. **Melhorar Point (Intern)** - Mostrar pontos do dia atual

### Em Seguida (Prioridade MÉDIA):
4. **Frequency (Coordinator)** - Integrar busca de pontos por data
5. **Frequency (Intern)** - Integrar histórico pessoal
6. **Dashboard** - Frequência real dos usuários

### Depois (Prioridade BAIXA):
7. **Home (Intern)** - Dados do usuário logado
8. **Settings** - Páginas de configuração
9. **Squads** - Verificar integração completa

---

## 🐛 Possíveis Endpoints Faltando no Backend

1. `GET /api/v1/users/me` - Buscar dados do próprio usuário logado
2. `GET /api/v1/clockentries/date/{date}` - Buscar pontos de todos os usuários em uma data (ADMIN)
3. `GET /api/v1/clockentries/users/{userId}/range` - Buscar pontos de um usuário em um período
4. `PUT /api/v1/users/{id}/password` - Alterar senha do usuário
5. `POST /api/v1/clockentries/adjust-request` - Solicitar ajuste de ponto

---

## 📈 Progresso Geral

```
Total de Páginas: 12
✅ Integradas 100%: 3 (25%)
🟡 Parcialmente: 4 (33%)
❌ Não Integradas: 5 (42%)

PROGRESSO ATUAL: 58% ████████░░░░░░░░░
```

---

## 💡 Observações Importantes

1. **Autenticação JWT:** Todas as requisições precisam do header `Authorization: Bearer {token}`
2. **Roles:** Backend valida `ROLE_ADMIN` e `ROLE_USER` automaticamente
3. **Tipos de Ponto:** `ENTRY`, `BREAK_START`, `BREAK_END`, `EXIT`
4. **Status de Tarefa:** `PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`
5. **Prioridade de Tarefa:** `Alta`, `Media`, `Baixa`
6. **Campo Squad:** Usuários têm campo `squad: string`, mas também existe tabela de Squads
7. **Horário de Trabalho:** Segunda a Sexta, 9h às 16h (definido no Dashboard)

---

**Vamos começar pela FASE 1?** 🚀

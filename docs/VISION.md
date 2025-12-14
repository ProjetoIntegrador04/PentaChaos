# 📖 Documento de Visão - PentaChaos

## Sistema de Gestão Empresarial

**Versão:** 1.0  
**Data:** Dezembro de 2025  
**Projeto:** Integrador IV - SENAI  
**Equipe:** PentaChaos Team

---

## 📋 Índice

1. [Introdução](#1-introdução)
2. [Oportunidade de Negócio](#2-oportunidade-de-negócio)
3. [Descrição do Produto](#3-descrição-do-produto)
4. [Stakeholders e Usuários](#4-stakeholders-e-usuários)
5. [Funcionalidades do Produto](#5-funcionalidades-do-produto)
6. [Restrições](#6-restrições)
7. [Requisitos de Qualidade](#7-requisitos-de-qualidade)

---

## 1. Introdução

### 1.1 Objetivo do Documento

Este documento apresenta a visão geral do **PentaChaos**, um sistema integrado de gestão empresarial desenvolvido para atender a demanda do SAGA SENAI de Inovação. O objetivo é alinhar todas as partes interessadas sobre o problema, solução proposta, usuários-alvo e funcionalidades principais do sistema.

### 1.2 Escopo do Produto

O **PentaChaos** é uma solução digital completa que permite:

- Gestão automatizada de controle de ponto com geolocalização
- Organização de equipes em squads ágeis
- Gerenciamento de tarefas com prioridades
- Sistema de notificações em tempo real
- Dashboards com métricas e KPIs
- Acesso via web (coordenadores) e mobile (membros)

### 1.3 Definições e Siglas

| Termo | Definição |
|-------|-----------|
| **SGE** | Sistema de Gestão Empresarial |
| **Squad** | Equipe ágil multidisciplinar |
| **Clock Entry** | Registro de ponto (entrada/saída) |
| **JWT** | JSON Web Token (autenticação) |
| **GPS** | Global Positioning System |
| **Push Notification** | Notificação enviada ao dispositivo móvel |
| **RBAC** | Role-Based Access Control |
| **API REST** | Interface de programação via HTTP |

### 1.4 Referências

- [SAGA SENAI de Inovação](https://gpinovacao.senai.br/)
- Demanda: "Gestão Digital de Equipes Ágeis"
- [Protótipo Figma](https://www.figma.com/design/D6GEmmBtiQgZz95ZBHu6e3/Projeto-Integrador-Final)

---

## 2. Oportunidade de Negócio

### 2.1 Problema Identificado

**Cenário Atual:**

Muitas empresas enfrentam desafios na gestão de equipes distribuídas:

- ❌ Controle manual de frequência (planilhas Excel)
- ❌ Dificuldade em rastrear localização de entrada/saída
- ❌ Falta de visibilidade sobre produtividade de squads
- ❌ Comunicação descentralizada (WhatsApp, e-mails)
- ❌ Relatórios manuais e propensos a erros
- ❌ Ausência de métricas em tempo real

**Impactos:**

- ⏱️ Perda de tempo administrativo (5-10h/semana)
- 💰 Custos com horas extras não justificadas
- 📉 Baixa visibilidade sobre performance
- 🔒 Risco de fraude em pontos (buddy punching)

### 2.2 Oportunidade

O mercado de gestão ágil cresce **25% ao ano** no Brasil. Empresas buscam:

✅ Automação de processos administrativos  
✅ Rastreabilidade com geolocalização  
✅ Dashboards visuais para tomada de decisão  
✅ Integração mobile para membros de campo  
✅ Redução de custos operacionais  

**PentaChaos** atende essas demandas com solução **100% digital, móvel e em tempo real**.

---

## 3. Descrição do Produto

### 3.1 Perspectiva do Produto

O **PentaChaos** é um sistema web/mobile que conecta coordenadores e membros de equipe através de uma arquitetura moderna:

```
┌─────────────────────────────────────────────┐
│          CAMADA DE APRESENTAÇÃO             │
├──────────────────┬──────────────────────────┤
│   Frontend Web   │     Mobile App           │
│   (React)        │   (React Native + Expo)  │
└──────────────────┴──────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           CAMADA DE NEGÓCIO                 │
│         Backend API (Spring Boot)           │
│         - Autenticação JWT                  │
│         - Regras de negócio                 │
│         - Validações                        │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           CAMADA DE DADOS                   │
│         PostgreSQL 15                       │
│         - Dados transacionais               │
│         - Histórico de registros            │
└─────────────────────────────────────────────┘
```

### 3.2 Resumo das Capacidades

| Benefício | Funcionalidade de Suporte |
|-----------|---------------------------|
| **Controle de ponto automatizado** | Registro com GPS, validação de horários, histórico |
| **Gestão de equipes** | Criação de squads, atribuição de membros, hierarquia |
| **Acompanhamento de tarefas** | CRUD de tasks, prioridades, status, deadlines |
| **Comunicação eficiente** | Notificações push, centro de notificações |
| **Visibilidade gerencial** | Dashboards, métricas, relatórios exportáveis |
| **Segurança e auditoria** | JWT, RBAC, logs de auditoria |

### 3.3 Suposições e Dependências

**Suposições:**
- Usuários possuem smartphones com GPS ativo
- Acesso à internet (3G/4G/WiFi)
- Navegadores modernos (Chrome, Firefox, Safari)

**Dependências:**
- Expo Go (para mobile)
- Docker (para deployment)
- PostgreSQL 15+

---

## 4. Stakeholders e Usuários

### 4.1 Resumo dos Stakeholders

| Nome | Descrição | Responsabilidade |
|------|-----------|------------------|
| **Coordenadores** | Gestores de equipes | Supervisionar membros, analisar métricas |
| **Membros de Squad** | Colaboradores | Registrar ponto, gerenciar tarefas |
| **Administradores** | TI | Manter sistema, gerenciar usuários |
| **Gestores RH** | Recursos Humanos | Gerar relatórios de frequência |

### 4.2 Perfis de Usuário

#### 4.2.1 Coordenador (ADMIN)

**Descrição:** Gestor responsável por múltiplos squads.

**Responsabilidades:**
- Criar e gerenciar squads
- Cadastrar novos membros
- Visualizar dashboards de performance
- Aprovar/rejeitar ajustes de ponto
- Gerar relatórios mensais

**Acesso:**
- ✅ Frontend Web (desktop)
- ✅ Mobile App (consulta)

**Volume:** 1 coordenador a cada 10-15 membros

---

#### 4.2.2 Membro de Squad (USER)

**Descrição:** Colaborador que executa tarefas.

**Responsabilidades:**
- Registrar entrada/saída (clock in/out)
- Gerenciar tarefas atribuídas
- Receber notificações
- Consultar histórico de pontos

**Acesso:**
- ✅ Mobile App (principal)
- ⚠️ Frontend Web (limitado)

**Volume:** 50-200 usuários simultâneos

---

## 5. Funcionalidades do Produto

### 5.1 Autenticação e Autorização

**Descrição:** Sistema de login seguro com JWT.

**Prioridade:** 🔴 **CRÍTICA**

**Funcionalidades:**
- Login via email/username + senha
- Tokens JWT (access 7d + refresh 30d)
- Renovação automática de token
- Logout em todos os dispositivos
- Controle de acesso por role (ADMIN/USER)

**Regras de Negócio:**
- Senhas devem ter mínimo 8 caracteres
- Tokens expiram após inatividade de 7 dias
- Máximo 3 tentativas de login incorretas

---

### 5.2 Controle de Ponto (Clock Entry)

**Descrição:** Registro automatizado de entrada/saída com GPS.

**Prioridade:** 🔴 **CRÍTICA**

**Funcionalidades:**
- Botão "Bater Ponto" com confirmação
- Captura automática de coordenadas GPS
- Validação de horário mínimo entre registros
- Histórico de pontos com filtros
- Edição/ajuste com aprovação do coordenador

**Regras de Negócio:**
- Mínimo 1 hora entre ENTRY e EXIT
- Máximo 2 registros por turno (entrada + saída)
- GPS deve ter precisão < 100 metros
- Registros fora do horário comercial requerem justificativa

**Telas:**
- 📱 Mobile: Tab "Frequência"
- 🌐 Web: Dashboard > Meus Pontos

---

### 5.3 Gestão de Squads

**Descrição:** Organização hierárquica de equipes.

**Prioridade:** 🟡 **ALTA**

**Funcionalidades:**
- CRUD completo de squads (ADMIN only)
- Atribuição de membros a squads
- Visualização de hierarquia
- Métricas por squad (frequência, tarefas concluídas)

**Regras de Negócio:**
- Squad deve ter ao menos 1 membro
- Nome único por squad
- Coordenador pode gerenciar apenas seus squads

**Telas:**
- 📱 Mobile: Tab "Squads"
- 🌐 Web: Menu "Gerenciar Squads"

---

### 5.4 Gerenciamento de Tarefas

**Descrição:** Criação e acompanhamento de tasks.

**Prioridade:** 🟡 **ALTA**

**Funcionalidades:**
- CRUD de tarefas
- Atribuição a membros específicos
- Prioridades (ALTA, MÉDIA, BAIXA)
- Status (TODO, IN_PROGRESS, DONE)
- Deadline tracking
- Notificação ao atribuir tarefa

**Regras de Negócio:**
- Tarefa deve ter título (obrigatório)
- Deadline não pode ser retroativa
- Somente atribuidor ou executor podem editar
- Task concluída não pode voltar para TODO

**Telas:**
- 📱 Mobile: Tab "Home" > Minhas Tarefas
- 🌐 Web: Dashboard > Tarefas do Squad

---

### 5.5 Notificações

**Descrição:** Sistema de alertas em tempo real.

**Prioridade:** 🟢 **MÉDIA**

**Funcionalidades:**
- Push notifications (Expo)
- Centro de notificações in-app
- Badge de contador de não lidas
- Filtros por tipo (tarefa, ponto, geral)

**Tipos de Notificação:**
- 📋 Nova tarefa atribuída
- ✅ Tarefa aprovada/rejeitada
- ⏰ Lembrete de registro de ponto
- 👥 Mudança em squad

**Telas:**
- 📱 Mobile: Tab "Notificações"
- 🌐 Web: Ícone sino (header)

---

### 5.6 Dashboard e Relatórios

**Descrição:** Visualização de métricas e KPIs.

**Prioridade:** 🟢 **MÉDIA**

**Funcionalidades:**
- Frequência mensal (gráficos)
- Tarefas por status (pie chart)
- Membros por squad (bar chart)
- Exportação para PDF/Excel

**Métricas:**
- Taxa de presença (%)
- Tarefas concluídas no prazo
- Produtividade por squad
- Horas trabalhadas

**Telas:**
- 🌐 Web: Dashboard principal (home)

---

## 6. Restrições

### 6.1 Restrições Técnicas

- Backend deve ser desenvolvido em **Java 21 + Spring Boot 3.5**
- Frontend web em **React 18**
- Mobile em **React Native com Expo SDK 54**
- Banco de dados **PostgreSQL 15+**
- Deployment via **Docker Compose**

### 6.2 Restrições de Negócio

- Projeto deve ser concluído até **17/12/2025**
- Budget: $0 (open source)
- Equipe: 6 desenvolvedores
- Infraestrutura: Cloud gratuita (Railway, Vercel)

### 6.3 Restrições Legais

- Conformidade com **LGPD** (Lei Geral de Proteção de Dados)
- Dados de localização GPS requerem consentimento
- Senhas devem ser criptografadas (BCrypt)

---

## 7. Requisitos de Qualidade

### 7.1 Usabilidade

- Interface intuitiva (máximo 3 cliques para ação)
- Responsividade mobile-first
- Feedback visual em todas as ações
- Mensagens de erro claras

### 7.2 Desempenho

- Tempo de resposta da API < 500ms (95% req)
- Carregamento de telas < 2s
- Suporte a 200 usuários simultâneos
- GPS com precisão < 100m

### 7.3 Segurança

- ✅ Autenticação JWT obrigatória
- ✅ Senhas criptografadas (BCrypt)
- ✅ HTTPS em produção
- ✅ Sanitização de inputs
- ✅ Proteção contra SQL Injection
- ✅ CORS configurado

### 7.4 Confiabilidade

- Disponibilidade: 99% uptime
- Backup diário do banco
- Logs de auditoria de ações críticas
- Rollback automático em caso de falha

### 7.5 Manutenibilidade

- Código seguindo padrões (Clean Code)
- Cobertura de testes > 70%
- Documentação completa (README, JavaDoc)
- Commits semânticos (Conventional Commits)

---

## 8. Documentação Adicional

- 📝 [Product Requirements Document (PRD)](prd.md)
- 🎨 [Protótipo Figma](https://www.figma.com/design/D6GEmmBtiQgZz95ZBHu6e3/Projeto-Integrador-Final)
- 🌿 [Git Workflow](branch-management.md)
- 💬 [Padrão de Commits](commit-pattern.md)

---

## 9. Aprovação

| Nome | Papel | Data | Assinatura |
|------|-------|------|------------|
| Gabriel Eliezer Rodrigues | Tech Lead | 14/12/2025 | ✅ |
| David Francisco Vieira | Backend Lead | 14/12/2025 | ✅ |
| Rafael Rodrigues | Frontend Lead | 14/12/2025 | ✅ |
| José Henrique B. Vieira | Mobile Lead | 14/12/2025 | ✅ |

---

<div align="center">

**PentaChaos Team** - SENAI 2025  
*Transformando gestão empresarial com tecnologia*

</div>

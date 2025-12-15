# 🔄 CI/CD Pipeline - PentaChaos

## 📋 Visão Geral

Este documento descreve a implementação de **Continuous Integration/Continuous Deployment (CI/CD)** do projeto PentaChaos usando GitHub Actions.

---

## 🎯 Objetivos

- ✅ Executar testes automaticamente em cada push
- ✅ Validar build da aplicação
- ✅ Deploy automático para produção
- ✅ Notificações de status do pipeline
- ✅ Integração contínua entre backend, frontend e mobile

---

## 📁 Estrutura de Workflows

```
.github/workflows/
├── backend-ci.yml      # CI/CD do Backend (Spring Boot)
├── frontend-ci.yml     # CI/CD do Frontend (React + Vite)
├── mobile-ci.yml       # CI/CD do Mobile (React Native + Expo)
└── full-stack-ci.yml   # Pipeline completo de integração
```

---

## 🚀 Workflows Implementados

### 1️⃣ Backend CI/CD (`backend-ci.yml`)

**Triggers:**
- Push para `develop` ou `main` (mudanças em `backend/**`)
- Pull Request para `develop` ou `main`

**Jobs:**

#### 🧪 Test
- Configura JDK 21
- Inicia PostgreSQL 15 (container de teste)
- Roda testes JUnit com Maven
- Gera relatório de cobertura

#### 🏗️ Build
- Compila aplicação Spring Boot
- Cria imagem Docker
- Salva artefato para deploy

#### 🚢 Deploy
- Deploy automático para produção (branch `main`)
- SSH para EC2 e atualiza containers

---

### 2️⃣ Frontend CI/CD (`frontend-ci.yml`)

**Triggers:**
- Push para `develop` ou `main` (mudanças em `frontend/**`)
- Pull Request para `develop` ou `main`

**Jobs:**

#### 🧪 Test
- Configura Node.js 20
- Instala dependências com `npm ci`
- Executa linting
- Faz build de produção com Vite

#### 🚀 Deploy
- Upload para AWS S3 (comentado)
- Invalidação do CloudFront
- Notificação de sucesso

---

### 3️⃣ Mobile CI/CD (`mobile-ci.yml`)

**Triggers:**
- Push para `develop` ou `main` (mudanças em `integrador-mobile/**`)
- Pull Request para `develop` ou `main`

**Jobs:**

#### 🤖 Build Android
- Configura Expo CLI
- Build APK com EAS (comentado)
- Notificação de build iniciado

#### 🌐 Build Web
- Export para web com Expo
- Upload de artefato

---

### 4️⃣ Full Stack CI/CD (`full-stack-ci.yml`)

**Triggers:**
- Push para `main`
- Manual (workflow_dispatch)

**Jobs:**

#### 🔗 Integration Tests
- Inicia todos os serviços com Docker Compose
- Testa conectividade backend
- Verifica saúde da aplicação
- Cleanup automático

#### 🚀 Deploy Production
- Executa após todos os testes passarem
- Deploy coordenado de todos os componentes
- Relatório de deployment

---

## 🔧 Configuração Necessária

### Secrets do GitHub (Settings → Secrets and variables → Actions)

```bash
# Backend (EC2 Deploy)
EC2_SSH_KEY         # Chave privada SSH para acessar EC2
EC2_HOST            # IP/hostname da EC2

# Frontend (S3 Deploy)
AWS_ACCESS_KEY_ID       # AWS Access Key
AWS_SECRET_ACCESS_KEY   # AWS Secret Key
CLOUDFRONT_ID           # CloudFront Distribution ID

# Mobile (Expo)
EXPO_TOKEN          # Token da conta Expo (https://expo.dev/settings/access-tokens)
```

### Como adicionar Secrets:

1. Acesse: `https://github.com/ProjetoIntegrador04/PentaChaos/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. Adicione cada secret listado acima

---

## 📊 Status Badges

Adicione no README.md:

```markdown
## 🔄 CI/CD Status

[![Backend CI](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/frontend-ci.yml)
[![Mobile CI](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/mobile-ci.yml/badge.svg)](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/mobile-ci.yml)
[![Full Stack](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/full-stack-ci.yml/badge.svg)](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/full-stack-ci.yml)
```

---

## 🧪 Como Testar Localmente

### Backend
```bash
cd backend/sge-app
./mvnw test
```

### Frontend
```bash
cd frontend/frontProject
npm test
npm run build
```

### Mobile
```bash
cd integrador-mobile
npm test
npx expo export --platform web
```

---

## 🔄 Fluxo de Trabalho

### 1. Desenvolvimento (`develop` branch)
```bash
# Fazer alterações
git add .
git commit -m ":sparkles: feat: nova funcionalidade"
git push origin develop
```

**O que acontece:**
- ✅ Testes automáticos executados
- ✅ Build validado
- ❌ **NÃO faz deploy**

### 2. Produção (`main` branch)
```bash
# Merge para main
git checkout main
git merge develop
git push origin main
```

**O que acontece:**
- ✅ Testes automáticos executados
- ✅ Build validado
- ✅ **Deploy automático para produção**
- 🚀 Aplicação atualizada na EC2/S3

---

## 📈 Métricas e Relatórios

### Test Reports
- Acessível em: `Actions → [Workflow Run] → Test Results`
- Mostra testes passados/falhados
- Tempo de execução

### Code Coverage
- Integração com Codecov
- Badge de cobertura no README
- Relatório detalhado de linhas cobertas

### Build Artifacts
- Imagens Docker salvas
- Builds de frontend disponíveis
- Retenção de 5 dias

---

## 🐛 Troubleshooting

### Testes falhando
```bash
# Verificar logs
Actions → [Workflow] → [Job] → [Step logs]

# Rodar localmente
./mvnw test          # Backend
npm test             # Frontend
```

### Deploy falhando
```bash
# Verificar secrets configurados
Settings → Secrets and variables → Actions

# Verificar logs de deploy
Actions → deploy → View logs
```

### Build muito lento
- Cache do Maven/npm está funcionando?
- Dependências otimizadas?
- Runners do GitHub estão saudáveis?

---

## 🎯 Melhorias Futuras

- [ ] Testes E2E com Playwright/Cypress
- [ ] Deploy para staging antes de produção
- [ ] Rollback automático em caso de falha
- [ ] Notificações no Slack/Discord
- [ ] Análise de qualidade de código (SonarQube)
- [ ] Security scanning (Snyk/Dependabot)
- [ ] Performance testing
- [ ] Monitoramento pós-deploy

---

## 📚 Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Maven Surefire Plugin](https://maven.apache.org/surefire/maven-surefire-plugin/)
- [Expo GitHub Actions](https://docs.expo.dev/build/building-on-ci/)
- [AWS S3 Deploy](https://github.com/aws-actions/configure-aws-credentials)

---

## 👥 Manutenção

Este pipeline é mantido pela equipe PentaChaos. Para dúvidas ou sugestões, abra uma issue no GitHub.

**Última atualização:** 14 de Dezembro de 2025

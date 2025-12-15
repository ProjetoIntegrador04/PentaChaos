# 🔄 CI/CD - Integração e Entrega Contínua

## 📋 Índice
- [O que é CI/CD?](#o-que-é-cicd)
- [Workflow Backend CI/CD](#workflow-backend-cicd)
- [Como Funciona](#como-funciona)
- [Estrutura do Pipeline](#estrutura-do-pipeline)
- [Triggers (Gatilhos)](#triggers-gatilhos)
- [Detalhamento Técnico](#detalhamento-técnico)
- [Benefícios](#benefícios)
- [Como Visualizar](#como-visualizar)

---

## 🎯 O que é CI/CD?

**CI/CD** significa **Continuous Integration / Continuous Delivery** (Integração Contínua / Entrega Contínua).

### Integração Contínua (CI)
Prática de automatizar a **integração** de código de vários desenvolvedores em um repositório compartilhado. A cada commit, o código é:
- ✅ Compilado automaticamente
- ✅ Testado automaticamente
- ✅ Validado antes de ser integrado

### Entrega Contínua (CD)
Prática de manter o código **sempre pronto para produção**, automatizando:
- ✅ Build da aplicação
- ✅ Testes de integração
- ✅ Preparação para deploy

---

## 🚀 Workflow Backend CI/CD

### Arquivo: `.github/workflows/backend-ci.yml`

Este workflow automatiza todo o processo de **teste e build** do backend Spring Boot.

### 📊 Status do Workflow

![Backend CI/CD](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/backend-ci.yml/badge.svg)

---

## ⚙️ Como Funciona

Quando você faz `git push` para o branch `develop` ou `main`, o GitHub Actions **automaticamente**:

1. 🏗️ Prepara um ambiente Linux limpo
2. 🐘 Inicia um banco PostgreSQL para testes
3. ☕ Configura Java 21 e Maven
4. 🧪 Executa **todos os testes** do backend
5. 📦 Compila a aplicação em um arquivo `.jar`
6. ✅ Confirma que tudo está funcionando

**Tudo isso em ~5-8 minutos, sem intervenção manual!**

---

## 🔄 Estrutura do Pipeline

```
┌─────────────────────────────────────────────────────┐
│  GIT PUSH (develop ou main)                         │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  🏗️  PREPARAÇÃO DO AMBIENTE                         │
│  • Ubuntu Latest                                    │
│  • Java 21 (Temurin)                                │
│  • Maven Cache                                      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  🐘 POSTGRESQL SERVICE                              │
│  • PostgreSQL 15 Alpine                             │
│  • Database: sge_test                               │
│  • Health Check: pg_isready                         │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  🧪 TESTES AUTOMATIZADOS                            │
│  • Unit Tests (Controllers, Services)               │
│  • Integration Tests (Repositories)                 │
│  • Business Logic Tests                             │
│  • Security Tests                                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  🏗️  BUILD DA APLICAÇÃO                             │
│  • Maven Clean Package                              │
│  • Gera arquivo .jar                                │
│  • Valida compilação                                │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  ✅ SUCESSO ou ❌ FALHA                             │
│  • Notificação no GitHub                            │
│  • Badge atualizado                                 │
│  • Email (se configurado)                           │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Triggers (Gatilhos)

O workflow é executado automaticamente quando:

### 1. **Push para branches principais**
```yaml
on:
  push:
    branches: [ develop, main ]
```
Sempre que você faz `git push` para `develop` ou `main`, o CI/CD roda.

### 2. **Pull Requests**
```yaml
on:
  pull_request:
    branches: [ develop, main ]
```
Quando alguém abre um Pull Request, valida o código antes de fazer merge.

### 3. **Execução Manual**
```yaml
on:
  workflow_dispatch:
```
Você pode executar manualmente clicando em "Run workflow" no GitHub Actions.

---

## 🔧 Detalhamento Técnico

### **Step 1: Checkout do Código**
```yaml
- name: 📥 Checkout
  uses: actions/checkout@v4
```
**O que faz:** Baixa o código do repositório para a máquina virtual do GitHub.

---

### **Step 2: Configuração do Java**
```yaml
- name: ☕ Setup Java 21
  uses: actions/setup-java@v4
  with:
    java-version: '21'
    distribution: 'temurin'
    cache: 'maven'
```
**O que faz:** 
- Instala JDK 21 (Eclipse Temurin)
- Configura cache do Maven (acelera builds futuros)
- Define JAVA_HOME e PATH

---

### **Step 3: PostgreSQL Service Container**
```yaml
services:
  postgres:
    image: postgres:15-alpine
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: sge_test
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```
**O que faz:**
- Inicia um container Docker com PostgreSQL 15
- Cria banco de dados `sge_test` para testes
- Health check garante que o banco está pronto
- Expõe porta 5432 para conexão

**Por que usar PostgreSQL nos testes?**
- ✅ Testa em ambiente **idêntico à produção**
- ✅ Valida queries SQL específicas do PostgreSQL
- ✅ Detecta problemas de compatibilidade antes do deploy

---

### **Step 4: Permissão Maven Wrapper**
```yaml
- name: 🔑 Grant execute permission
  working-directory: ./backend/sge-app
  run: chmod +x mvnw
```
**O que faz:** Dá permissão de execução para o Maven Wrapper no Linux.

---

### **Step 5: Aguardar PostgreSQL**
```yaml
- name: 🐘 Wait for PostgreSQL
  run: |
    until pg_isready -h localhost -p 5432 -U postgres; do
      echo "Waiting for PostgreSQL..."
      sleep 2
    done
    echo "✅ PostgreSQL is ready!"
```
**O que faz:**
- Loop que tenta conectar no PostgreSQL
- Aguarda até o banco estar 100% pronto
- Previne falhas de "Connection refused"

---

### **Step 6: Executar Testes**
```yaml
- name: 🧪 Run Tests
  working-directory: ./backend/sge-app
  run: ./mvnw test -Dspring.profiles.active=test
  env:
    SPRING_PROFILES_ACTIVE: test
    SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/sge_test
    SPRING_DATASOURCE_DRIVER_CLASS_NAME: org.postgresql.Driver
    SPRING_DATASOURCE_USERNAME: postgres
    SPRING_DATASOURCE_PASSWORD: postgres
    SPRING_JPA_HIBERNATE_DDL_AUTO: create-drop
    SPRING_JPA_DATABASE_PLATFORM: org.hibernate.dialect.PostgreSQLDialect
```
**O que faz:**
- Executa `./mvnw test` (todos os testes JUnit)
- Conecta no PostgreSQL via variáveis de ambiente
- Usa perfil `test` do Spring Boot
- Cria/destrói schema automaticamente (`create-drop`)

**Testes executados:**
- ✅ **Unit Tests:** ClockEntryServiceTest (8 testes)
- ✅ **Integration Tests:** ClockEntryRepositoryTest (11 testes)
- ✅ **Integration Tests:** UserRepositoryTest (9 testes)
- ✅ **Security Tests:** AuthController (validações JWT)

**Total:** 28+ testes automatizados

---

### **Step 7: Build da Aplicação**
```yaml
- name: 🏗️ Build Application
  working-directory: ./backend/sge-app
  run: ./mvnw clean package -DskipTests
```
**O que faz:**
- `clean`: Limpa compilações anteriores
- `package`: Compila e gera o arquivo `.jar`
- `-DskipTests`: Não roda testes novamente (já rodamos antes)

**Resultado:** Arquivo `sge-app-0.0.1-SNAPSHOT.jar` pronto para deploy.

---

### **Step 8: Confirmação de Sucesso**
```yaml
- name: ✅ Success
  run: echo "✅ Backend CI/CD concluído com sucesso!"
```
**O que faz:** Mensagem de sucesso nos logs.

---

## 🎁 Benefícios

### 1. **🛡️ Qualidade de Código Garantida**
- Todo código é **testado antes** de ser integrado
- Detecta bugs **imediatamente**
- Previne código quebrado em produção

### 2. **⚡ Feedback Rápido**
- Sabe em **5-8 minutos** se o código está funcionando
- Não precisa esperar deploy para descobrir problemas
- Corrige erros mais rapidamente

### 3. **👥 Colaboração Eficiente**
- Equipe pode trabalhar em paralelo com segurança
- Pull Requests validados automaticamente
- Menos conflitos e retrabalho

### 4. **📊 Visibilidade do Projeto**
- Badge verde = código confiável
- Histórico de builds disponível
- Métricas de qualidade visíveis

### 5. **🚀 Deploy Seguro**
- Só faz deploy de código **testado e aprovado**
- Reduz downtime e incidentes em produção
- Aumenta confiança para fazer releases frequentes

---

## 📈 Como Visualizar

### **1. GitHub Actions (Web)**
Acesse: https://github.com/ProjetoIntegrador04/PentaChaos/actions

Você verá:
- ✅ Histórico de todas as execuções
- ⏱️ Tempo de execução de cada step
- 📝 Logs detalhados
- ❌ Erros (se houver)

### **2. Badge no README**
Adicione no `README.md` principal:
```markdown
![Backend CI/CD](https://github.com/ProjetoIntegrador04/PentaChaos/actions/workflows/backend-ci.yml/badge.svg)
```

Resultado:
![Badge Example](https://img.shields.io/badge/build-passing-brightgreen)

### **3. Notificações**
- 📧 Email quando build falha (configurável)
- 🔔 Notificação GitHub
- 💬 Integração com Slack/Discord (opcional)

---

## 🎓 Para a Apresentação do TCC

### **O que falar:**

> "Implementamos CI/CD com GitHub Actions para garantir qualidade de código. O pipeline automatizado executa 28+ testes a cada commit, validando toda a lógica de negócio contra um banco PostgreSQL real. Isso nos permite detectar bugs imediatamente e manter o código sempre pronto para produção, seguindo as melhores práticas DevOps da indústria."

### **Demonstre:**

1. Mostre o arquivo `backend-ci.yml` (este documento)
2. Acesse o GitHub Actions e mostre uma execução verde
3. Mostre os logs dos testes sendo executados
4. Explique que isso atende ao **Critério 12 (CI/CD)**

### **Vantagens competitivas:**

✅ Automação de testes (não é manual)  
✅ Ambiente isolado para cada build  
✅ PostgreSQL real (não mock)  
✅ Validação antes de merge  
✅ Prática profissional DevOps  

---

## 📚 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **GitHub Actions** | - | Plataforma CI/CD |
| **Ubuntu** | Latest | Sistema operacional do runner |
| **Java** | 21 | Linguagem de programação |
| **Maven** | 3.x | Gerenciador de dependências |
| **PostgreSQL** | 15 | Banco de dados para testes |
| **JUnit** | 5 | Framework de testes |
| **Mockito** | 5.x | Framework de mocks |
| **Spring Boot** | 3.x | Framework da aplicação |

---

## 🔗 Links Úteis

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Spring Boot Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [PostgreSQL CI/CD Best Practices](https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers)

---

## 👥 Autores

**Equipe PentaChaos** - SENAI Projeto Integrador IV

---

## 📅 Última Atualização

Dezembro 14, 2025

---

## ✅ Checklist de Validação

- [x] Workflow criado e configurado
- [x] PostgreSQL service funcionando
- [x] Testes executando com sucesso
- [x] Build gerando .jar corretamente
- [x] Badge verde no GitHub
- [x] Documentação completa

**Status:** 🟢 **OPERACIONAL**

# RELATÓRIO TÉCNICO DE SEGURANÇA DA APLICAÇÃO WEB

## 1. Identificação

* **Sistema Avaliado:** Aplicação Web (Frontend React + Backend API)
* **Endereço Avaliado:** `http://10.248.189.223:3000`
* **Ambiente:** Teste / Desenvolvimento
* **Sistema Operacional de Testes:** Kali Linux
* **Ferramentas Utilizadas:**

  * Nikto
  * Wapiti
  * Testes manuais via navegador
* **Tipo de Avaliação:** Pentest Web (Caixa Cinza)
* **Data:** *(preencher)*

---

## 2. Escopo

O escopo do teste incluiu:

* Página de login
* Fluxo de autenticação
* Dashboard autenticado
* Validação de token
* Headers HTTP
* Comportamento da aplicação frente a entradas inválidas

---

## 3. Metodologia

A metodologia aplicada seguiu boas práticas de segurança, baseada em:

* OWASP Web Security Testing Guide (WSTG)
* OWASP Top 10
* Testes automatizados + validação manual

Etapas:

1. Reconhecimento
2. Scans automatizados
3. Análise manual de comportamento
4. Classificação de riscos
5. Propostas de mitigação

---

## 4. Resultados das Ferramentas Automatizadas

---

## 4.1 Resultados – Nikto

### Descrição

O Nikto foi utilizado para identificar problemas relacionados a:

* Configuração do servidor
* Headers HTTP
* Informações sensíveis
* Práticas inseguras

### Principais Achados

#### 1. Headers de Segurança Ausentes

Foram identificados headers de segurança ausentes ou mal configurados, como:

* `X-Content-Type-Options`
* `X-Frame-Options`
* `Content-Security-Policy`
* `Referrer-Policy`

**Impacto**

* Possibilidade de clickjacking
* Facilitação de ataques XSS
* Vazamento de informações de navegação

**Classificação OWASP**

* A05 – Security Misconfiguration

---

#### 2. Divulgação de Informações via Headers

O servidor retorna informações que podem auxiliar atacantes, como:

* Identificação de framework
* Estrutura da aplicação frontend

**Impacto**

* Facilita ataques direcionados
* Reduz o custo de reconhecimento para um invasor

**Classificação OWASP**

* A05 – Security Misconfiguration

---

## 4.2 Resultados – Wapiti

### Descrição

O Wapiti foi utilizado para análise dinâmica de vulnerabilidades de aplicação web.

---

### 1. Possível Vulnerabilidade XSS (Reflected)

O Wapiti identificou possíveis pontos onde entradas do usuário não são corretamente sanitizadas antes de serem processadas.

**Observação Importante**
Durante os testes manuais, **não foi possível confirmar execução de JavaScript arbitrário**, caracterizando o achado como **potencial/falso positivo**, porém relevante para análise.

**Impacto Potencial**

* Execução de scripts maliciosos
* Roubo de sessão
* Redirecionamentos indevidos

**Classificação OWASP**

* A03 – Injection (XSS)

---

### 2. Falta de Validação Robusta de Input

Entradas inválidas geram comportamentos inesperados no frontend, sem bloqueio adequado.

**Impacto**

* Quebra de fluxo
* Instabilidade
* Possível exploração lógica

**Classificação OWASP**

* A04 – Insecure Design

---

## 5. Teste Manual – Achado Crítico

---

## 5.1 Denial of Service (DoS) por Falha de Lógica de Autenticação

### Descrição

Durante testes manuais relacionados à autenticação e validação de token, foi identificado que a aplicação entra em um **loop infinito de validação**, conforme evidenciado pelos logs no console:

```text
🔄 AuthContext useEffect - Token validation: {valid: false}
❌ Invalid token - clearing auth
```

Esse comportamento se repete continuamente, causando:

* Tela branca
* Lentidão severa
* Alto consumo de recursos
* Impossibilidade de uso da aplicação

---

### 🔍 Causa Raiz

* Uso inadequado de `useEffect` no contexto de autenticação
* Validação contínua de token inválido ou inexistente
* Ausência de condição de parada ou redirecionamento
* Re-renderizações infinitas do React

---

### Impacto

| Impacto         | Descrição                          |
| --------------- | ---------------------------------- |
| Disponibilidade | Aplicação fica inutilizável        |
| Usuários        | Afeta todos os usuários            |
| Exploração      | Simples, sem necessidade de flood  |
| Persistência    | Enquanto o estado inválido existir |

**Classificação OWASP**

* A04 – Insecure Design
* A09 – Security Logging and Monitoring Failures (secundário)

**Tipo de Ataque**

* Denial of Service – Application Layer (Lógico)

---

## 6. Avaliação de Risco

| Vulnerabilidade              | Severidade |
| ---------------------------- | ---------- |
| Headers ausentes             | Média      |
| Possível XSS                 | Média      |
| DoS por loop de autenticação | **Alta**   |

---

## 7. Recomendações de Mitigação

---

### Autenticação e Lógica

* Implementar estados claros:

  * `loading`
  * `authenticated`
  * `unauthenticated`
* Interromper validação quando token for inválido
* Redirecionar imediatamente para `/login`

---

### Frontend

* Evitar validação de token em todo render
* Controlar execução do `useEffect`
* Sanitizar qualquer input exibido

---

### Backend

* Implementar rate limiting
* Retornar erros claros e rápidos
* Evitar validações repetidas do mesmo token inválido

---

### Segurança Geral

* Implementar headers de segurança
* Aplicar Content Security Policy (CSP)
* Reduzir exposição de informações do servidor

---

## 8. Conclusão

A aplicação apresenta **falhas relevantes de segurança**, com destaque para uma **vulnerabilidade real de Denial of Service por falha de lógica**, que impacta diretamente a disponibilidade do sistema.

Apesar de ferramentas automatizadas apontarem possíveis vulnerabilidades de XSS, o achado mais crítico foi identificado por **teste manual**, demonstrando a importância da validação humana no processo de pentest.
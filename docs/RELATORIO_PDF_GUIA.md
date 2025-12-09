# 📊 Guia do Relatório PDF de Squads

## 🎯 Visão Geral

O sistema agora gera **relatórios PDF profissionais e visuais** com informações completas sobre todas as squads e seus membros.

## 📍 Como Gerar o Relatório

1. Acesse a página **Squads** no menu lateral
2. Clique no botão **📄 Gerar Relatório** no canto superior direito
3. O PDF será automaticamente baixado no seu computador

## 📄 Estrutura do Relatório

### 🎨 Cabeçalho (Primeira Página)
```
┌─────────────────────────────────────────────────────────────┐
│          RELATÓRIO DE SQUADS                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Data: 08/12/2025              Total de Squads: 5            │
│ Hora: 20:30                   Total de Membros: 25          │
└─────────────────────────────────────────────────────────────┘
```

### 📋 Informações por Squad

Cada squad possui:

#### **Barra de Título da Squad**
- Fundo azul com nome da squad
- Quantidade de membros entre parênteses
- Exemplo: `LSD (5 membros)`

#### **Tabela de Membros**
Colunas disponíveis:

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| **Nome** | Nome de usuário | `eliezer` |
| **Email** | Email corporativo | `eliezer@sge.com` |
| **RA** | Registro Acadêmico | `123456` ou `N/A` |
| **Cargo** | Função no sistema | `👑 Admin` ou `👤 Estagiário` |
| **Frequência** | % de presença com indicador visual | `🟢 95%`, `🟡 65%`, `🔴 45%` |
| **Status** | Ativo/Inativo | `✓ ATIVO` ou `✗ INATIVO` |

#### **Resumo Estatístico**
Abaixo de cada tabela:
```
📊 Resumo: 8 ativos | 2 admins | 1 inativos
```

### 🎨 Código de Cores

#### Frequência:
- 🟢 **Verde** (≥75%): Excelente frequência
- 🟡 **Amarelo** (50-74%): Atenção necessária
- 🔴 **Vermelho** (<50%): Frequência crítica

#### Status:
- ✓ **ATIVO** (Verde): Usuário habilitado
- ✗ **INATIVO** (Vermelho): Usuário desabilitado

#### Cargos:
- 👑 **Admin** (Laranja): Administrador do sistema
- 👤 **Estagiário** (Preto): Usuário regular

### 📑 Rodapé (Todas as Páginas)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2RP net - Sistema de Gerenciamento de Estagiários

Relatório gerado em 08/12/2025 às 20:30

Página 1 de 3
```

## 📊 Informações Exibidas

### ✅ Dados Incluídos:
- ✓ Nome do usuário
- ✓ Email
- ✓ RA (Registro Acadêmico)
- ✓ Cargo (Admin ou Estagiário)
- ✓ Frequência com indicador visual
- ✓ Status (Ativo/Inativo)
- ✓ Estatísticas por squad
- ✓ Total de squads e membros
- ✓ Data e hora da geração
- ✓ Numeração de páginas

### 📌 Recursos Visuais:
- 📄 **Modo Paisagem**: Melhor visualização de tabelas
- 🎨 **Cores**: Identificação rápida de situações
- 🔤 **Emojis**: Indicadores visuais intuitivos
- 📊 **Estatísticas**: Resumo de cada squad
- 🗂️ **Organização**: Uma squad por seção
- 📑 **Multipáginas**: Suporta muitas squads

## 💡 Casos de Uso

### 1️⃣ Análise de Frequência
- Identificar membros com baixa frequência (🔴)
- Reconhecer membros com excelente presença (🟢)
- Tomar decisões sobre acompanhamento

### 2️⃣ Gestão de Equipes
- Ver composição de cada squad
- Identificar admins em cada equipe
- Verificar distribuição de membros

### 3️⃣ Relatórios Gerenciais
- Apresentar dados em reuniões
- Compartilhar informações com gestores
- Documentar situação das equipes

### 4️⃣ Auditoria
- Verificar usuários ativos/inativos
- Confirmar informações de contato
- Validar estrutura organizacional

## 🔧 Características Técnicas

### Formato:
- **Tipo**: PDF (Portable Document Format)
- **Orientação**: Paisagem (Landscape)
- **Biblioteca**: jsPDF + jsPDF-AutoTable
- **Encoding**: UTF-8 (suporta acentos)

### Nomenclatura do Arquivo:
```
relatorio_squads_2025-12-08_20-30.pdf
                 └─ Data ─┘ └─ Hora ─┘
```

### Tamanho Estimado:
- 1-3 squads: ~50 KB
- 4-10 squads: ~100-200 KB
- 10+ squads: ~200-500 KB

## 🚀 Melhorias Futuras Planejadas

### Em Desenvolvimento:
- [ ] **Filtros**: Gerar relatório por squad específica
- [ ] **Período**: Escolher intervalo de datas para frequência
- [ ] **Gráficos**: Adicionar gráficos de pizza/barras
- [ ] **Comparativo**: Comparar frequências entre períodos
- [ ] **Exportar Excel**: Alternativa ao PDF

### Sugestões de Uso:
- [ ] **Email Automático**: Enviar relatório por email
- [ ] **Agendamento**: Gerar relatórios semanais/mensais
- [ ] **Dashboard**: Visualização online antes de exportar
- [ ] **Personalização**: Escolher campos a incluir

## 📞 Suporte

Se encontrar problemas com o relatório:
1. Verifique se há squads cadastradas
2. Confirme que os navegadores modernos estão sendo usados
3. Verifique permissões de download no navegador
4. Consulte o console do navegador (F12) para erros

## 📝 Exemplo Visual

```
╔════════════════════════════════════════════════════════════╗
║         RELATÓRIO DE SQUADS                                ║
╠════════════════════════════════════════════════════════════╣
║ Data: 08/12/2025              Total de Squads: 3           ║
║ Hora: 20:30                   Total de Membros: 15         ║
╠════════════════════════════════════════════════════════════╣
║ ▓▓▓▓▓▓▓ LSD (5 membros) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
╟────────────────────────────────────────────────────────────╢
║ Nome     │ Email           │ RA    │ Cargo    │ Freq.     ║
╟──────────┼─────────────────┼───────┼──────────┼───────────╢
║ eliezer  │ eli@sge.com     │ 12345 │ 👑 Admin │ 🟢 95%   ║
║ johndoe  │ john@sge.com    │ 12346 │ 👤 Est.  │ 🟡 65%   ║
║ maria    │ maria@sge.com   │ 12347 │ 👤 Est.  │ 🔴 45%   ║
╟────────────────────────────────────────────────────────────╢
║ 📊 Resumo: 4 ativos | 1 admin | 1 inativo                 ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ 2RP net - Sistema de Gerenciamento de Estagiários         ║
║ Relatório gerado em 08/12/2025 às 20:30                   ║
║ Página 1 de 2                                              ║
╚════════════════════════════════════════════════════════════╝
```

---

**Última atualização**: 08/12/2025
**Versão do relatório**: 1.0.0
**Desenvolvido por**: Equipe PentaChaos

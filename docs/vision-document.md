# �� Sistema de Gestão de Estágios (SGE)

### Integrantes:
- Gabriel Eliezer Rodrigues
- David Francisco Vieira
- Rafael Rodrigues
- José Henrique Bernardes Vieira 
- Pablo Vinicius Domingues Sanches
- Daniel Marques De Melos Asiatico

## Protótipo Figma
https://www.figma.com/design/D6GEmmBtiQgZz95ZBHu6e3/Projeto-Integrador-Final?node-id=0-1&p=f&t=pvhRwWWRpYH243TH-0

## Visão Geral do Projeto

Este `README.md` apresenta o Documento de Visão inicial para o desenvolvimento do **Sistema de Gestão de Estágios (SGE)**. O objetivo é transformar a gestão de estágios, migrando de processos manuais baseados em planilhas para uma solução digital eficiente e centralizada. Este documento serve como a base para alinhar a compreensão de todas as partes interessadas sobre o problema, objetivos, usuários e funcionalidades principais do sistema.

---

## 1. Introdução

Este capítulo define o propósito deste documento, o escopo do produto, os termos e siglas utilizados, referências e uma visão geral da sua estrutura.

### 1.1 Objetivo do Documento

Este documento tem como objetivo principal formalizar a visão e o escopo preliminar para o desenvolvimento de um sistema digital de gestão de estágios. Ele visa alinhar a compreensão entre todas as partes interessadas (stakeholders) sobre o problema a ser resolvido, os objetivos do produto, seus usuários e as principais funcionalidades esperadas, servindo como base para futuras etapas de detalhamento e planejamento do projeto.

### 1.2 Escopo do Produto

O produto a ser desenvolvido é um sistema digital que permitirá à empresa gerenciar de forma automatizada e centralizada todo o ciclo de vida do estagiário, desde o controle de frequência e registro de avaliações até a geração de relatórios de desempenho. O escopo inicial foca em substituir a gestão manual baseada em planilhas, otimizando o tempo dos coordenadores e melhorando a precisão das informações.

### 1.3 Definições, Acrônimos e Abreviações

*   **SGE:** Sistema de Gestão de Estágios.
*   **Estagiário:** Indivíduo em período de estágio profissional na empresa.    
*   **Coordenador de Estágios:** Profissional responsável pela supervisão, acompanhamento e avaliação dos estagiários.
*   **RH:** Recursos Humanos, departamento responsável pelas políticas de pessoal e processos de contratação/gestão.
*   **SAGA SENAI de Inovação:** Programa do SENAI que identifica e fomenta soluções inovadoras para demandas do mercado.

### 1.4 Referências

*   Demanda "Gestão Digital de Estágios" do SAGA SENAI de Inovação.
*   [Modelo Documento de Visão (Glauco Todesco - Projeto Integrador IV)](https://glaucotodesco.notion.site/Projeto-Integrador-IV-23f5d52a81f580fa968efa2a765f24ea)

### 1.5 Visão Geral do Documento

Este documento está estruturado para apresentar a justificativa do projeto, detalhando a oportunidade de negócio e o problema atual. Em seguida, descreve a declaração de posicionamento do produto, identifica os principais stakeholders e perfis de usuários, detalha as características e funcionalidades esperadas, e aborda requisitos de alto nível e qualidades do sistema.

---

## 2. Posicionamento

Este capítulo descreve a oportunidade de negócio que o SGE visa capitalizar, o problema que pretende resolver e uma descrição concisa do produto, culminando em sua declaração de posicionamento.

### 2.1 Oportunidade de Negócio

A oportunidade de negócio reside na lacuna gerada pela ineficiência da gestão manual de programas de estágio. Empresas que ainda utilizam planilhas e processos manuais perdem tempo valioso, enfrentam dificuldades na organização de informações e na tomada de decisões estratégicas sobre o desenvolvimento de seus talentos. Um sistema automatizado representa uma oportunidade de otimizar recursos, melhorar a experiência de estágio e agregar valor significativo à gestão de talentos da organização.

### 2.2 Problema a Ser Resolvido

O problema central é a gestão ineficiente do programa de estágio, atualmente realizada de forma manual com planilhas de Excel. Isso resulta em:

*   Perda excessiva de tempo dos coordenadores no controle de frequência, avaliação de desempenho e geração de relatórios.
*   Inconsistência e dificuldade na organização das informações dos estagiários.
*   Aumento da probabilidade de erros humanos nos registros.
*   Dificuldade na análise de desempenho e na tomada de decisões eficazes relacionadas ao programa de estágio.
*   Impacto negativo na qualidade do acompanhamento e desenvolvimento dos estagiários.

### 2.3 Descrição do Produto

O "Sistema de Gestão de Estágios" (SGE) será uma plataforma digital robusta e intuitiva projetada para automatizar e centralizar a administração de programas de estágio. Ele fornecerá ferramentas para controle de frequência, registro e acompanhamento de avaliações de desempenho, e geração automática de relatórios gerenciais e operacionais, visando otimizar a gestão, aumentar a eficiência e facilitar a tomada de decisões.

### 2.4 Declaração de Posição do Produto

*Para **Coordenadores de Estágio e Equipes de RH**, que **necessitam de eficiência e precisão na gestão de seus programas de estágio e no acompanhamento de estagiários**, o **Sistema de Gestão de Estágios (SGE)** é uma **plataforma de gestão de talentos** que **elimina a burocracia manual, otimiza o tempo e fornece dados confiáveis para uma tomada de decisão estratégica**.*

---

## 3. Stakeholders e Usuários

Este capítulo identifica as partes interessadas no projeto e detalha os perfis e necessidades dos usuários finais do SGE.

### 3.1 Identificação dos Stakeholders

*   **Coordenador de Estágios:** Principal usuário e interessado na otimização de seu tempo e processos.
*   **Departamento de Recursos Humanos (RH):** Responsável pelas políticas de estágio e pelo bem-estar dos estagiários.
*   **Estagiários:** Utilizarão o sistema para registrar frequência e acessar suas avaliações.
*   **Gerência/Diretoria da Empresa:** Interessa-se pelos relatórios de desempenho e pela eficiência global do programa.
*   **Professor:** Orientador e avaliador do projeto.

### 3.2 Perfis dos Usuários

*   **Coordenador de Estágios:** Profissional com conhecimento no programa de estágio da empresa, responsável por lançar e monitorar frequências, realizar e registrar avaliações, e gerar relatórios. Busca otimizar seu tempo e ter uma visão clara do desempenho dos estagiários.
*   **Estagiário:** Estudante em início de carreira, buscando desenvolvimento profissional. Interagirá com o sistema para registrar sua presença e, potencialmente, visualizar seu progresso e feedback.
*   **Analista de RH:** Profissional do departamento de pessoal que pode necessitar acessar informações consolidadas sobre os estagiários para fins administrativos e de compliance.

### 3.3 Necessidades dos Usuários e Stakeholders

*   **Coordenador de Estágios:** Necessita de um método ágil para registrar a frequência, uma ferramenta intuitiva para lançar e acompanhar avaliações, e a capacidade de gerar relatórios detalhados sem esforço manual.
*   **Estagiário:** Precisa de um meio claro e fácil para registrar sua presença e acesso facilitado ao seu histórico de avaliações.
*   **RH/Gerência:** Requer informações precisas e relatórios consolidados para análise de desempenho do programa de estágio e para decisões estratégicas.
*   **Todos:** Eliminar erros, garantir a consistência dos dados e aumentar a eficiência geral do processo.

### 3.4 Ambiente Operacional

O Sistema de Gestão de Estágios (SGE) será disponibilizado como uma **aplicação web**, acessível via navegadores em diferentes dispositivos, e também como uma **aplicação mobile**, desenvolvida para dispositivos móveis (smartphones e tablets). Ambas as interfaces de usuário (web e mobile) se conectarão a um **backend unificado e centralizado**, que será responsável pela lógica de negócios, gestão de dados e integração com sistemas futuros, garantindo a consistência e a disponibilidade das informações em todas as plataformas.

---

## 4. Descrição do Produto

Este capítulo detalha a perspectiva do produto, suas principais funcionalidades, suposições, dependências e limitações conhecidas.

### 4.1 Perspectiva do Produto

O Sistema de Gestão de Estágios (SGE) será uma **substituição de legado**, migrando um processo de gestão manual e descentralizado (baseado em planilhas de Excel) para uma solução digital integrada e automatizada. Ele representa uma evolução significativa na forma como a empresa gerencia seus estagiários.

### 4.2 Principais Funcionalidades

*   **Gestão de Estagiários:** Cadastro, edição e visualização de informações básicas dos estagiários.
*   **Controle de Frequência:** Registro automatizado ou facilitado da presença e ausências dos estagiários.
*   **Registro e Acompanhamento de Avaliações:** Criação, aplicação e armazenamento de avaliações de desempenho dos estagiários, com histórico.
*   **Geração de Relatórios:** Capacidade de gerar relatórios de desempenho, frequência e status do programa de estágio.
*   **Notificações:** Alertas sobre avaliações pendentes ou faltas (possível inferência para aumentar a eficiência).

### 4.3 Suposições e Dependências

*   **Suposições:**
    *   A empresa possui infraestrutura de rede e acesso à internet para operar o sistema (se for web).
    *   Os usuários (coordenadores e estagiários) possuem proficiência básica em informática para interagir com a interface.
    *   A empresa está disposta a adotar uma nova metodologia de trabalho para a gestão de estágios.
*   **Dependências:**
    *   Colaboração ativa dos coordenadores de estágio e do RH na definição e teste das funcionalidades.
    *   Disponibilidade de um ambiente de desenvolvimento e implantação adequado.


### 4.4 Limitações

A versão inicial do Sistema de Gestão de Estágios (SGE) terá um escopo focado nas funcionalidades essenciais para otimizar a gestão e o acompanhamento de estagiários. Portanto, as seguintes funcionalidades e integrações **não serão incluídas** nesta primeira fase de desenvolvimento:

*   **Processo de Pagamento e Gestão Financeira:** O sistema não incluirá módulos para o cálculo da folha de pagamento de estagiários, emissão de holerites, gestão de benefícios, ou qualquer outra funcionalidade financeira. Seu foco principal é a gestão de frequência e desempenho.
    *   *Justificativa:* São funcionalidades complexas que demandam integração com sistemas de folha de pagamento e conformidade com leis trabalhistas/tributárias, desviando o foco do core do problema a ser resolvido inicialmente.

*   **Processo Seletivo e Recrutamento de Estagiários:** O SGE não oferecerá ferramentas para o recrutamento de novos estagiários, como publicação de vagas, gestão de currículos, agendamento de entrevistas ou funil de seleção. A premissa é que os estagiários já foram selecionados e contratados antes de serem inseridos no sistema.
    *   *Justificativa:* O processo seletivo é um módulo extenso e especializado de RH, que adicionaria uma camada significativa de complexidade e não está diretamente ligado ao acompanhamento do estagiário *durante* seu período de estágio.

*   **Integração Direta com Outros Sistemas Corporativos (Ex: ERP, RHIS, Ponto Eletrônico):** A versão inicial não terá integração automatizada com sistemas de Gestão Empresarial (ERP), sistemas de Informação de Recursos Humanos (HRIS) ou sistemas de ponto eletrônico já existentes na empresa. A importação/exportação de dados, se necessária, será manual ou via relatórios.
    *   *Justificativa:* Integrações são geralmente complexas e requerem um mapeamento detalhado de dados e APIs. Para uma primeira versão, focar na funcionalidade interna do sistema é mais estratégico para validar o conceito.

*   **Módulos de Treinamento e Desenvolvimento Avançado:** Além das avaliações de desempenho básicas, o sistema não incluirá funcionalidades para gestão de planos de carreira, trilhas de aprendizagem, cursos online ou outros módulos de desenvolvimento profissional detalhados para estagiários.
    *   *Justificativa:* O foco inicial é a avaliação do desempenho e frequência, que são os pontos críticos da gestão manual atual. Módulos de T&D são um aprofundamento que pode ser adicionado em fases posteriores.

*   **Funcionalidades de Gamificação ou Engajamento Social:** A versão inicial não terá elementos de gamificação (pontuação, rankings, badges) ou funcionalidades de rede social/colaboração (fóruns, chats internos avançados) para estagiários ou coordenadores.
    *   *Justificativa:* Embora possam ser valiosas para engajamento, são features que adicionam complexidade e não são essenciais para resolver a dor principal da gestão ineficiente.

*   **Personalização Avançada de Formulários de Avaliação:** Embora o sistema permita o registro de avaliações, a capacidade de o usuário final (Coordenador) criar ou personalizar dinamicamente campos e fluxos complexos em formulários de avaliação não será implementada inicialmente. Os modelos de avaliação serão pré-definidos ou configurados por administradores.
    *   *Justificativa:* A customização dinâmica é tecnicamente complexa e pode introduzir vulnerabilidades se não fo
---

## 5. Requisitos de Alto Nível

Este capítulo lista os requisitos funcionais (o que o sistema deve fazer) e não funcionais (como o sistema deve fazer) em um nível abstrato.

### 5.1 Requisitos Funcionais (RF)

*   O SGE deve permitir o cadastro e gerenciamento de estagiários.
*   O SGE deve permitir o registro e o controle da frequência dos estagiários.
*   O SGE deve suportar a criação e aplicação de formulários de avaliação de desempenho para estagiários.
*   O SGE deve permitir o registro e o histórico das avaliações de desempenho.
*   O SGE deve ser capaz de gerar relatórios de frequência, desempenho e status do programa de estágio.
*   O SGE deve permitir diferentes níveis de acesso para Coordenadores, Estagiários e RH.

### 5.2 Requisitos Não Funcionais (RNF)

*   O SGE deve ser **intuitivo e fácil de usar** (usabilidade), visando reduzir a curva de aprendizado dos coordenadores.
*   O SGE deve garantir a **segurança** e a privacidade das informações dos estagiários e avaliações.
*   O SGE deve ser **confiável**, assegurando a integridade dos dados de frequência e avaliações.
*   O SGE deve apresentar **bom desempenho**, carregando telas e gerando relatórios de forma ágil.

---

## 6. Características de Qualidade do Produto

Este capítulo descreve os atributos de qualidade que o SGE deve possuir.

*   **Usabilidade:** O sistema deve ter uma interface de usuário clara, consistente e de fácil navegação, minimizando a necessidade de treinamento e facilitando o registro de dados e a geração de relatórios.
*   **Confiabilidade:** Os dados de frequência e avaliação devem ser armazenados de forma segura e consistente, garantindo que as informações inseridas sejam mantidas íntegras e acessíveis quando necessário.
*   **Desempenho:** As operações de registro, consulta e geração de relatórios devem ser executadas em tempo hábil, sem atrasos significativos que possam comprometer a eficiência do usuário.
*   **Segurança:** Todas as informações sensíveis (dados pessoais de estagiários, resultados de avaliações) devem ser protegidas contra acessos não autorizados, perdas ou modificações indevidas. O sistema deve implementar controle de acesso baseado em papéis.
*   **Portabilidade:** (Ainda não definido, mas considere se o sistema precisará rodar em diferentes navegadores, sistemas operacionais ou dispositivos móveis. Para uma aplicação web, a portabilidade entre navegadores é um requisito comum.)

---

---

## 7. Restrições

Este capítulo aborda os fatores limitantes que podem influenciar o desenvolvimento do projeto, impondo condições ou requisitos obrigatórios à sua execução e à construção do sistema.

*   **Restrições Tecnológicas:**
    *   **Linguagem de Programação e Frameworks:** O desenvolvimento do sistema será prioritariamente realizado utilizando as tecnologias e linguagens de programação dominadas pela equipe de desenvolvimento e/ou aquelas especificamente recomendadas ou ensinadas no contexto do curso/projeto integrador. Isso visa otimizar o tempo de aprendizado e garantir a viabilidade da entrega.
    *   **Infraestrutura de Hospedagem:** Para a fase de prototipagem e desenvolvimento inicial, a escolha da infraestrutura de hospedagem (para o backend e frontend web) será limitada a opções de baixo custo ou gratuitas, como serviços de nuvem com camadas gratuitas (free tiers) ou plataformas de PaaS (Platform as a Service) que se adequem ao orçamento disponível e à complexidade da aplicação.
    *   **Banco de Dados:** A escolha do sistema de gerenciamento de banco de dados (SGBD) será baseada na compatibilidade com as tecnologias de desenvolvimento selecionadas e na facilidade de uso para prototipagem e ambientes de baixa escala, priorizando soluções de código aberto.

*   **Restrições de Negócio e Projeto:**
    *   **Prazo de Entrega Acadêmico:** O desenvolvimento e a entrega da primeira versão funcional do SGE estarão vinculados aos prazos estabelecidos pelo cronograma do Projeto Integrador IV, que é a principal diretriz para a conclusão e apresentação.
    *   **Recursos Humanos Limitados:** O projeto será desenvolvido por um número limitado de pessoas, o que impacta diretamente a quantidade de funcionalidades que podem ser implementadas e o ritmo de desenvolvimento.
    *   **Orçamento de Desenvolvimento:** O orçamento disponível para ferramentas, serviços de terceiros e infraestrutura de desenvolvimento é limitado/inexistente, exigindo a priorização de soluções de código aberto ou gratuitas sempre que possível.

*   **Restrições Legais e Regulatórias:**
    *   **Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018):** O sistema deve ser concebido e desenvolvido em conformidade com os princípios da LGPD, garantindo a privacidade, a segurança e o tratamento adequado dos dados pessoais dos estagiários e demais usuários. Isso inclui a coleta mínima de dados, consentimento, e direitos dos titulares.
    *   **Lei do Estágio (Lei nº 11.788/2008):** Embora os detalhes específicos sejam requisitos funcionais, a conformidade com a Lei do Estágio (como regras de frequência, duração do estágio, necessidade de termo de compromisso, relatórios de atividades) atua como uma restrição geral sobre o design das funcionalidades de controle e avaliação, assegurando que o sistema suporte as exigências legais.


---

## 8. Riscos

Este capítulo identifica os riscos iniciais que foram mapeados para o projeto, ou seja, eventos incertos que, se ocorrerem, podem impactar negativamente o cronograma, o escopo, a qualidade ou os recursos do desenvolvimento do SGE.

*   **Gerenciamento de Escopo (Scope Creep):**
    *   **Descrição:** A tendência natural de adicionar novas funcionalidades ou requisitos ao projeto após o escopo inicial ter sido definido, sem o devido controle ou ajuste de prazos e recursos.
    *   **Impacto Potencial:** Atrasos na entrega da versão inicial, sobrecarga de trabalho, diminuição da qualidade do produto devido à pressa para incluir tudo, ou até mesmo a não conclusão do projeto dentro do prazo acadêmico.
    *   **Mitigação Inicial:** Manter o foco nas funcionalidades essenciais definidas neste Documento de Visão para a primeira versão (MVP - Minimum Viable Product) e registrar todas as novas ideias para futuras versões do sistema.

*   **Desafios Técnicos e Curva de Aprendizado:**
    *   **Descrição:** Dificuldade em dominar rapidamente as tecnologias (linguagens, frameworks, bancos de dados) necessárias para o desenvolvimento das aplicações web e mobile, ou encontrar soluções para problemas técnicos complexos que possam surgir.
    *   **Impacto Potencial:** Atrasos significativos no cronograma, implementação de soluções subótimas ou menos seguras, e frustração durante o processo de desenvolvimento.
    *   **Mitigação Inicial:** Pesquisa e estudo aprofundado das tecnologias antes e durante o desenvolvimento, busca por apoio em comunidades online e com o professor, e foco em um conjunto tecnológico mais familiar ou com boa documentação.

*   **Restrições de Tempo do Projeto Acadêmico:**
    *   **Descrição:** A rigidez dos prazos de entrega acadêmicos pode limitar o tempo disponível para desenvolvimento, testes e refinamento do sistema.
    *   **Impacto Potencial:** Entrega de um produto com menos funcionalidades do que o planejado, menor nível de polimento/qualidade, ou necessidade de comprometer outras atividades para cumprir o prazo.
    *   **Mitigação Inicial:** Planejamento rigoroso do cronograma, definição de metas semanais/diárias, e priorização agressiva de funcionalidades para garantir que o core do sistema esteja pronto para a avaliação.

*   **Resistência à Adaptação dos Usuários:**
    *   **Descrição:** A dificuldade ou relutância dos futuros usuários (coordenadores de estágio, RH, estagiários) em abandonar os métodos manuais (planilhas de Excel) e adotar o novo sistema digital.
    *   **Impacto Potencial:** Baixa adesão ao sistema, não aproveitamento dos benefícios esperados (eficiência, precisão), e questionamentos sobre a validade da solução.
    *   **Mitigação Inicial:** Foco na usabilidade e simplicidade da interface, e se possível, envolvimento de potenciais usuários em testes iniciais para colher feedback e criar um senso de pertencimento ao projeto.

*   **Requisitos Incompletos ou Ambíguos:**
    *   **Descrição:** Embora a demanda inicial seja clara, detalhes sobre funcionalidades específicas ou regras de negócio podem não estar totalmente explicitados, levando a decisões de desenvolvimento baseadas em suposições incorretas.
    *   **Impacto Potencial:** Desenvolvimento de funcionalidades que não atendem exatamente à necessidade, retrabalho, e insatisfação dos stakeholders.
    *   **Mitigação Inicial:** Manter comunicação ativa com o professor e, se possível, com a "fonte" da demanda (o cenário da empresa), buscando esclarecimentos e validações constantes.

---

## 9. Cronograma de Marcos

Este capítulo apresenta uma visão geral dos marcos-chave e das entregas estimadas do projeto. Dada a fase atual de concepção (Documento de Visão), as datas exatas e o detalhamento do cronograma serão definidos em fases subsequentes de planejamento. No entanto, os marcos a seguir representam as principais etapas que guiarão o desenvolvimento do Sistema de Gestão de Estágios (SGE):

*   **Fase de Análise e Planejamento Detalhado:**
    *   **Conclusão do Documento de Visão:** Finalização e validação da visão do produto e escopo inicial. (Este marco, inclusive, você está prestes a atingir com este documento!)
    *   **Levantamento de Requisitos Detalhado:** Especificação aprofundada de todas as funcionalidades e requisitos não funcionais.
    *   **Definição da Arquitetura Técnica:** Escolha e validação das tecnologias e da estrutura técnica para o backend, frontend web e mobile.
    *   **Design de Interfaces (Wireframes/Protótipos):** Criação das telas e fluxos de usuário para as aplicações web e mobile.

*   **Fase de Desenvolvimento (Iterações/Sprints):**
    *   **Desenvolvimento do Backend (MVP):** Conclusão das funcionalidades essenciais do servidor e banco de dados para suportar as operações básicas.
    *   **Desenvolvimento do Frontend Web (MVP):** Implementação das interfaces web principais para as funcionalidades críticas.
    *   **Desenvolvimento do Aplicativo Mobile (MVP):** Implementação das interfaces mobile principais para as funcionalidades críticas.
    *   **Integração Backend-Frontend:** Conexão e comunicação entre as camadas de interface e o servidor.

*   **Fase de Testes e Validação:**
    *   **Testes Internos (Alpha):** Realização de testes pela equipe de desenvolvimento para identificar bugs e garantir a estabilidade.
    *   **Testes com Usuários (Beta):** Validação das funcionalidades e usabilidade com um grupo seleto de usuários finais (ex: coordenadores, estagiários).
    *   **Ajustes e Refinamentos:** Implementação de melhorias e correções com base no feedback dos testes.

*   **Fase de Implantação e Lançamento:**
    *   **Preparação do Ambiente de Produção:** Configuração e otimização da infraestrutura para o sistema em produção.
    *   **Lançamento da Versão Inicial (MVP):** Disponibilização do SGE para uso pelos usuários finais.
    *   **Monitoramento Pós-Lançamento:** Acompanhamento do desempenho e comportamento do sistema em produção.

---

## 10. Apêndices

Esta seção é dedicada a informações complementares, detalhes técnicos adicionais, glossários estendidos, diagramas, protótipos visuais e quaisquer outros materiais de apoio que, embora não façam parte da narrativa principal do Documento de Visão, são relevantes para o entendimento e o desenvolvimento do projeto.

No estágio atual de concepção inicial do Sistema de Gestão de Estágios (SGE), esta seção ainda não contém anexos detalhados. No entanto, ela será preenchida à medida que o projeto evoluir e novos artefatos forem criados.

*   **Exemplos de Conteúdo Futuro:**
    *   Diagramas de Fluxo de Processo (AS-IS e TO-BE)
    *   Diagramas de Caso de Uso
    *   Wireframes e Mockups de Telas
    *   Modelos de Dados (Entidade-Relacionamento)
    *   Glossário Detalhado de Termos Técnicos
    *   Resultados de Pesquisas de Mercado ou Benchmarking
    *   Planos de Teste ou Casos de Teste (em fases posteriores)
    *   Relatórios de Feedback de Usuários

### [**> Retornar à Página Inicial.**](/README.md)
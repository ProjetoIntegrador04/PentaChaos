# Relatório de Tarefas – PentaChaos

**Integrantes:** David Francisco, Daniel Marks, Gabriel Eliezer, José Henrique, Juan Pablo, Pablo, Pablo Vinicius, Rafael Rodrigues
**Professor:** Glauco Todesco

---

## Introdução

Este documento apresenta uma análise formal e atualizada do progresso do projeto em relação à lista de 19 requisitos obrigatórios, utilizando as informações detalhadas de desenvolvimento (CI, Backend, Frontend, Mobile) e a conclusão dos artefatos de planejamento (EAP, Termo de Abertura e Declaração de Escopo).

---

## 1. Requisitos Cumpridos (Concluídos ou com Evidência Clara de Implementação)

| Item | Descrição                                                  | Evidência no Relatório                                                                                                                        | Responsáveis                      |
| ---- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 4    | Uso de um banco de dados (SQL ou NoSQL)                    | A etapa de CI inclui validação de banco de dados. O Backend confirma o uso de PostgreSQL persistente configurado com volume Docker (db_data). | Rafael Rodrigues, Gabriel Eliezer |
| 6    | Aplicação Frontend integrada ao Backend                    | Comunicação integral estabelecida com o backend para rotinas de login e registro de ponto.                                                    | Pablo                             |
| 7    | Evidência no uso de metodologias ágeis ao longo do projeto | Uso de práticas de desenvolvimento controlado: commits separados por classe e uso de branches e PRs para gestão de features.                  | Gabriel Eliezer, Juan Pablo       |
| 10   | Login usando JWT e OAuth                                   | Funcionalidade de login concluída e validada para dois perfis.                                                                                | Pablo, Daniel                     |
| 12   | CI/CD (Github Actions ou equivalente)                      | Pipeline de Integração Contínua configurado em `.github/workflows`, com etapas de build, testes e imagem Docker.                              | David                             |
| 15   | Mínimo de dois tipos de usuários                           | Login validado para dois perfis distintos de usuários.                                                                                        | Pablo, Daniel                     |
| 16   | Entrega dentro dos prazos estipulados                      | Documentação de planejamento e demais entregas apresentadas dentro do prazo.                                                                  | José                              |
| 17   | Documento de visão                                         | Documento de Visão e Declaração de Escopo criados.                                                                                            | José                              |
| 18   | Proposta Inicial                                           | Termo de Abertura e EAP criados, formalizando a Proposta Inicial e Estrutura do Projeto.                                                      | José                              |
| 13   | Diagrama de classes do Backend                                            | Documento técnico concluido.                                                                | Gabriel Eliezer, Rafael Rodrigues |

---

## 2. Requisitos em Andamento (Em Execução ou com Implementação Parcial)

| Item | Descrição                                                                 | Status no Relatório                                                                        | Próxima Ação                                                                          | Responsáveis                      |
| ---- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------- |
| 1    | Aplicação Mobile integrada ao Backend                                     | 6 telas móveis concluídas.                                                                 | Finalizar a integração da tela "Cards" com o Backend.                                 | Daniel                            |
| 2    | Backend e Frontend implantado na AWS ou similar                           | Fase de deployment no ambiente de nuvem (EC2).                                             | Concluir a implantação da aplicação.                                                  | Rafael Rodrigues                  |
| 3    | Aplicação Mobile funcionando no celular                                   | Múltiplas telas concluídas.                                                                | Concluir as telas restantes da "Visão Estagiário" e validar o funcionamento completo. | Daniel                            |
| 9    | Uso de recursos avançados no Mobile (Câmera, GPS, Mapas, Push, SMS, etc.) | Início de implementação com funcionalidade GPS.                                            | Concluir a funcionalidade GPS aplicando correções de localização.                     | Daniel                            |
| 11   | Testes Mobile, Back e Front                                               | CI inclui testes automatizados. Backend testado via Postman.                               | Concluir a bateria de testes e garantir cobertura total para Front-end e Mobile.      | David                             |
| 14   | Desenho da arquitetura geral do sistema                                   | Documento técnico faltante.                                                                | Finalizar e entregar o artefato da Arquitetura Geral.                                 | Rafael Rodrigues, Gabriel Eliezer |
| 19   | Qualidade Final do Produto                                                | Front-end com ajustes e revisão geral pendentes. Backend em fase de estruturação completa. | Concluir polimento, revisão e implementação final.                                    | Squad                             |

---

## 3. Requisitos Pendentes ou Não Abordados

| Item | Descrição                        | Observação                                                       | Responsáveis |
| ---- | -------------------------------- | ---------------------------------------------------------------- | ------------ |
| 5    | Relatório de Segurança           | Documentação ou práticas formais de segurança não foram criadas. | José         |
| 8    | Artigo científico (documentação) | Documentação do artigo científico não foi criada.                | José         |

---

## Conclusão e Priorização

O projeto obteve avanço significativo, totalizando **9 requisitos cumpridos**, incluindo todos os itens de planejamento e gestão de tempo.
As prioridades imediatas são:

* Conclusão da documentação técnica pendente (itens 13 e 14);
* Integração Mobile-Backend (item 1) para iniciar os testes abrangentes;
* Mitigação do risco de conformidade referente à documentação formal (itens 5 e 8).

O requisito de **Recursos Avançados Mobile (9)** encontra-se em progresso e deve ser finalizado com a inclusão dos demais recursos necessários.
# **Gerenciamento de Branches**

Um gerenciamento eficiente de branches é fundamental para a organização e colaboração em projetos. Padrões amplamente adotados, como **Git Flow**, **GitHub Flow** e **Trunk-Based Development**, oferecem abordagens estruturadas que simplificam o trabalho em equipe, integração contínua e revisões de código.

---

### *Padrão Adotado*  

**Estrutura padrão:**  
`categoria/nome-da-tarefa`  

**Tipos de branch:**  
`feature/nome-da-feature`: Para desenvolvimento de novas funcionalidades.  
`bugfix/nome-do-bug`: Para corrigir bugs detectados.  
`hotfix/nome-do-hotfix`: Para correções urgentes no código em produção.  
`release/nome-da-versão`: Para preparar versões para produção.  
`chore/nome-da-tarefa`: Para tarefas de manutenção, como atualização de dependências.  


**Exemplos:**  
`feature/user-authentication`  
`bugfix/fix-login-error`  
`hotfix/critical-payment-issue`  
`release/v1.0.0`  
`chore/update-dependencies`  

---

### **Fluxo de Trabalho Comum**  

1. **Criar uma Branch:**  
   - Baseie-se na branch principal (`main`) ou de desenvolvimento (`develop`).  
   - Exemplo:  
     ```bash
     git checkout -b feature/user-authentication
     ```

2. **Trabalhar na Branch:**  
   - Realize commits com mensagens claras e no [formato padrão](commit-patterns.md).  

3. **Abrir um Pull Request (PR):**  
   - Ao concluir o desenvolvimento, abra um PR para revisão do código.

4. **Merge da Branch:**  
   - Após aprovação e validação, realize o merge na branch principal.

5. **Deletar a Branch:**  
   - Para evitar acúmulo de branches obsoletas.

---

### **Estrutura Recomendada:**  
```yaml
main
|
|-- develop
    |-- feature/login-system
    |-- feature/user-profile
    |-- bugfix/fix-login-error
```

---

### **Regras Gerais:**  

- Utilizar apenas letras minúsculas.  
- Sem uso de acentuação e caracteres especiais.  
- Substituir espaços por -  
- Nomear sempre em Inglês, de forma descritiva e curta.  
- Manter uma estrutura consistente: `categoria/descricao`.

---

### **Benefícios do Padrão:** 
1. **Organização:** 
   - Facilita o entendimento do propósito de cada branch.  
2. **Escalabilidade:**
   - Funciona bem para equipes de qualquer tamanho.  
3. **Integração:**
   - Compatível com CI/CD pipelines e ferramentas modernas.  
4. **Colaboração:**
   - Melhora o fluxo de trabalho em equipe e a revisão de código.  

Esse padrão é amplamente utilizado em projetos que seguem metodologias ágeis ou DevOps, proporcionando maior eficiência e controle.

---

### [**> Retornar à Página Inicial.**](/README.md)
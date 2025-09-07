# 📝 Diretrizes de Contribuição

Este documento define as regras básicas de contribuição e o padrão de commits para manter o histórico organizado.  
Seguindo esse padrão, conseguimos usar o histórico de commits como base para os relatórios do projeto.

---

## 📌 Convenções de Commit

### Estrutura

```bash
[Área] Descrição curta (#id_da_issue)
```

### Áreas

- **DB** → Banco de dados, migrations, scripts SQL  
- **API** → Rotas, endpoints, backend em Python  
- **FE** → Frontend, UI, React  
- **AUTH** → Autenticação e login  
- **DOC** → Documentação ou relatórios  
- **CHORE** → Configurações, setup, dependências  

### Exemplos

[DB] Criar tabela User (#2)

[API] Adicionar rota /login (#5)

[FE] Criar componente LoginPage (#7)

[AUTH] Implementar autenticação JWT (#9)

[DOC] Adicionar plano de tarefas de setembro (#11)

[CHORE] Configurar ESLint e Prettier

---

## 📌 Boas práticas

- Use **tempo presente**:  
  ✅ "Adiciona rota /login"  
  ❌ "Adicionou rota /login"  

- **Commits pequenos e frequentes**: cada tarefa lógica deve ter seu próprio commit.  

- Sempre que possível, **referencie a issue relacionada** com `#id`.  

---

## 📌 Branches

- **main** → versão estável do protótipo (apresentação).  
- **feature/nome-da-tarefa** → para cada nova funcionalidade ou ajuste.  
  - Ex: `feature/api-login`, `feature/fe-loginpage`, `feature/db-tables`.  
- Mande para revisão quando estiver testado e funcional

---

## 📌 Issues e Tarefas

- Cada issue representa uma **tarefa semanal**.  
- No commit, referencie a issue pelo seu id no GitHub:
[FE] Criar componente LoginPage (#3).

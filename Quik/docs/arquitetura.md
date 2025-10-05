# Arquitetura do Projeto Quik (Django + React)

Este documento descreve a arquitetura de software do projeto Quik, que adota um modelo cliente-servidor desacoplado. O backend é uma API RESTful construída com Django e Django REST Framework, enquanto o frontend é desenvolvida com React.

## Visão Geral

A arquitetura é dividida em duas partes principais:

1.  **Backend (API RESTful):** Construído com **Django**, é responsável por toda a lógica de negócio, manipulação de dados, autenticação e comunicação com o banco de dados. Ele expõe endpoints RESTful que o frontend consome.
2.  **Frontend:** Construído com **React**, é responsável por toda a interface do usuário e experiência de navegação. Ele é executado no navegador do cliente e se comunica com o backend através de requisições HTTP para a API.

Este desacoplamento permite que o desenvolvimento do frontend e do backend ocorra de forma independente.

---

## Tecnologias Utilizadas

*   **Backend:**
    *   **Python 3.11**
    *   **Django 5.2:** Framework web principal.
    *   **Django REST Framework (DRF):** Toolkit para construir APIs RESTful.
    *   **SQLite3:** Banco de dados padrão para desenvolvimento.
*   **Frontend:**
    *   **React:** Biblioteca para construção da interface de usuário.
    *   **Vite:** Ferramenta de build e servidor de desenvolvimento para o frontend.
    *   **Axios/Fetch API:** Para realizar as chamadas HTTP para o backend.

---

## Estrutura de Pastas

A estrutura do projeto está organizada da seguinte forma:

```
Qwik-prototype/
├── api/                  # App Django para a lógica da API
│   ├── migrations/       # Migrações do banco de dados
│   ├── models.py         # Modelos de dados (ORM do Django)
│   ├── serializers.py    # Serializadores para converter dados (Model <-> JSON)
│   ├── views.py          # Lógica das requisições (ViewSets)
│   ├── urls.py           # Rotas de URL específicas da API
│   └── ...
├── Quik/                 # Pasta de configuração do projeto Django
│   ├── frontend/         # Contém a aplicação React
│   │   └── react-app/
│   │       ├── src/      # Código fonte do React (componentes, páginas)
│   │       └── ...
│   ├── settings.py       # Configurações principais do Django
│   ├── urls.py           # Rotas de URL principais do projeto
│   └── ...
├── manage.py             # Utilitário de linha de comando do Django
└── venv/                 # Ambiente virtual Python
```

---

## Backend (Django REST API)

O backend é construído seguindo as convenções do Django e do Django REST Framework.

### Fluxo de uma Requisição

1.  **`Quik/urls.py`:** O roteador principal do Django recebe a requisição. Se a URL começar com `/api/`, ele a repassa para o roteador do app `api`.
2.  **`api/urls.py`:** O `DefaultRouter` do DRF mapeia a requisição (verbo HTTP + URL) para a ação apropriada em um `ViewSet`.
    *   `GET /api/candidatos/` -> `list()` no `CandidatoViewSet`.
    *   `POST /api/candidatos/` -> `create()` no `CandidatoViewSet`.
    *   `GET /api/candidatos/{id}/` -> `retrieve()` no `CandidatoViewSet`.
3.  **`api/views.py`:** O `ViewSet` executa a lógica. Ele interage com os modelos e utiliza os serializers.
    *   Para criar ou atualizar, ele usa um `Serializer` para validar os dados recebidos.
    *   Para ler, ele busca os dados do banco através de um `Model` e usa um `Serializer` para converter o objeto em JSON.
4.  **`api/serializers.py`:** O `Serializer` converte os objetos dos `Models` em JSON para serem enviados na resposta, ou valida e converte o JSON da requisição em dados que podem ser salvos no banco. A lógica de criação de usuários aninhados (User + Candidato/Recrutador) está aqui.
5.  **`api/models.py`:** Define a estrutura das tabelas do banco de dados (`User`, `Candidato`, `Recrutador`) e as relações entre elas. O ORM do Django gerencia toda a comunicação com o banco.

### Autenticação

A autenticação é baseada em tokens.

1.  **Login:** O cliente envia `username` e `password` para o endpoint `POST /api/login/`.
2.  **Token:** Se as credenciais forem válidas, a API retorna um token de autenticação.
3.  **Requisições Autenticadas:** O cliente deve incluir este token no cabeçalho `Authorization` de todas as requisições subsequentes (ex: `Authorization: Token <seu_token>`).

---

## Frontend (React SPA)

O frontend é uma aplicação React moderna, localizada em `Quik/frontend/react-app/`.

*   **Componentes:** A interface é dividida em componentes reutilizáveis (ex: botões, formulários) e páginas (ex: `Login.jsx`, `DashboardCandidato.jsx`).
*   **Comunicação com a API:** O React utiliza uma biblioteca como `axios` ou a `Fetch API` nativa do navegador para fazer chamadas aos endpoints da API Django.
    *   **Exemplo:** Para registrar um candidato, o formulário em `CadastroCandidato.jsx` coletará os dados e enviará uma requisição `POST` para `http://127.0.0.1:8000/api/candidatos/` com os dados no formato JSON.
*   **Gerenciamento de Estado:** O estado da aplicação (como informações do usuário logado e o token de autenticação) é gerenciado dentro do React, seja através de hooks nativos (`useState`, `useContext`) ou uma biblioteca de gerenciamento de estado.

---

## Integração (Desenvolvimento)

Durante o desenvolvimento, o backend e o frontend são executados em servidores separados:

*   **Backend:** `python manage.py runserver` (geralmente na porta `8000`).
*   **Frontend:** `npm run dev` (geralmente na porta `5173` ou `3000`).

Para que o frontend (ex: `localhost:5173`) possa fazer requisições para o backend (ex: `localhost:8000`), é necessário configurar o **CORS (Cross-Origin Resource Sharing)** no Django para permitir requisições vindas da origem do frontend.
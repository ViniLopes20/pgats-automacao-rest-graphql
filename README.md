# API REST e GraphQL - Cadastro de Alunos e Notas

## Instrução

Este repositório contém duas APIs completas para cadastro de alunos, notas e usuários: uma API REST e uma API GraphQL, ambas com autenticação JWT, documentação, exemplos de uso e testes automatizados. Siga as instruções abaixo para instalar, configurar, rodar e testar cada API separadamente ou em conjunto, além de consultar exemplos de uso e integração contínua.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Regras de Negócio](#regras-de-negócio)
- [Estrutura do Projeto](#estrutura-do-projeto)
  - [REST](#estrutura-rest)
  - [GraphQL](#estrutura-graphql)
- [Configuração do Ambiente (.env)](#configuração-do-ambiente-env)
- [Instalação](#instalação)
- [Rodando a API REST](#rodando-a-api-rest)
- [Rodando a API GraphQL](#rodando-a-api-graphql)
- [Rodando os Testes](#rodando-os-testes)
  - [Testes REST - Controller](#testes-rest---controller)
  - [Testes REST - External](#testes-rest---external)
  - [Testes GraphQL - External](#testes-graphql---external)
  - [Rodando todos os testes](#rodando-todos-os-testes)
  - [Scripts disponíveis](#scripts-disponíveis)
  - [Integração Contínua (CI) com GitHub Actions](#integração-contínua-ci-com-github-actions)
- [Rotas Principais REST](#rotas-principais-rest)
  - [Usuários](#usuários)
  - [Alunos](#alunos)
  - [Notas](#notas)
- [Exemplo de uso REST](#exemplo-de-uso-rest)
- [Rotas Principais GraphQL](#rotas-principais-graphql)
  - [Mutations](#mutations)
  - [Queries](#queries)
- [Exemplo de uso GraphQL](#exemplo-de-uso-graphql)

## Funcionalidades

- Registro de alunos (matrícula gerada automaticamente)
- Listagem de alunos com notas e matrícula
- Cadastro e listagem de usuários
- Login de usuário
- Cadastro de notas para alunos

## Regras de Negócio

1. Não pode inserir uma nota menor que 0.
2. Não pode inserir uma nota maior que 10.
3. Precisa estar autenticado via JWT (Bearer Token) para cadastrar/listar aluno, nota ou usuário.
4. Não pode adicionar uma nota para um aluno que não existe.
5. Não deve ser possível cadastrar dois alunos com o mesmo ID de matrícula (gerado automaticamente).
6. Não deve ser possível cadastrar usuários com o mesmo login.

## Estrutura do Projeto

### Estrutura REST

- Banco de dados em memória (variáveis)
- Diretórios: `controller`, `service`, `model`, `middleware`, `test/REST/controller`, `test/REST/external`
- Arquivos principais: `app.js`, `server.js`
- Documentação Swagger disponível em `/api-docs`

### Estrutura GraphQL

- Diretório: `graphql/`
  - `app.js`, `server.js`, `schema.js`, `resolvers.js`, `auth.js`
- Testes: `test/GraphQL/external/`

## Configuração do Ambiente (.env)

Antes de rodar as APIs ou os testes, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# REST
PORT_REST=
BASE_URL_REST=

# GraphQL
PORT_GRAPHQL=
BASE_URL_GRAPHQL=
```

Essas variáveis definem as portas dos servidores, as URLs base utilizadas nos testes automatizados.

No GitHub Actions, as variáveis são definidas automaticamente pelo workflow.

## Instalação

```bash
cd pgats-automacao-rest-graphql
npm install
```

## Rodando a API REST

```bash
npm run start:rest
# Acesse http://localhost:${PORT_REST}/api-docs para a documentação Swagger
```

## Rodando a API GraphQL

```bash
npm run start:graphql
# Acesse http://localhost:${PORT_GRAPHQL}$/graphql para o Apollo Server do GraphQL
```

Observações:

- O endpoint GraphQL exige autenticação JWT para queries e mutations protegidas.
- O arquivo `.env` pode ser compartilhado entre REST e GraphQL.

## Rodando os Testes

Os testes utilizam **Mocha**, **Chai** e **Supertest**.

### Testes REST - Controller

```bash
npm run test:controller
# Executa apenas os testes controller da API REST
```

### Testes REST - External

```bash
npm run test:external:rest
# Executa apenas os testes external da API REST
```

### Testes GraphQL - External

```bash
npm run test:external:graphql
# Executa apenas os testes external da API GraphQL
```

### Rodando todos os testes

```bash
npm test
# Executa todos os testes (REST e GraphQL)
```

### Scripts disponíveis

- `npm run start:rest` — Inicia o servidor REST
- `npm run start:graphql` — Inicia o servidor GraphQL
- `npm run test:controller` — Executa apenas os testes de controller REST
- `npm run test:external:rest` — Executa todos os testes REST (controller e external)
- `npm run test:external:graphql` — Executa apenas os testes GraphQL
- `npm test` — Executa todos os testes

### Integração Contínua (CI) com GitHub Actions

Os testes automatizados são executados automaticamente a cada push ou pull request na branch `main` através do workflow do GitHub Actions, definido em `.github/workflows/apiTest.yaml`.

Durante a execução do workflow:

- As dependências são instaladas
- O ambiente é configurado
- Os testes de controller, external e GraphQL são executados

Assim, você pode acompanhar o status dos testes diretamente na interface do GitHub, sem necessidade de rodar localmente.

## Rotas Principais REST

### Usuários

- `POST /usuarios` — Cadastrar usuário `{ login, password }`
- `GET /usuarios` — Listar usuários (requer Bearer Token)
- `POST /login` — Login `{ login, password }` (retorna token JWT)

### Alunos

- `POST /alunos` — Cadastrar aluno `{ nome }` (requer Bearer Token, matrícula gerada automaticamente)
- `GET /alunos` — Listar alunos com notas e matrícula (requer Bearer Token)

### Notas

- `POST /notas` — Cadastrar nota `{ matricula, nota }` (requer Bearer Token)

## Exemplo de uso REST

1. Cadastre um usuário:

```bash
curl -X POST http://localhost:3000/usuarios -H 'Content-Type: application/json' -d '{"login":"admin","password":"123"}'
```

2. Faça login para obter o token:

```bash
curl -X POST http://localhost:3000/login -H 'Content-Type: application/json' -d '{"login":"admin","password":"123"}'
```

3. Use o token para acessar rotas protegidas:

```bash
curl -X POST http://localhost:3000/alunos -H 'Authorization: Bearer SEU_TOKEN' -H 'Content-Type: application/json' -d '{"nome":"Aluno Teste"}'
```

## Rotas Principais GraphQL

### Mutations

- `registerUser(login: String!, password: String!): Usuario!` — Cadastrar usuário
- `login(login: String!, password: String!): AuthPayload!` — Login (retorna token JWT)
- `registerAluno(nome: String!): Aluno!` — Cadastrar aluno (requer Bearer Token)
- `addNota(matricula: String!, nota: Float!): String!` — Cadastrar nota (requer Bearer Token)

### Queries

- `usuarios: [Usuario!]!` — Listar usuários (requer Bearer Token)
- `alunos: [Aluno!]!` — Listar alunos com notas e matrícula (requer Bearer Token)

## Exemplo de uso GraphQL

1. Faça login para obter o token (mutation):

```graphql
mutation {
  login(login: "admin", password: "12345678") {
    token
  }
}
```

2. Use o token para acessar queries/mutations protegidas no playground ou via HTTP:

- Header: `Authorization: Bearer SEU_TOKEN`
- Exemplo de mutation:

```graphql
mutation {
  registerAluno(nome: "Novo Aluno") {
    matricula
    nome
    notas
  }
}
## Rotas Principais GraphQL
```

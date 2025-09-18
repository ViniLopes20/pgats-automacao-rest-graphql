# API REST - Cadastro de Alunos e Notas

## Instrução

Este repositório contém uma API REST para cadastro de alunos, notas e usuários, com autenticação JWT e testes automatizados. Siga as instruções abaixo para instalar, configurar, rodar e testar a aplicação, além de consultar exemplos de uso e integração contínua.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Regras de Negócio](#regras-de-negócio)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração do Ambiente (.env)](#configuração-do-ambiente-env)
- [Instalação](#instalação)
- [Rodando a API](#rodando-a-api)
- [Rodando os Testes](#rodando-os-testes)
  - [Scripts disponíveis](#scripts-disponíveis)
  - [Integração Contínua (CI) com GitHub Actions](#integração-contínua-ci-com-github-actions)
- [Rotas Principais](#rotas-principais)
  - [Usuários](#usuários)
  - [Alunos](#alunos)
  - [Notas](#notas)
- [Exemplo de uso](#exemplo-de-uso)

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

- Banco de dados em memória (variáveis)
- Diretórios: `controller`, `service`, `model`, `middleware`, `test/controller`, `test/external`
- `app.js` e `server.js` (importação para testes)
- Documentação Swagger disponível em `/api-docs`

## Configuração do Ambiente (.env)

Antes de rodar a API ou os testes, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=
BASE_URL_REST=
```

Essas variáveis definem a porta do servidor e a URL base utilizada nos testes automatizados.

No GitHub Actions, a variável `BASE_URL_REST` é definida automaticamente pelo workflow.

## Instalação

```bash
cd pgats-automacao-rest-graphql
npm install
```

## Rodando a API

```bash
npm start
# Acesse http://localhost:3000/api-docs para a documentação Swagger
```

## Rodando os Testes

Os testes utilizam **Mocha**, **Chai** e **Supertest**.

```bash
npm test
# Executa todos os testes (controller e external)
```

### Scripts disponíveis

- `npm run test-controller` — Executa apenas os testes de controller
- `npm run test-external` — Executa apenas os testes de external

### Integração Contínua (CI) com GitHub Actions

Os testes automatizados são executados automaticamente a cada push ou pull request na branch `main` através do workflow do GitHub Actions, definido em `.github/workflows/apiTest.yaml`.

Durante a execução do workflow:

- As dependências são instaladas
- O ambiente é configurado
- Os testes de controller e external são executados

Assim, você pode acompanhar o status dos testes diretamente na interface do GitHub, sem necessidade de rodar localmente.

## Rotas Principais

### Usuários

- `POST /usuarios` — Cadastrar usuário `{ login, password }`
- `GET /usuarios` — Listar usuários (requer Bearer Token)
- `POST /login` — Login `{ login, password }` (retorna token JWT)

### Alunos

- `POST /alunos` — Cadastrar aluno `{ nome }` (requer Bearer Token, matrícula gerada automaticamente)
- `GET /alunos` — Listar alunos com notas e matrícula (requer Bearer Token)

### Notas

- `POST /notas` — Cadastrar nota `{ matricula, nota }` (requer Bearer Token)

## Exemplo de uso

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

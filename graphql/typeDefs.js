const { gql } = require('apollo-server-express');

module.exports = gql`
  type Aluno {
    matricula: String!
    nome: String!
    notas: [Float!]!
  }

  type Usuario {
    login: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    alunos: [Aluno!]!
    usuarios: [Usuario!]!
  }

  type Mutation {
    registerAluno(nome: String!): Aluno!
    registerUser(login: String!, password: String!): Usuario!
    login(login: String!, password: String!): AuthPayload!
    addNota(matricula: String!, nota: Float!): String!
  }
`;

const alunoService = require('../service/alunoService');
const userService = require('../service/userService');
const notaService = require('../service/notaService');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'jwt_secret';

module.exports = {
  Query: {
    alunos: async (parent, args, context) => {
      if (!context.user) throw new Error('Não autenticado');
      return alunoService.listarAlunosComNotas();
    },
    usuarios: async (parent, args, context) => {
      if (!context.user) throw new Error('Não autenticado');
      return userService.listarUsuarios();
    },
  },
  Mutation: {
    registerAluno: async (parent, { nome }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const result = await alunoService.register({ nome });
      if (result.status !== 201) throw new Error(result.message);
      return { matricula: result.matricula, nome, notas: [] };
    },
    registerUser: async (parent, { login, password }) => {
      const result = await userService.register({ login, password });
      if (result.status !== 201) throw new Error(result.message);
      return { login };
    },
    login: async (parent, { login, password }) => {
      const result = await userService.login({ login, password });
      if (!result.token) throw new Error(result.message);
      return { token: result.token };
    },
    addNota: async (parent, { matricula, nota }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const result = await notaService.addNota({ matricula, nota });
      if (result.status !== 201) throw new Error(result.message);
      return 'Nota cadastrada com sucesso';
    },
  },
  Aluno: {
    notas: (aluno) => aluno.notas || [],
  },
};

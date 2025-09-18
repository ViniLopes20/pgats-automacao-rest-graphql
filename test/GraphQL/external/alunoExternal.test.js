const request = require("supertest");
const { expect, use } = require("chai");
const chaiExclude = require("chai-exclude");

use(chaiExclude);

require("dotenv").config();

let responseLogin;
before(async () => {
  const loginMutation = require("../fixture/requisicoes/login/loginUser.json");
  responseLogin = await request(process.env.BASE_URL_GRAPHQL)
    .post("/graphql")
    .send(loginMutation);
});

describe("/alunos - POST API GraphQL External", () => {
  const alunoMutation = require("../fixture/requisicoes/aluno/registerAluno.json");

  it("Erro deve ocorrer ao tentar cadastrar um aluno sem nome", async () => {
    const alunoWithoutNameMutation = `mutation { registerAluno(nome: "") { matricula nome notas } }`;
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/graphql")
      .set("Authorization", `Bearer ${responseLogin.body.data.login.token}`)
      .send({ query: alunoWithoutNameMutation });

    const alunoResponseError = require("../fixture/response/aluno/responseWithErrorToRegister.json");
    expect(response.body.errors[0].message).to.equal(
      alunoResponseError.message
    );
  });

  const testesDeErrosDeToken = require("../fixture/response/token/responseWithError.json");
  testesDeErrosDeToken.forEach((testes) => {
    it(`Erro deve ocorrer ao tentar acessar a listagem ${testes.nomeTeste}`, async () => {
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/graphql")
        .set("Authorization", `Bearer ${testes.token}`)
        .send(alunoMutation);

      expect(response.body.errors[0].message).to.equal("Não autenticado");
    });
  });

  it("Sucesso deve acontecer ao cadastrar um novo aluno que não existe", async () => {
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/graphql")
      .set("Authorization", `Bearer ${responseLogin.body.data.login.token}`)
      .send(alunoMutation);

    const alunoResponseSuccess = require("../fixture/response/aluno/responseWithSuccessToRegister.json");
    expect(response.body.data.registerAluno)
      .excluding("matricula")
      .to.deep.equal(alunoResponseSuccess.registerAluno);
  });
});

describe("/alunos - GET API GraphQL External", () => {
  const alunoQuery = require("../fixture/requisicoes/aluno/listAluno.json");

  const testesDeErrosDeToken = require("../fixture/response/token/responseWithError.json");
  testesDeErrosDeToken.forEach((testes) => {
    it(`Erro deve ocorrer ao tentar acessar a listagem ${testes.nomeTeste}`, async () => {
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/graphql")
        .set("Authorization", `Bearer ${testes.token}`)
        .send(alunoQuery);

      expect(response.body.errors[0].message).to.equal("Não autenticado");
    });
  });

  it("Sucesso deve acontecer ao exibir a listagem de alunos", async () => {
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/graphql")
      .set("Authorization", `Bearer ${responseLogin.body.data.login.token}`)
      .send(alunoQuery);

    const alunoResponseSuccess = require("../fixture/response/aluno/responseWithSuccessToList.json");
    expect(response.body.data.alunos).to.deep.include.members([
      alunoResponseSuccess,
    ]);
  });
});

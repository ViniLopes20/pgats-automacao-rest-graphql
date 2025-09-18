const request = require("supertest");
const { expect } = require("chai");

require("dotenv").config();

describe("/usuarios - POST API GraphQL External", () => {
  const testesDeErrosDeRegister = require("../fixture/requisicoes/users/registerUsersWithError.json");
  testesDeErrosDeRegister.forEach((testes) => {
    it(`Erro deve ocorrer ${testes.nomeTeste}`, async () => {
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/graphql")
        .send(testes.mutationUser);

      expect(response.body.errors[0].message).to.equal(testes.mensagem);
    });
  });

  it("Sucesso deve acontecer ao cadastrar um novo usuário que não existe", async () => {
    const mutationUser = require("../fixture/requisicoes/users/registerUser.json");
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/graphql")
      .send(mutationUser);

    const usersResponseSuccess = require("../fixture/response/users/responseWithSuccessToRegister.json");
    expect(response.body.data).to.deep.equal(usersResponseSuccess);
  });
});

describe("/usuarios - GET API GraphQL External", () => {
  let responseLogin;

  before(async () => {
    const loginMutation = require("../fixture/requisicoes/login/loginUser.json");
    responseLogin = await request(process.env.BASE_URL_GRAPHQL)
      .post("/graphql")
      .send(loginMutation);
  });

  it("Sucesso deve acontecer ao exibir a listagem de usuários", async () => {
    const userQuery = require("../fixture/requisicoes/users/listUser.json");
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/graphql")
      .set("Authorization", `Bearer ${responseLogin.body.data.login.token}`)
      .send(userQuery);

    const usuarioResponseSuccess = require("../fixture/response/users/responseWithSuccessToList.json");
    expect(response.body.data.usuarios).to.deep.include.members([
      usuarioResponseSuccess,
    ]);
  });
});

describe("/login - POST API GraphQL External", () => {
  const testesDeErrosDeLogin = require("../fixture/requisicoes/login/loginUserWithError.json");
  testesDeErrosDeLogin.forEach((testes) => {
    it(`Erro deve ocorrer ${testes.nomeTeste}`, async () => {
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/graphql")
        .send(testes.mutationLogin);

      expect(response.body.errors[0].message).to.equal("Credenciais inválidas");
    });
  });

  it("Sucesso deve acontecer ao fazer login com credenciais válidas", async () => {
    const mutationLogin = require("../fixture/requisicoes/login/loginUser.json");
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/graphql")
      .send(mutationLogin);

    expect(response.body.data.login).to.have.property("token");
  });
});

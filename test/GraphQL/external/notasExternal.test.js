const request = require("supertest");
const { expect } = require("chai");

require("dotenv").config();

let responseLogin;
before(async () => {
  const loginMutation = require("../fixture/requisicoes/login/loginUser.json");
  responseLogin = await request(process.env.BASE_URL_GRAPHQL)
    .post("/graphql")
    .send(loginMutation);
});

describe("/notas - POST API GraphQL External", () => {
  const testesDeErrosDeNotas = require("../fixture/requisicoes/notas/notasWithError.json");
  testesDeErrosDeNotas.forEach((testes) => {
    it(testes.nomeTeste, async () => {
      const response = await request(process.env.BASE_URL_GRAPHQL)
        .post("/graphql")
        .set("Authorization", `Bearer ${responseLogin.body.data.login.token}`)
        .send(testes.mutationNotas);

      expect(response.body.errors[0].message).to.equal(testes.mensagem);
    });
  });

  it("Sucesso deve acontecer ao cadastrar nota válida para aluno existente", async () => {
    const mutationNotas = require("../fixture/requisicoes/notas/registerNotas.json");
    const response = await request(process.env.BASE_URL_GRAPHQL)
      .post("/graphql")
      .set("Authorization", `Bearer ${responseLogin.body.data.login.token}`)
      .send(mutationNotas);

    const usersResponseSuccess = require("../fixture/response/notas/responseWithSuccessToRegister.json");
    expect(response.body.data.addNota).to.equal(usersResponseSuccess.message);
  });
});

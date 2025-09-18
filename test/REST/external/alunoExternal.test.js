const request = require('supertest');
const { expect } = require('chai');

require('dotenv').config();

let responseLogin;
const loginUserBody = require('../fixture/requisicoes/login/loginUser.json');

before(async () => {
    responseLogin = await request(process.env.BASE_URL_REST)
        .post('/login')
        .send(loginUserBody);
});

describe('/alunos - POST API REST External', () => {
    const alunoRegisterBody = require('../fixture/requisicoes/aluno/registerAluno.json');

    it('Erro deve ocorrer ao tentar cadastrar um aluno sem nome', async () => {
        const responseRegister = await request(process.env.BASE_URL_REST)
            .post('/alunos')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            })
            .send({nome: ''});
        
        const alunoResponseError = require('../fixture/response/aluno/responseWithErrorToRegister.json');
        expect(responseRegister.status).to.equal(alunoResponseError.status);
        expect(responseRegister.body).to.have.property('message', alunoResponseError.message);
    });

    const testesDeErrosDeToken = require('../fixture/response/token/responseWithError.json');
    testesDeErrosDeToken.forEach(testes => {
        it(`Erro deve ocorrer ao tentar acessar a listagem ${testes.nomeTeste}`, async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/alunos')
                .set({
                    Authorization: `Bearer ${testes.token}`
                })
                .send(alunoRegisterBody);

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message', testes.message);
        });
    });

    it('Sucesso deve acontecer ao cadastrar um novo aluno que não existe', async () => {
        const response = await request(process.env.BASE_URL_REST)
            .post('/alunos')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            })
            .send(alunoRegisterBody);
        
        const alunoResponseSuccess = require('../fixture/response/aluno/responseWithSuccessToRegister.json');
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message', alunoResponseSuccess.message);
    });
});

describe('/alunos - GET API REST External', () => {
    const testesDeErrosDeToken = require('../fixture/response/token/responseWithError.json');
    testesDeErrosDeToken.forEach(testes => {
        it(`Erro deve ocorrer ao tentar acessar a listagem ${testes.nomeTeste}`, async () => {
            const response = await request(process.env.BASE_URL_REST)
                .get('/alunos')
                .set({
                    Authorization: `Bearer ${testes.token}`
                })

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message', testes.message);
        });
    });

    it('Sucesso deve acontecer ao exibir a listagem de alunos', async () => {
        const alunoResponseSuccess = require('../fixture/response/aluno/responseWithSuccessToList.json');

        const response = await request(process.env.BASE_URL_REST)
            .get('/alunos')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            });

        expect(response.status).to.equal(200);
        expect(response.body).to.deep.contain(alunoResponseSuccess);
    });
});

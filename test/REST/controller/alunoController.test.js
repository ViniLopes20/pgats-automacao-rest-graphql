const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../../app');
const { describe } = require('mocha');

const alunoService = require('../../../service/alunoService');

const testesDeErrosDeToken = require('../fixture/response/token/responseWithError.json');
const loginUserBody = require('../fixture/requisicoes/login/loginUser.json');
let responseLogin;

before(async () => {
    responseLogin = await request(app)
        .post('/login')
        .send(loginUserBody);
});

describe('/alunos - POST API REST Controller', () => {
    const alunoRegisterBody = require('../fixture/requisicoes/aluno/registerAluno.json');

    testesDeErrosDeToken.forEach(testes => {
        it(`Erro deve ocorrer ao tentar acessar a listagem ${testes.nomeTeste}`, async () => {
            const responseRegister = await request(app)
                .post('/alunos')
                .set({
                    Authorization: `Bearer ${testes.token}`
                })
                .send(alunoRegisterBody);

            expect(responseRegister.status).to.equal(401);
            expect(responseRegister.body).to.have.property('message', testes.message);
        });
    });

    it('Erro deve ocorrer ao tentar cadastrar um aluno sem nome', async () => {
        const alunoResponseError = require('../fixture/response/aluno/responseWithErrorToRegister.json');
        const registerServiceMock = sinon.stub(alunoService, 'register');
        registerServiceMock.returns(alunoResponseError);

        const responseRegister = await request(app)
            .post('/alunos')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            })
            .send(alunoRegisterBody);

        expect(responseRegister.status).to.equal(alunoResponseError.status);
        expect(responseRegister.body).to.have.property('message', alunoResponseError.message);
    });

    it('Sucesso deve acontecer ao cadastrar um novo aluno que não existe', async () => {
        const alunoResponseSuccess = require('../fixture/response/aluno/responseWithSuccessToRegister.json');
        const registerServiceMock = sinon.stub(alunoService, 'register');
        registerServiceMock.returns(alunoResponseSuccess);

        const responseRegister = await request(app)
            .post('/alunos')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            })
            .send(alunoRegisterBody);

        expect(responseRegister.status).to.equal(201);
        expect(responseRegister.body).to.have.property('message', alunoResponseSuccess.message);
    });
});

describe('/alunos - GET API REST Controller', () => {
    testesDeErrosDeToken.forEach(testes => {
        it(`Erro deve ocorrer ao tentar acessar a listagem ${testes.nomeTeste}`, async () => {
            const responseRegister = await request(app)
                .get('/alunos')
                .set({
                    Authorization: `Bearer ${testes.token}`
                })

            expect(responseRegister.status).to.equal(401);
            expect(responseRegister.body).to.have.property('message', testes.message);
        });
    });

    it('Sucesso deve acontecer ao exibir a listagem de alunos', async () => {
        const alunoResponseSuccess = require('../fixture/response/aluno/responseWithSuccessToList.json');
        const listServiceMock = sinon.stub(alunoService, 'listarAlunosComNotas');
        listServiceMock.returns(alunoResponseSuccess);

        const responseRegister = await request(app)
            .get('/alunos')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            });

        expect(responseRegister.status).to.equal(200);
        expect(responseRegister.body).to.have.property('matricula', alunoResponseSuccess.matricula);
        expect(responseRegister.body).to.have.property('nome', alunoResponseSuccess.nome);
        expect(responseRegister.body).to.have.property('notas').that.is.an('array').that.includes(alunoResponseSuccess.notas[0]);
    });
});

afterEach(() => {
    sinon.restore();
});

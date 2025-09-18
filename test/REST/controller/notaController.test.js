const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../../app');
const { describe } = require('mocha');

const notaService = require('../../../service/notaService');

const loginUserBody = require('../fixture/requisicoes/login/loginUser.json');
let responseLogin;

before(async () => {
    responseLogin = await request(app)
        .post('/login')
        .send(loginUserBody);
});

describe('/notas - POST API REST Controller', () => {
    const testesDeErrosDeNotas = require('../fixture/requisicoes/notas/notasWithError.json');

    testesDeErrosDeNotas.forEach(testes => {
        it(testes.nomeTeste, async () => {
            const addNotaServiceMock = sinon.stub(notaService, 'addNota');
            addNotaServiceMock.returns(testes.mockReturn);

            const response = await request(app)
                .post('/notas')
                .set({
                    Authorization: `Bearer ${responseLogin.body.token}`
                })
                .send(testes.registerNotasBody);

            expect(response.status).to.equal(testes.status);
            expect(response.body).to.have.property('message', testes.mensagem);
        });
    });

    it('Sucesso deve acontecer ao cadastrar nota válida para aluno existente', async () => {
        const usersResponseSuccess = require('../fixture/response/notas/responseWithSuccessToRegister.json');
        const addNotaServiceMock = sinon.stub(notaService, 'addNota');
        addNotaServiceMock.returns(usersResponseSuccess);

        const notasRegisterBody = require('../fixture/requisicoes/notas/registerNotas.json');
        const response = await request(app)
            .post('/notas')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            })
            .send(notasRegisterBody);

        expect(response.status).to.equal(usersResponseSuccess.status);
        expect(response.body).to.have.property('message', usersResponseSuccess.message);
    });
});

afterEach(() => {
    sinon.restore();
});

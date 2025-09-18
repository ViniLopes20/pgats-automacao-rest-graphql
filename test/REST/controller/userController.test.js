const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../../app');
const { describe } = require('mocha');

const userService = require('../../../service/userService');

describe('/usuarios - POST API REST Controller', () => {
    const testesDeErrosDeRegister = require('../fixture/requisicoes/users/registerUsersWithError.json');
    testesDeErrosDeRegister.forEach(testes => {
        it(`Erro deve ocorrer ${testes.nomeTeste}`, async () => {
            const responseRegister = await request(app)
                .post('/usuarios')
                .send(testes.registerBody);

            expect(responseRegister.status).to.equal(testes.status);
            expect(responseRegister.body).to.have.property('message', testes.mensagem);
        });
    });

    it('Sucesso deve acontecer ao cadastrar um novo usuário que não existe', async () => {
        const usersResponseSuccess = require('../fixture/response/users/responseWithSuccessToRegister.json');
        const registerServiceMock = sinon.stub(userService, 'register');
        registerServiceMock.returns(usersResponseSuccess);

        const userRegisterBody = require('../fixture/requisicoes/users/registerUser.json');
        const responseRegister = await request(app)
            .post('/usuarios')
            .send(userRegisterBody);

        expect(responseRegister.status).to.equal(usersResponseSuccess.status);
        expect(responseRegister.body).to.have.property('message', usersResponseSuccess.message);
    });
});

describe('/usuarios - GET API REST Controller', () => {
    const loginUserBody = require('../fixture/requisicoes/login/loginUser.json');
    let responseLogin;

    before(async () => {
        responseLogin = await request(app)
            .post('/login')
            .send(loginUserBody);
    });

    it('Sucesso deve acontecer ao exibir a listagem de usuários', async () => {
        const usuarioResponseSuccess = require('../fixture/response/users/responseWithSuccessToList.json');
        const listServiceMock = sinon.stub(userService, 'listarUsuarios');
        listServiceMock.returns(usuarioResponseSuccess);

        const responseRegister = await request(app)
            .get('/usuarios')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            });

        expect(responseRegister.status).to.equal(200);
        expect(responseRegister.body).to.have.property('login', usuarioResponseSuccess.login);
    });
});

describe('/login - POST API REST Controller', () => {
    const testesDeErrosDeLogin = require('../fixture/requisicoes/login/loginUserWithError.json');
    testesDeErrosDeLogin.forEach(testes => {
        it(`Erro deve ocorrer ${testes.nomeTeste}`, async () => {
            const responseLogin = await request(app)
                .post('/login')
                .send(testes.loginBody);

            expect(responseLogin.status).to.equal(401);
            expect(responseLogin.body).to.have.property('message', 'Credenciais inválidas');
        });
    });

    it('Sucesso deve acontecer ao fazer login com credenciais válidas', async () => {
        const loginUserBody = require('../fixture/requisicoes/login/loginUser.json');
        const responseLogin = await request(app)
            .post('/login')
            .send(loginUserBody);

        expect(responseLogin.status).to.equal(200);
        expect(responseLogin.body).to.have.property('token');
    });
});

afterEach(() => {
    sinon.restore();
});

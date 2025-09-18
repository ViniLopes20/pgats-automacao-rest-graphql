const request = require('supertest');
const { expect } = require('chai');

require('dotenv').config();

describe('/usuarios - POST API REST External', () => {
    const testesDeErrosDeRegister = require('../fixture/requisicoes/users/registerUsersWithError.json');
    testesDeErrosDeRegister.forEach(testes => {
        it(`Erro deve ocorrer ${testes.nomeTeste}`, async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/usuarios')
                .send(testes.registerBody);

            expect(response.status).to.equal(testes.status);
            expect(response.body).to.have.property('message', testes.mensagem);
        });
    });

    it('Sucesso deve acontecer ao cadastrar um novo usuário que não existe', async () => {        
        const userRegisterBody = require('../fixture/requisicoes/users/registerUser.json');
        const response = await request(process.env.BASE_URL_REST)
            .post('/usuarios')
            .send(userRegisterBody);
        
        const usersResponseSuccess = require('../fixture/response/users/responseWithSuccessToRegister.json');
        expect(response.status).to.equal(usersResponseSuccess.status);
        expect(response.body).to.have.property('message', usersResponseSuccess.message);
    });
});

describe('/usuarios - GET API REST External', () => {
    const loginUserBody = require('../fixture/requisicoes/login/loginUser.json');
    let responseLogin;

    before(async () => {
        responseLogin = await request(process.env.BASE_URL_REST)
            .post('/login')
            .send(loginUserBody);
    });

    it('Sucesso deve acontecer ao exibir a listagem de usuários', async () => {        
        const response = await request(process.env.BASE_URL_REST)
            .get('/usuarios')
            .set({
                Authorization: `Bearer ${responseLogin.body.token}`
            });
        
        const usuarioResponseSuccess = require('../fixture/response/users/responseWithSuccessToList.json');
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.include(usuarioResponseSuccess);
    });
});

describe('/login - POST API REST External', () => {
    const testesDeErrosDeLogin = require('../fixture/requisicoes/login/loginUserWithError.json');
    testesDeErrosDeLogin.forEach(testes => {
        it(`Erro deve ocorrer ${testes.nomeTeste}`, async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/login')
                .send(testes.loginBody);

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message', 'Credenciais inválidas');
        });
    });

    it('Sucesso deve acontecer ao fazer login com credenciais válidas', async () => {
        const loginUserBody = require('../fixture/requisicoes/login/loginUser.json');
        const response = await request(process.env.BASE_URL_REST)
            .post('/login')
            .send(loginUserBody);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
    });
});

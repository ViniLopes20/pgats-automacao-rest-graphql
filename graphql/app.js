
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');

const app = express();

function getUserFromToken(req) {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret');
            return user;
        } catch (err) {
            return null;
        }
    }
    return null;
}

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ user: getUserFromToken(req) })
    });
    await server.start();
    server.applyMiddleware({ app });
}

startApolloServer();

module.exports = app;

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  if (
    req.method === 'POST' &&
    req.originalUrl === '/graphql' &&
    req.body && req.body.operationName &&
    ['registerAluno', 'addNota', 'alunos', 'usuarios'].includes(req.body.operationName)
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  } else {
    next();
  }
};

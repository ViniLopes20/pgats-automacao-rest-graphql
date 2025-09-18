require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT_GRAPHQL || 2001;
app.listen(PORT, () => {
  console.log(`GraphQL API rodando na porta ${PORT}`);
});

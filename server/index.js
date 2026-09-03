const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.get('/', (req, res) => {
    res.send('EdgePlay Backend GraphQL API is running!');
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 EdgePlay Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => console.error('Server startup error:', err));

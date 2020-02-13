const { ApolloServer, makeExecutableSchema } = require('apollo-server');

const post = require('./schemas/post')
const comment = require('./schemas/comment')

const typeDefs = `
  type Query
  type Mutation

  type User {
    id: Int
    name: String
    username: String
    email: String
  }
`

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, post.typeDefs, comment.typeDefs],
  resolvers: [post.resolvers, comment.resolvers]
})

const server = new ApolloServer({ schema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

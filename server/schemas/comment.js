const { gql } = require('apollo-server')

const jsonServer = require('../services/json-server')


const typeDefs = gql`
  extend type Query {
    comments: [Comment]
  }

  type Comment {
      postId: Int
      id: Int
      name: String
      email: String
      body: String
  }
`

const resolvers = {
  Query: {
    comments: async () => {
      const { data } = await jsonServer.get('/comments')
      return data
    },
  }
}

module.exports = {
  typeDefs, resolvers
}
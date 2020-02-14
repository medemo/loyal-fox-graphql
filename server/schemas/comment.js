const axios = require('axios')
const { gql } = require('apollo-server')

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
      const { data } = await axios.get('http://localhost:3000/comments')
      return data
    },
  }
}

module.exports = {
  typeDefs, resolvers
}
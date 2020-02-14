const axios = require('axios')
const { gql } = require('apollo-server')

const typeDefs = gql`
  extend type Query {
    users: [User]
    user (id: Int): User
  }

  type User {
    id: Int
    name: String
    username: String
    email: String
  }
`

const resolvers = {
  Query: {
    users: async () => {
      const { data } = await axios.get('http://localhost:3000/users')
      return data
    },
    user: async (parent, args) => {
      const { data } = await axios.get(`http://localhost:3000/users/${args.id}`)
      return data
    }
  }
}

module.exports = {
  typeDefs, resolvers
}
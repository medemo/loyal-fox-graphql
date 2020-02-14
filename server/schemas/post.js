const { ApolloError, gql } = require('apollo-server');
const axios = require('axios')

const typeDefs = gql`
  extend type Query {
    posts: [Post]
    post(id: Int): Post
  }

  extend type Mutation {
    addPost (userId: Int, title: String, body: String): Post
  }

  type Post {
    user: User
    userId: Int
    id: Int
    title: String
    body: String
  }
`

const resolvers = {
  Query: {
    posts: async () => {
      const { data } = await axios.get('http://localhost:3000/posts')
      return data
    },
    post: async (parent, args) => {
      const { data } = await axios.get(`http://localhost:3000/posts/${args.id}`)
      return data
    }
  },
  Mutation: {
    addPost: async (parent, args) => {
      const { data } = await axios.post(
        `http://localhost:3000/posts`,
        {
          userId: args.userId,
          title: args.title,
          body: args.body
        }
      )
      return data
    }
  },
  Post: {
    user: async (parent) => {
      const { data } = await axios.get(`http://localhost:3000/users/${parent.userId}`)
      return data
    }
  }
}

module.exports = {
  typeDefs, resolvers
}
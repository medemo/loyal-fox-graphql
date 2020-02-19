const { gql } = require('apollo-server')

const jsonServer = require('../services/json-server')

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
      const { data } = await jsonServer.get('/posts')
      return data
    },
    post: async (parent, args) => {
      const response = await jsonServer.get(`/posts/${args.id}`)
      return response.data
    }
  },
  Mutation: {
    addPost: async (parent, args) => {
      const { data } = await jsonServer.post(
        `/posts`,
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
      const { data } = await jsonServer.get(`/users/${parent.userId}`)
      return data
    }
  }
}

module.exports = {
  typeDefs, resolvers
}
const { ApolloError } = require('apollo-server');
const axios = require('axios')

const typeDefs = `
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
      const { data } = await axios.get('http://jsonplaceholder.typicode.com/posts')
      return data
    },
    post: async (parent, args) => {
      const { data } = await axios.get(`http://jsonplaceholder.typicode.com/posts/${args.id}`)
      return data
    }
  },
  Mutation: {
    addPost: async (parent, args) => {
      const { data } = await axios.post(
        `http://jsonplaceholder.typicode.com/posts`,
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
      const { data } = await axios.get(`http://jsonplaceholder.typicode.com/users/${parent.userId}`)
      return data
    }
  }
}

module.exports = {
  typeDefs, resolvers
}
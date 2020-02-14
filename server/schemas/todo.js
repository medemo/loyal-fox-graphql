const { ApolloError } = require('apollo-server');
const axios = require('axios')


const typeDefs = `
  extend type Query {
    todos: [Todo]
  }

  extend type Mutation {
    addTodo (title: String): Todo
  }

  type Todo {
    user: User
    userId: Int
    id: Int
    title: String
    completed: Boolean
  }
`

const resolvers = {
  Query: {
    todos: async () => {
      const { data } = await axios.get('http://localhost:3000/todos/?userId=1')
      return data
    },
  },
  Mutation: {
    addTodo: async (parent, args) => {
      const { data } = await axios.post(
        `http://localhost:3000/todos`,
        {
          userId: 1,
          title: args.title,
          completed: false
        }
      )
      return data
    }
  },
  Todo: {
    user: async (parent) => {
      const { data } = await axios.get(`http://jsonplaceholder.typicode.com/users/${parent.userId}`)
      return data
    }
  }
}

module.exports = {
  typeDefs, resolvers
}
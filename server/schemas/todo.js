const { ApolloError } = require('apollo-server');
const axios = require('axios')

const redis = require('../redis')


const typeDefs = `
  extend type Query {
    todos: [Todo]
    todo (id: Int): Todo
  }

  extend type Mutation {
    addTodo (title: String): Todo
    deleteTodo (id: Int): Info
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
      let todos = await redis.hgetall('todos')
      if (todos) {
        return Object.values(todos).map(JSON.parse)
      }
      const { data } = await axios.get('http://localhost:3000/todos/?userId=1')
      todos = data.reduce((acc, todo) => {
        acc.push(todo.id, JSON.stringify(todo))
        return acc
      }, [])
      await redis.hset('todos', ...todos)
      return data
    },
    todo: async (parent, args) => {
      let todo = await redis.hget('todos', args.id)
      if (todo) {
        return JSON.parse(todo)
      }
      const { data } = await axios.get(`http://localhost:3000/todos/${args.id}`)
      await redis.hset('todos', JSON.stringify(data))
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
      await redis.hset('todos', JSON.stringify(data))
      return data
    },
    deleteTodo: async (parent, args) => {
      await axios.delete(`http://localhost:3000/todos/${args.id}`)
      await redis.hdel('todos', args.id)
      return {
        success: true,
        message: `todo #${args.id} deleted`
      }
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
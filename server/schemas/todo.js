const { gql } = require('apollo-server');

const redis = require('../redis')
const jsonServer = require('../services/json-server')


const typeDefs = gql`
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
      let allIdsCount = await redis.scard('todosAllIds')
      if (allIdsCount > 0) {
        const todos = await redis.hvals('todos')
        return todos.map(JSON.parse)
      }

      const { data } = await jsonServer.get('/todos/?userId=1')

      todos = data.reduce((acc, todo) => {
        acc.push(todo.id, JSON.stringify(todo))
        return acc
      }, [])

      redis.hset('todos', ...todos)
      redis.expire('todos', 60)

      redis.sadd('todosAllIds', ...data.map(t => t.id))
      redis.expire('todosAllIds', 60)

      return data
    },

    todo: async (parent, args) => {
      let todo = await redis.hget('todos', args.id)
      if (todo) {
        return JSON.parse(todo)
      }

      const { data } = await jsonServer.get(`/todos/${args.id}`)

      redis.hset('todos', args.id, JSON.stringify(data))
      redis.expire('todos', 60)

      const allIdsCount = await redis.scard('todosAllIds')
      if (allIdsCount > 0) {
        redis.sadd('todosAllIds', data.id)
        redis.expire('todosAllIds', 60)
      }

      return data
    },
  },

  Mutation: {
    addTodo: async (parent, args) => {
      const { data } = await jsonServer.post(
        `/todos`,
        {
          userId: 1,
          title: args.title,
          completed: false
        }
      )

      redis.hset('todos', data.id, JSON.stringify(data))
      redis.expire('todos', 60)

      const allIdsCount = await scard('todosAllIds')
      if (allIdsCount > 0) {
        redis.sadd('todosAllIds', data.id)
        redis.expire('todosAllIds', 60)
      }

      return data
    },

    deleteTodo: async (parent, args) => {
      await jsonServer.delete(`/todos/${args.id}`)

      redis.hdel('todos', args.id)
      redis.spop('todosAllIds', args.id)

      return {
        success: true,
        message: `todo #${args.id} deleted`
      }
    }
  },

  Todo: {
    user: async (parent) => {
      const { data } = await jsonServer.get(`/users/${parent.userId}`)
      return data
    }
  }
}

module.exports = {
  typeDefs, resolvers
}
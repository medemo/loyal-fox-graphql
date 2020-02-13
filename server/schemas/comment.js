const axios = require('axios')

const typeDefs = `
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
      const { data } = await axios.get('http://jsonplaceholder.typicode.com/comments')
      return data
    },
  }
}

module.exports = {
  typeDefs, resolvers
}
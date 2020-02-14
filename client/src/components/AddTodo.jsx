import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

const ADD_TODO = gql`
  mutation ($title: String) {
    addTodo (title: $title) {
      id
      title
      userId
    }
  }
`

const GET_TODOS = gql`
  query {
    todos {
      id
      title
    }
  }
`


export default function AddTodo(props) {
  const [newTodo, setNewTodo] = useState('')
  const [addTodo, /* { data, loading, error } */] = useMutation(ADD_TODO)


  const handleInputChange = e => {
    setNewTodo(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    addTodo({
      variables: {
        title: newTodo
      },
      // refetchQueries: [{ query: GET_TODOS }],
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({ query: GET_TODOS })
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: cacheData.todos.concat([data.addTodo]) },
        });
      }
    })
    setNewTodo('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="border px-3 py-2 w-full"
        value={newTodo}
        onChange={handleInputChange}
      />
    </form>
  )
}
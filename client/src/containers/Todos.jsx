import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import TodoList from '../components/TodoList'
import AddTodo from '../components/AddTodo'


const GET_TODOS = gql`
  query {
    todos {
      id
      title
    }
  }
`


function Todos(props) {
  const { loading, error, data } = useQuery(GET_TODOS)

  const renderTodos = () => {
    if (loading)
      return <p>Loading</p>
    else if (error)
      return <p>something wrong</p>
    else if (data.todos.length > 0)
      return <TodoList data-testid="todos-list" todos={data.todos} />
    else
      return <p>No todos</p>
  }

  return (
    <>
      <AddTodo />
      <div className="my-5">
        {renderTodos()}
      </div>
    </>
  )
}

export default Todos

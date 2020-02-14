import React, { useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'



const GET_LOGIN_STATUS = gql`
  {
    isLoggedIn @client
  }
`

const USER_LOGIN = gql`
  mutation {
    login @client
  }
`


export function Login(props) {
  const location = useLocation()
  const [selectedId, setSelectedId] = useState(0)

  const { data } = useQuery(GET_LOGIN_STATUS)
  const [login] = useMutation(USER_LOGIN)


  if (data?.isLoggedIn) {
    return <Redirect to={location.state.referrer || '/'} />
  }

  return (
    <div className="flex items-center mt-3">
      <select
        data-testid="select-user"
        className="rounded-l h-10"
        value={selectedId}
        onChange={e => setSelectedId(Number(e.target.value))}
      >
        <option value={0} disabled >Choose a user</option>
        {
          Array(10).fill().map((_, i) => (
            <option key={i} value={i + 1}>user {i + 1}</option>
          ))
        }
      </select>
      <button
        data-testid="login-button"
        className="border rounded ml-3 px-5 py-2"
        onClick={login}
      >
        LOGIN
      </button>
    </div>
  )
}


export default Login
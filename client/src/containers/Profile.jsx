import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks'

const GET_USER = gql`
  query ($id: Int) {
    user (id: $id) {
      id
      name
      username
      email
    }
  }
`

function Profile(props) {
  const [selectedId, setSelectedId] = useState(0)

  const [getUser, { data, loading, error }] = useLazyQuery(GET_USER)

  const handleGetUserProfile = () => {
    getUser({
      variables: {
        id: selectedId
      }
    })
  }

  const renderProfile = () => {
    if (loading)
      return <p>Loading</p>
    else if (error)
      return <p>something wrong</p>
    else if (data?.user)
      return (
        <p>
          {JSON.stringify(data.user)}
        </p>
      )
    else
      return <p>User not found</p>
  }

  return (
    <div>
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
        onClick={handleGetUserProfile}
      >
        GET PROFILE
      </button>
      <br />
      <br />
      {renderProfile()}
    </div>
  )
}

export default Profile

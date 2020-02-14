import React from 'react'
import { Route, useLocation, Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'


const GET_LOGIN_STATUS = gql`
  {
    loggedIn @client
  }
`

export default function PrivateRoute(props) {
  const { data, loading } = useQuery(GET_LOGIN_STATUS)
  const location = useLocation()

  if (loading) return null

  return (
    <Route {...props}>
      {
        data.loggedIn
          ? props.children
          : <Redirect to={{
            pathname: "/login",
            state: { referrer: location.pathname }
          }}
          />
      }
    </Route>
  )
}
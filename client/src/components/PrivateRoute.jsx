import React from 'react'
import { Route, useLocation, Redirect } from 'react-router-dom'


export default function PrivateRoute(props) {
  const user = null
  const location = useLocation()

  return (
    <Route {...props}>
      {
        user
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
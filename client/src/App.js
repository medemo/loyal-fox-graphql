import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider } from '@apollo/react-hooks';

import apolloClient from './graphql'

import PrivateRoute from './components/PrivateRoute'
import Todos from './containers/Todos'
import Navbar from './components/Navbar'
import Profile from './containers/Profile'
import About from './containers/About'
import Login from './containers/Login'


class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Router>
          <div className="container mx-auto">
            <Navbar />
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/contact">
                <p>Contact</p>
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/user">
                <Profile />
              </Route>
              <PrivateRoute path="/">
                <Todos />
              </PrivateRoute>
            </Switch>
          </div>
        </Router>
      </ApolloProvider>
    )
  }
}

export default App

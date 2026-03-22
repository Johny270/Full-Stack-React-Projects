import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './auth-helper.js'

// Components to be rendered in the PrivateRoute will only load when
// the user is authenticated, or else they get redirected to signin
// component
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {... rest} render={props = (
        auth.isAuthenticated() ? (
            <Component {...props} />
        ) : (
            <Redirect to = {{
                pathname: '/signin',
                state: { from: props.location }
            }} />
        )
    )}/>
)

export default PrivateRoute
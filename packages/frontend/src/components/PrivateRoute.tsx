import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from 'config/auth'
import { routes } from 'config/routes'

export const PrivateRoute = ({
  children,
  ...rest
}: React.ComponentProps<typeof Route>) => {
  const { loggedIn } = useAuth()

  if (loggedIn === null) return <div></div>

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          children
        ) : (
          <Redirect from={location.pathname} to={routes.signIn.routePath()} />
        )
      }
    />
  )
}

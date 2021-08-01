import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from 'config/auth'
import { routes } from 'config/routes'

export const PublicRoute = ({
  children,
  ...rest
}: React.ComponentProps<typeof Route>) => {
  const { loggedIn } = useAuth()

  if (loggedIn === null) return <div></div>

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !loggedIn ? (
          children
        ) : (
          <Redirect
            // exact={true}
            // from={location.pathname}
            to={routes.home.routePath()}
          />
        )
      }
    />
  )
}

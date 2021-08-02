import { Suspense } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { renderRoutes } from 'config/routes'
import { AuthProvider } from 'config/auth'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Suspense fallback={<div />}>
          {renderRoutes.map(([key, value]) => (
            <value.routeComponent
              key={key}
              path={value.path}
              exact={value?.exact}
            >
              <value.component />
            </value.routeComponent>
          ))}
        </Suspense>
      </Switch>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

export default App

import React, { Suspense } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { renderRoutes } from 'config/routes'

export const Routes: React.FC = () => {
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
  return <Routes />
}

export default App

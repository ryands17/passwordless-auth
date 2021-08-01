import { lazy } from 'react'
import { Route } from 'react-router-dom'

export type RouteItem = {
  path: string
  routePath: (args?: any) => string
  routeComponent: typeof Route
  component: any
  exact?: boolean
}

export const routes: Record<string, RouteItem> = {
  signIn: {
    path: '/signIn',
    routePath: () => '/signIn',
    routeComponent: Route,
    component: lazy(() => import('pages/SignIn/SignIn')),
  },
} as const

export const renderRoutes = Object.entries(routes)

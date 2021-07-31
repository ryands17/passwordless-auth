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
  login: {
    path: '/login',
    routePath: () => '/login',
    routeComponent: Route,
    component: lazy(() => import('pages/Login/Login')),
  },
} as const

export const renderRoutes = Object.entries(routes)

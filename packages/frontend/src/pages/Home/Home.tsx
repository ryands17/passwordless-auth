import * as React from 'react'
import { useAuth } from 'config/auth'
import { useHistory } from 'react-router-dom'
import { Button, message } from 'antd'
import { routes } from 'config/routes'

const Home = () => {
  const [loading, setLoading] = React.useState(false)
  const { signOut } = useAuth()
  const history = useHistory()

  const userSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      history.replace(routes.signIn.routePath())
    } catch (e) {
      message.error(e.message)
    }
  }

  return (
    <div>
      <h1>Welcome!</h1>
      <Button type="primary" onClick={userSignOut} loading={loading}>
        Sign Out
      </Button>
    </div>
  )
}

export default Home

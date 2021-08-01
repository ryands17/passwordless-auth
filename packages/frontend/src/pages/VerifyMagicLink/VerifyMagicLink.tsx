import * as React from 'react'
import { useAuth } from 'config/auth'
import { useHistory, useLocation } from 'react-router-dom'
import { message } from 'antd'
import { routes } from 'config/routes'

const VerifyMagicLink = () => {
  const { answerCustomChallenge } = useAuth()
  const location = useLocation()
  const history = useHistory()

  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    const [email, answer] = [
      params.get('email') || '',
      params.get('code') || '',
    ]

    answerCustomChallenge(email, answer)
      .then(() => {
        history.replace(routes.home.routePath())
      })
      .catch((e) => {
        console.log(e)
        message.error('Invalid login link!')
      })
  }, [])

  return <div></div>
}

export default VerifyMagicLink

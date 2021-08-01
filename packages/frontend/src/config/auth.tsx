import * as React from 'react'
import { Auth } from 'aws-amplify'
import { CognitoUser } from 'amazon-cognito-identity-js'

type ChallengeParameters = {
  USERNAME: string
  email: string
}

type SignupResponse = {
  challengeName: string
  challengeParam: ChallengeParameters
  Session: string
}

type CUser = CognitoUser & SignupResponse

type AC = {
  loggedIn: boolean | null
  isAuthenticated: () => Promise<boolean>
  signIn: (args: { email: string }) => Promise<CUser | null>
  answerCustomChallenge: (answer: string) => Promise<boolean>
  signOut: typeof Auth.signOut
}

const AuthContext = React.createContext<AC>({
  loggedIn: null,
  isAuthenticated: () => Promise.resolve(false),
  signIn: () => Promise.resolve(null),
  answerCustomChallenge: () => Promise.resolve(true),
  signOut: () => Promise.resolve(),
})

type AuthProviderProps = {
  children: React.ReactNode
}

const AuthProvider = (props: AuthProviderProps) => {
  const [loggedIn, setLoggedIn] = React.useState<AC['loggedIn']>(null)
  const [cognitoUser, setCognitoUser] = React.useState<CUser | null>(null)

  const isAuthenticated = React.useCallback(async () => {
    try {
      await Auth.currentSession()
      return true
    } catch (error) {
      return false
    }
  }, [])

  React.useEffect(() => {
    isAuthenticated().then((res) => setLoggedIn(res))
  }, [isAuthenticated])

  const signIn = React.useCallback(async ({ email }: { email: string }) => {
    try {
      await Auth.signUp({
        username: email,
        password: `password${Math.random().toString().slice(0, 8)}`,
        attributes: { email },
      })
    } catch (e) {
      // skip if user already exists
    }

    let cognitoUser = await Auth.signIn(email)
    setCognitoUser(cognitoUser)
    return cognitoUser
  }, [])

  const answerCustomChallenge = async (answer: string) => {
    let updatedCognitoUser = await Auth.sendCustomChallengeAnswer(
      cognitoUser,
      answer
    )
    setCognitoUser(updatedCognitoUser)
    setLoggedIn(true)
    return isAuthenticated()
  }

  const signOut = React.useCallback(async () => {
    await Auth.signOut()
    setLoggedIn(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        isAuthenticated,
        signIn,
        answerCustomChallenge,
        signOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }

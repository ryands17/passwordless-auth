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
  signOut: typeof Auth.signOut
  isAuthenticated: () => Promise<boolean>
  signIn: (args: { email: string }) => Promise<CUser | null>
  answerCustomChallenge: (answer: string) => Promise<boolean>
}

const AuthContext = React.createContext<AC>({
  isAuthenticated: () => Promise.resolve(false),
  signIn: () => Promise.resolve(null),
  answerCustomChallenge: () => Promise.resolve(true),
  signOut: () => Promise.resolve(),
})

type AuthProviderProps = {
  children: React.ReactNode
}

const AuthProvider = (props: AuthProviderProps) => {
  const [cognitoUser, setCognitoUser] = React.useState<CUser | null>(null)

  const isAuthenticated = async () => {
    try {
      await Auth.currentSession()
      return true
    } catch (error) {
      return false
    }
  }

  const signIn = async ({ email }: { email: string }) => {
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
  }

  const answerCustomChallenge = async (answer: string) => {
    let updatedCognitoUser = await Auth.sendCustomChallengeAnswer(
      cognitoUser,
      answer
    )
    setCognitoUser(updatedCognitoUser)
    return isAuthenticated()
  }

  // const getPublicChallengeParameters = () => {
  //   return cognitoUser?.ChallengeParameters
  // }

  const signOut = () => Auth.signOut()

  return (
    <AuthContext.Provider
      value={{
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

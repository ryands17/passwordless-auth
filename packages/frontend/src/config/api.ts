import config from '../cdk-exports.json'

export const requestMagicLink = async (email: string) => {
  const res = await fetch(
    `${config.PasswordlessLoginStack.authApiEndpointF052B0B5}`,
    {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return res.json()
}

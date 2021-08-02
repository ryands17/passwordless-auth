import axios from 'axios'
import config from '../cdk-exports.json'

export const requestMagicLink = async (email: string) => {
  const res = await axios.post(
    config.PasswordlessLoginStack.authApiEndpointF052B0B5,
    { email }
  )
  return res.data
}

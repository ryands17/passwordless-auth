import { APIGatewayProxyHandler } from 'aws-lambda'
import { randomDigits } from 'crypto-secure-random-digit'
import { CognitoIdentityServiceProvider, SES } from 'aws-sdk'

const cisp = new CognitoIdentityServiceProvider()
const ses = new SES({ region: process.env.AWS_REGION })

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { email } = JSON.parse(event.body || '{}')
    if (!email) throw Error()

    // set the code in custom attributes
    const authChallenge = randomDigits(6).join('')
    await cisp
      .adminUpdateUserAttributes({
        UserAttributes: [
          {
            Name: 'custom:authChallenge',
            Value: `${authChallenge},${Date.now()}`,
          },
        ],
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      })
      .promise()

    await sendEmail(email, authChallenge)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: `A login link has been sent to ${email}`,
      }),
    }
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: `Couldn't process the request. Please try after some time.`,
      }),
    }
  }
}

const BASE_URL = `http://localhost:3000/verify`

async function sendEmail(emailAddress: string, authChallenge: string) {
  const MAGIC_LINK = `${BASE_URL}?email=${emailAddress}&code=${authChallenge}`

  const html = `
    <html><body>
    <p>This is your login link:</p>
    <h3>
      <a target="_blank" rel="noopener noreferrer" href="${MAGIC_LINK}">Login Link</a>
    </h3>
    </body></html>
  `.trim()

  const params: SES.SendEmailRequest = {
    Destination: { ToAddresses: [emailAddress] },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: html,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Your login link (copy and paste in the browser): ${MAGIC_LINK}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Login link',
      },
    },
    Source: process.env.SES_FROM_ADDRESS,
  }
  await ses.sendEmail(params).promise()
}

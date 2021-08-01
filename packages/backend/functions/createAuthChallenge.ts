import { CreateAuthChallengeTriggerHandler } from 'aws-lambda'

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  // This is sent back to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
  }

  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = {
    challenge: event.request.userAttributes['custom:authChallenge'],
  }

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${event.request.userAttributes['custom:authChallenge']}`
  return event
}

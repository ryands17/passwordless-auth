import { VerifyAuthChallengeResponseTriggerHandler } from 'aws-lambda'

const MAGIC_LINK_TIMEOUT = 3 * 60 * 1000

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event
) => {
  const [authChallenge, timestamp] = (
    event.request.privateChallengeParameters.challenge || ''
  ).split(',')

  // fail if any one of the parameters is missing
  if (!authChallenge || !timestamp) {
    event.response.answerCorrect = false
    return event
  }

  // is the correct challenge and is not expired
  if (
    event.request.challengeAnswer === authChallenge &&
    Date.now() <= Number(timestamp) + MAGIC_LINK_TIMEOUT
  ) {
    event.response.answerCorrect = true
    return event
  }

  event.response.answerCorrect = false
  return event
}

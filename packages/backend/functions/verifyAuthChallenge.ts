import { VerifyAuthChallengeResponseTriggerHandler } from 'aws-lambda'

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event
) => {
  const expectedAnswer =
    event.request.privateChallengeParameters?.secretLoginCode

  event.response.answerCorrect =
    event.request.challengeAnswer === expectedAnswer

  return event
}

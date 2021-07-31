import {
  DefineAuthChallengeTriggerEvent,
  DefineAuthChallengeTriggerHandler,
} from 'aws-lambda'

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  if (notCustomChallenge(event)) {
    // We only accept custom challenges; fail auth
    event.response.issueTokens = false
    event.response.failAuthentication = true
  } else if (tooManyFailedAttempts(event)) {
    // The user provided a wrong answer 3 times; fail auth
    event.response.issueTokens = false
    event.response.failAuthentication = true
  } else if (successfulAnswer(event)) {
    // The user provided the right answer; succeed auth
    event.response.issueTokens = true
    event.response.failAuthentication = false
  } else {
    // The user did not provide a correct answer yet; present challenge
    event.response.issueTokens = false
    event.response.failAuthentication = false
    event.response.challengeName = 'CUSTOM_CHALLENGE'
  }

  return event
}

export const notCustomChallenge = (event: DefineAuthChallengeTriggerEvent) =>
  event.request.session &&
  !!event.request.session.find(
    (attempt) => attempt.challengeName !== 'CUSTOM_CHALLENGE'
  )

export const tooManyFailedAttempts = (event: DefineAuthChallengeTriggerEvent) =>
  event.request.session &&
  event.request.session.length >= 3 &&
  event.request.session.slice(-1)[0].challengeResult === false

export const successfulAnswer = (event: DefineAuthChallengeTriggerEvent) =>
  event.request.session &&
  !!event.request.session.length &&
  event.request.session.slice(-1)[0].challengeName === 'CUSTOM_CHALLENGE' && // Doubly stitched, holds better
  event.request.session.slice(-1)[0].challengeResult === true

import * as cdk from '@aws-cdk/core'
import * as cg from '@aws-cdk/aws-cognito'
import { lambda } from './helpers'

export class PasswordlessLoginStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // User Pool and client
    const userPool = new cg.UserPool(this, 'users', {
      standardAttributes: { email: { required: true, mutable: true } },
      passwordPolicy: {
        requireDigits: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: cg.AccountRecovery.NONE,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      lambdaTriggers: {
        preSignUp: lambda(this, 'preSignup'),
        createAuthChallenge: lambda(this, 'createAuthChallenge').addEnvironment(
          'SES_FROM_ADDRESS',
          process.env.SES_FROM_ADDRESS
        ),
        defineAuthChallenge: lambda(this, 'defineAuthChallenge'),
        verifyAuthChallengeResponse: lambda(this, 'verifyAuthChallenge'),
        postAuthentication: lambda(this, 'postAuthentication'),
      },
    })

    const webClient = userPool.addClient('webAppClient', {
      authFlows: { custom: true },
    })

    new cdk.CfnOutput(this, 'userPoolId', {
      value: userPool.userPoolId,
    })

    new cdk.CfnOutput(this, 'clientId', {
      value: webClient.userPoolClientId,
    })
  }
}

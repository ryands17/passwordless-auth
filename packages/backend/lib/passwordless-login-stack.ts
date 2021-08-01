import * as cdk from '@aws-cdk/core'
import * as cg from '@aws-cdk/aws-cognito'
import * as iam from '@aws-cdk/aws-iam'
import { lambda } from './helpers'

export class PasswordlessLoginStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const createAuthChallenge = lambda(
      this,
      'createAuthChallenge'
    ).addEnvironment('SES_FROM_ADDRESS', process.env.SES_FROM_ADDRESS)
    createAuthChallenge.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail'],
        resources: ['*'],
      })
    )

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
        createAuthChallenge,
        defineAuthChallenge: lambda(this, 'defineAuthChallenge'),
        verifyAuthChallengeResponse: lambda(this, 'verifyAuthChallenge'),
      },
    })

    const postAuthentication = lambda(this, 'postAuthentication')
    postAuthentication.role?.attachInlinePolicy(
      new iam.Policy(this, 'postAuthPolicy', {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['cognito-idp:AdminUpdateUserAttributes'],
            resources: [userPool.userPoolArn],
          }),
        ],
      })
    )

    userPool.addTrigger(
      cg.UserPoolOperation.POST_AUTHENTICATION,
      postAuthentication
    )

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

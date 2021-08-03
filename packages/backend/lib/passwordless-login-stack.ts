import * as cdk from '@aws-cdk/core'
import * as cg from '@aws-cdk/aws-cognito'
import * as iam from '@aws-cdk/aws-iam'
import * as apiGw from '@aws-cdk/aws-apigateway'
import { lambda } from './helpers'

export class PasswordlessLoginStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const postAuthentication = lambda(this, 'postAuthentication')

    // User Pool and client
    const userPool = new cg.UserPool(this, 'users', {
      standardAttributes: { email: { required: true, mutable: true } },
      customAttributes: {
        authChallenge: new cg.StringAttribute({ mutable: true }),
      },
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
        createAuthChallenge: lambda(this, 'createAuthChallenge'),
        defineAuthChallenge: lambda(this, 'defineAuthChallenge'),
        verifyAuthChallengeResponse: lambda(this, 'verifyAuthChallenge'),
        postAuthentication,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    postAuthentication.role?.attachInlinePolicy(
      new iam.Policy(this, 'allowConfirmingUser', {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['cognito-idp:AdminUpdateUserAttributes'],
            resources: [userPool.userPoolArn],
          }),
        ],
      })
    )

    const webClient = userPool.addClient('webAppClient', {
      authFlows: { custom: true },
    })

    const api = new apiGw.RestApi(this, 'authApi', {
      endpointConfiguration: { types: [apiGw.EndpointType.REGIONAL] },
      defaultCorsPreflightOptions: { allowOrigins: ['*'] },
      deployOptions: { stageName: 'dev' },
    })

    const signIn = lambda(this, 'signIn')
      .addEnvironment('SES_FROM_ADDRESS', process.env.SES_FROM_ADDRESS)
      .addEnvironment('USER_POOL_ID', userPool.userPoolId)

    signIn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail'],
        resources: ['*'],
      })
    )
    signIn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-idp:AdminUpdateUserAttributes'],
        resources: [userPool.userPoolArn],
      })
    )

    const signInMethod = new apiGw.LambdaIntegration(signIn)
    api.root.addMethod('POST', signInMethod)

    new cdk.CfnOutput(this, 'userPoolId', {
      value: userPool.userPoolId,
    })

    new cdk.CfnOutput(this, 'clientId', {
      value: webClient.userPoolClientId,
    })
  }
}

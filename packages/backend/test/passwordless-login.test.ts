import './helpers'
import { expect as expectCDK, haveOutput } from '@aws-cdk/assert'
import { TemplateAssertions } from '@aws-cdk/assertions'
import * as cdk from '@aws-cdk/core'
import { PasswordlessLoginStack } from '../lib/passwordless-login-stack'

const synthStack = () => {
  const app = new cdk.App()
  return new PasswordlessLoginStack(app, 'PasswordlessLogin')
}

const OPTION_ENDPOINT = 1
const ADDITIONAL_LAMBDAS = 2

test('Cognito User pool and Lambda functions are created', () => {
  const assert = TemplateAssertions.fromStack(synthStack())

  assert.resourceCountIs('AWS::Lambda::Function', 5 + ADDITIONAL_LAMBDAS)

  assert.hasResourceProperties('AWS::Cognito::UserPool', {
    AccountRecoverySetting: {
      RecoveryMechanisms: [
        {
          Name: 'admin_only',
          Priority: 1,
        },
      ],
    },
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: false,
    },
    AutoVerifiedAttributes: ['email'],
    EmailVerificationMessage:
      'The verification code to your new account is {####}',
    EmailVerificationSubject: 'Verify your new account',
    Policies: {
      PasswordPolicy: {
        MinimumLength: 8,
        RequireNumbers: false,
        RequireSymbols: false,
        RequireUppercase: false,
      },
    },
    Schema: [
      {
        Mutable: true,
        Name: 'email',
        Required: true,
      },
      {
        AttributeDataType: 'String',
        Mutable: true,
        Name: 'authChallenge',
      },
    ],
    SmsVerificationMessage:
      'The verification code to your new account is {####}',
    UsernameAttributes: ['email'],
    VerificationMessageTemplate: {
      DefaultEmailOption: 'CONFIRM_WITH_CODE',
      EmailMessage: 'The verification code to your new account is {####}',
      EmailSubject: 'Verify your new account',
      SmsMessage: 'The verification code to your new account is {####}',
    },
  })

  assert.hasResourceProperties('AWS::Cognito::UserPoolClient', {
    AllowedOAuthFlows: ['implicit', 'code'],
    AllowedOAuthFlowsUserPoolClient: true,
    AllowedOAuthScopes: [
      'profile',
      'phone',
      'email',
      'openid',
      'aws.cognito.signin.user.admin',
    ],
    ExplicitAuthFlows: ['ALLOW_CUSTOM_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'],
    SupportedIdentityProviders: ['COGNITO'],
  })
})

test('API Gateway endpoint along with Lambda proxy integration is created', () => {
  const assert = TemplateAssertions.fromStack(synthStack())

  assert.hasResourceProperties('AWS::ApiGateway::RestApi', {
    EndpointConfiguration: {
      Types: ['REGIONAL'],
    },
    Name: 'authApi',
  })

  assert.resourceCountIs('AWS::ApiGateway::Method', 1 + OPTION_ENDPOINT)

  assert.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST',
    AuthorizationType: 'NONE',
    Integration: {
      IntegrationHttpMethod: 'POST',
      Type: 'AWS_PROXY',
    },
  })
})

test('Outputs are generated correctly', () => {
  const stack = synthStack()
  expectCDK(stack).to(haveOutput({ outputName: 'userPoolId' }))
  expectCDK(stack).to(haveOutput({ outputName: 'clientId' }))
})

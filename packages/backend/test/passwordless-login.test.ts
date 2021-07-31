import './helpers'
import { expect as expectCDK, haveOutput } from '@aws-cdk/assert'
import { TemplateAssertions } from '@aws-cdk/assertions'
import * as cdk from '@aws-cdk/core'
import { PasswordlessLoginStack } from '../lib/passwordless-login-stack'

const synthStack = () => {
  const app = new cdk.App()
  return new PasswordlessLoginStack(app, 'PasswordlessLogin')
}

test('Cognito User pool and Lambda functions are created', () => {
  const assert = TemplateAssertions.fromStack(synthStack())

  assert.resourceCountIs('AWS::Lambda::Function', 6)

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

test('Outputs are generated correctly', () => {
  const stack = synthStack()
  expectCDK(stack).to(haveOutput({ outputName: 'userPoolId' }))
  expectCDK(stack).to(haveOutput({ outputName: 'clientId' }))
})

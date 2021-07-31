#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { PasswordlessLoginStack } from '../lib/passwordless-login-stack'

const app = new cdk.App()
new PasswordlessLoginStack(app, 'PasswordlessLoginStack', {
  env: { region: process.env.REGION || 'us-east-2' },
})

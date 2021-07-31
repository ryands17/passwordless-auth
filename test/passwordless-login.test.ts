import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as PasswordlessLogin from '../lib/passwordless-login-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PasswordlessLogin.PasswordlessLoginStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

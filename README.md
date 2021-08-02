# Passwordless Auth

This stack allows a user to login directly via email without any need for a pasword. This uses Cognito for authentication along with Lambda triggers.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Prerequisites

- Install dependencies using `yarn`
- Rename `.example.env` to `.env` in `packages/backend` and replace the value in `SES_FROM_ADDRESS` to your verified email address in SES
- Rename `.example.env` to `.env` in `packages/frontend` and replace the value in `AWS_REGION` to the region your stack is deployed to. Default is `us-east-2`

## Useful commands

### CDK

- `yarn workspace backend build` compile typescript to js
- `yarn workspace backend watch` watch for changes and compile
- `yarn workspace backend test` perform the jest unit tests
- `yarn workspace backend cdk deploy` deploy this stack to your default AWS account/region
- `yarn workspace backend cdk diff` compare deployed stack with current state
- `yarn workspace backend cdk synth` emits the synthesized CloudFormation template

### Webapp

- `yarn workspace frontend dev` starts the dev server on [http://localhost:3000](http://localhost:3000)
- `yarn workspace frontend build` builds the app for production to the `build` folder
- `yarn workspace frontend test` launches the test runner in the interactive watch mode

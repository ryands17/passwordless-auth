import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from 'aws-amplify'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import authConfig from './cdk-exports.json'

Amplify.configure({
  Auth: {
    region: process.env.AWS_REGION || 'us-east-2',
    userPoolId: authConfig.PasswordlessLoginStack.userPoolId,
    userPoolWebClientId: authConfig.PasswordlessLoginStack.clientId,
  },
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.info)

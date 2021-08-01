import * as React from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import styles from './SignIn.module.css'
import { useAuth } from 'config/auth'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
}

const SignIn = () => {
  const [loading, setLoading] = React.useState(false)
  const [verificationCode, showVerificationCode] = React.useState(false)
  const { signIn, answerCustomChallenge } = useAuth()

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      if (!verificationCode) {
        let cuser = await signIn(values)
        message.success(
          `A code has been sent to the email: ${cuser?.challengeParam.email}`,
          5
        )
        showVerificationCode(true)
      } else {
        let res = await answerCustomChallenge(values.code)
        console.log('res', res)
      }
    } catch (e) {
      message.error(e.message, 4)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <h2>Sign In</h2>
        <Form
          name="SignIn"
          {...formItemLayout}
          onFinish={onSubmit}
          onFinishFailed={(e) => {
            message.error('Please check your email', 4)
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            required
            rules={[{ type: 'email', required: true }]}
          >
            <Input />
          </Form.Item>

          {verificationCode && (
            <Form.Item
              label="code"
              name="code"
              required
              rules={[{ required: true }]}
            >
              <Input.Password placeholder="******" />
            </Form.Item>
          )}

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SignIn

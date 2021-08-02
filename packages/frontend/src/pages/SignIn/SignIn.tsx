import * as React from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import { useAuth } from 'config/auth'
import styles from './SignIn.module.css'

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
  const { signIn } = useAuth()

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      let response = await signIn(values)
      message.success(response.message, 5)
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message, 4)
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
          onFinishFailed={() => {
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

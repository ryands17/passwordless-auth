import * as React from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import styles from './Login.module.css'

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

const Login = () => {
  const [loading, setLoading] = React.useState(false)

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <h2>Login</h2>
        <Form
          name="Login"
          {...formItemLayout}
          onFinish={() => {}}
          onFinishFailed={() => {}}
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

export default Login

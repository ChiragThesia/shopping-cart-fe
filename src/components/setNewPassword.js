import React, { useState } from 'react'
import axios from 'axios'
import {
  Form,
  Input,
  Icon,
  Button,
  message
} from 'antd'

import '../less/index.less'
import logo from '../images/PureRetail_Logo.png'
import history from '../history'

const URL = ''
const SetNewPassword = (props) => {
  const [confirmDirty, setConfirmDirty] = useState(false)
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err, values) => {
      const payload = {
        password: values.password
      }
      if (!err) {
        console.log(payload)
        axios.post(URL, payload)
          .then(res => {
            message.success('Password reset successfully!')
            history.push('/login')
          })
          .catch(error => {
            message.error(error.message)
          })
      } else {
        message.error('Password validation failed.')
      }
    })
  }
  const handleConfirmBlur = e => {
    const { value } = e.target
    setConfirmDirty(!!value)
  }
  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props
    if (value && value !== form.getFieldValue('password')) {
      callback('The two passwords that you entered do not match!')
    } else {
      callback()
    }
  }
  const validateToNextPassword = (rule, value, callback) => {
    const { form } = props
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  const { getFieldDecorator } = props.form

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  }

  return (
    <div className='cover'>
      <div id='logo'>
        <img src={logo} alt='PureRetail Logo' />
      </div>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <div id='header'>
          <h2>Reset password</h2>
        </div>
        <Form.Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your new password!'
              },
              {
                validator: validateToNextPassword
              }
            ]
          })(
            <Input.Password
              placeholder='New Password'
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
            />)}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your new password!'
              },
              {
                validator: compareToFirstPassword
              }
            ]
          })(
            <Input.Password
              onBlur={handleConfirmBlur}
              placeholder='Confirm New Password'
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
            />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>
              Reset
          </Button>
        </Form.Item>
      </Form>
      <div id='or_login'>
        <p>or <a>login</a> instead</p>
      </div>
    </div>
  )
}

const SetNewPasswordForm = Form.create({ name: 'setNewPassword' })(SetNewPassword)

export default SetNewPasswordForm
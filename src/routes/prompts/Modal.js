import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  primaryKeyEditable,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="编号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('messageId', {
            initialValue: item.messageId,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input readOnly={!primaryKeyEditable} />)}
        </FormItem>
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('messageName', {
            initialValue: item.messageName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="内容" hasFeedback {...formItemLayout}>
          {getFieldDecorator('message', {
            initialValue: item.message,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  primaryKeyEditable: PropTypes.object,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)

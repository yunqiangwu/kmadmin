import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Checkbox, Modal, Cascader } from 'antd'

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
        ...item,
        ...getFieldsValue(),
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
        <FormItem label="值" hasFeedback {...formItemLayout}>
          {getFieldDecorator('lookupCode', {
            initialValue: item.lookupCode,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input readOnly={!primaryKeyEditable} />)}
        </FormItem>
        <FormItem label="含义" hasFeedback {...formItemLayout}>
          {getFieldDecorator('lookupValue', {
            initialValue: item.lookupValue,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="排序号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('displayOrder', {
            initialValue: item.displayOrder,
            rules: [
              {
                required: true,
              },
            ],
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="语言" hasFeedback {...formItemLayout}>
          {getFieldDecorator('language', {
            initialValue: item.language,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="是否启用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('enabled', {
            initialValue: item.enabled,
            valuePropName: 'checked',
            rules: [
              {
                required: true,
              },
            ],
          })(<Checkbox />)}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: false,
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
  type: PropTypes.string,
  item: PropTypes.object,
  primaryKeyEditable: PropTypes.bool,
  onOk: PropTypes.func,
}

export default Form.create()(modal)

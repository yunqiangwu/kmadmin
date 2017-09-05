import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col, InputNumber, Radio, Modal, Button, Cascader } from 'antd'
import Container from "../../chart/Container"

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  loading,
  children,
  onSave,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const handleSave = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onSave(data)
    })
  }

  return (
    <Form>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem label="代码" {...formItemLayout}>
            {getFieldDecorator('lookupType', {
              initialValue: item.lookupType,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input readOnly />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input readOnly />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="描述" {...formItemLayout} wrapperCol={{ span: 14 }} >
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input.TextArea readOnly />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={24}>
        {
          children
        }
        {/* <Col span={12}> */}
        {/* <Button loading={loading} size={'large'} onClick={handleSave} >保存</Button> */}
        {/* </Col> */}
      </Row>

    </Form>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSave: PropTypes.func,
  loading: PropTypes.bool,
  children: PropTypes.any,
}

export default Form.create()(modal)

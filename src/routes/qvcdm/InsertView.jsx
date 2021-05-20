/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, Form, Modal, Input,
} from 'antd';
import { insert } from './service';

class InsertView extends React.Component {
  state = {
    visible: false,
  };

  submit = () => {
    const {
      form: { validateFields },
      getList,
    } = this.props;
    validateFields(async (err, values) => {
      if (err) {
        return false;
      }
      await insert(values);
      getList();
      this.setState({
        visible: false,
      });
    });
  };

  render() {
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Button onClick={() => this.setState({ visible: true })}>添加</Button>
        <Modal
          width={800}
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          title="添加"
          onOk={this.submit}
        >
          <Form {...formItemLayout}>
            <Form.Item label="table_name">
              {getFieldDecorator('table_name', {
                rules: [{ required: true, message: '必填' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="table_field">
              {getFieldDecorator('table_field', {
                rules: [{ required: true, message: '必填' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="mon_type">{getFieldDecorator('mon_type')(<Input />)}</Form.Item>
            <Form.Item label="condition">{getFieldDecorator('condition')(<Input />)}</Form.Item>
            <Form.Item label="mon_value1">{getFieldDecorator('mon_value1')(<Input />)}</Form.Item>
            <Form.Item label="mon_value2">{getFieldDecorator('mon_value2')(<Input />)}</Form.Item>
            <Form.Item label="warning_msg">{getFieldDecorator('warning_msg')(<Input />)}</Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(InsertView);

/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable quotes */
/* eslint-disable arrow-parens */
/* eslint-disable camelcase */
import React from 'react';
import {
  Modal, Button, Form, Select, Input, message,
} from 'antd';

import { create } from '../service';


const FormItem = Form.Item;
const Option = Select.Option;
class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

showModal = async () => {
  this.setState({ visible: true });
}

hideModal = () => {
  this.setState({ visible: false });
}

submit = async () => {
  const {
    form: {
      validateFields,
    },
    formFields,
    reFresh,
  } = this.props;
  validateFields(async (err, values) => {
    if (err) {
      return false;
    }
    const { product } = formFields;
    console.log(values);
    const res = await create({ ...values, product });
    if (res.code === 20000) {
      message.success('添加成功');
      this.hideModal();
      reFresh && reFresh();
    } else {
      message.error(res.msg || '操作失败,请重试！');
    }
  });
}

render() {
  const {
    visible,
  } = this.state;
  const {
    form: {
      getFieldDecorator,
    },
  } = this.props;
  const modalProps = {
    title: '创建配置',
    visible,
    onOk: this.submit,
    onCancel: this.hideModal,
    width: '800px',
  };
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
  return (
    <div>
      <Button onClick={this.showModal} type="primary">创建配置</Button>
      <Modal {...modalProps}>
        <Form {...formItemLayout}>
          <FormItem label="姓名" >
            {
              getFieldDecorator('name', {
                rules: [{ required: true, message: '必填' }],
              })(<Input />)
            }
          </FormItem>
          <FormItem label="平台">
            {
              getFieldDecorator('platform', {
                rules: [{ required: true, message: '必填' }],
                initialValue: '1',
              })(
                <Select>
                  <Option value="1" key="1">安卓</Option>
                  <Option value="2" key="2">iOS</Option>
                </Select>,
              )
            }
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
}
export default Form.create({})(Add);

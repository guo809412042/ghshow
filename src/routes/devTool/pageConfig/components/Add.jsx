/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable quotes */
/* eslint-disable arrow-parens */
/* eslint-disable camelcase */
import React from 'react';
import {
  Modal, Button, Form, Select, Input, Icon, Tag, message, Checkbox,
} from 'antd';

import { createEventModuleConfig } from '../service';


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
    reFresh,
    product,
  } = this.props;
  validateFields(async (err, values) => {
    if (err) {
      return false;
    }
    console.log(values);
    const res = await createEventModuleConfig({ ...values, productId: product });
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
          {/* 1 页面 2 模块 3 控件 4 行为 */}
          <FormItem label="事件ID">
            {
              getFieldDecorator('type', {
                rules: [{ required: true, message: '必填' }],
                initialValue: '1',
              })(
                <Select>
                  <Option value="1" key="1">页面</Option>
                  <Option value="2" key="2">模块</Option>
                  <Option value="3" key="3">控件</Option>
                  <Option value="4" key="4">行为</Option>
                </Select>,
              )
            }
          </FormItem>
          <FormItem label="中文名称" >
            {
              getFieldDecorator('module_name', {})(<Input />)
            }
          </FormItem>
          <FormItem label="英文名称" >
            {
              getFieldDecorator('module_key', {})(<Input />)
            }
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
}
export default Form.create({})(Add);

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import {
  Modal, Button, Form, Select, Input, message,
} from 'antd';
import { updataEventModuleConfig } from '../service/index';

const FormItem = Form.Item;
const Option = Select.Option;

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      onlyButtonDisabled: false,
    };
  }

  componentDidMount() {
    // getConditionValue('Android_AppVersion').then(rows => {
    //   // const appVersionList = removeDuplication(rows, 'value').reverse() || []
    //   this.setState({ appVersionList: rows })
    // }).catch(err => console.log(err))
  }

  handleOk = (e) => {
    e.preventDefault();
    const { content, callback } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const res = await updataEventModuleConfig({ ...values, id: content.id });
        if (res.code === 20000) {
          message.success('操作成功');
          this.setState({ visible: false });
          callback && callback();
        } else {
          message.error('操作失败');
        }
      }
    });
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { content } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <div style={{ marginRight: 10, display: 'inline-block' }}>
        <Button
          size="small"
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          编辑
        </Button>
        <Modal
          title="编辑"
          visible={this.state.visible}
          onOk={() => {
            this.handleOk;
          }}
          onCancel={() => {
            resetFields();
            this.setState({ visible: false });
          }}
          footer={[
            <Button
              key="ok"
              type="ghost"
              onClick={() => {
                this.setState({ visible: false });
              }}
            >
              {intl.get('common.tools.close').defaultMessage('关闭')}
            </Button>,
            <Button
              key="back"
              type="primary"
              onClick={this.handleOk}
              disabled={this.state.onlyButtonDisabled}
            >
              确定
            </Button>,
          ]}
        >
          <Form {...formItemLayout}>
            {/* 1 页面 2 模块 3 控件 4 行为 */}
            <FormItem label="事件ID">
              {
                getFieldDecorator('type', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: String(content.type),
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
                getFieldDecorator('module_name', {
                  initialValue: content.module_name,
                })(<Input />)
              }
            </FormItem>
            <FormItem label="英文名称" >
              {
                getFieldDecorator('module_key', {
                  initialValue: content.module_key,
                })(<Input />)
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Edit);

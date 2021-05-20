/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Form, Input, Card, Select, Button,
} from 'antd';
import { createConfig } from './service';

const TextArea = Input.TextArea;
class InsertAndUpdateView extends React.Component {
  state = {
    type: 'add',
  };

  componentWillReceiveProps() {}

  submit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      const data = values;
      await createConfig(data);
      this.props.submitOk(true);
      // this.props.form.resetFields();
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemInputView = (name, key, initialValue = '', required = true, width = 200) => (
      <Form.Item label={name}>
        {getFieldDecorator(`${key}`, {
          rules: [{ required, message: '请填写' }],
          initialValue,
        })(<Input style={{ width }} />)}
      </Form.Item>
    );
    const { type } = this.state;
    return (
      <Card title={type === 'add' ? '添加' : '编辑'}>
        <Form layout="inline">
          <Form.Item label="产品">
            {getFieldDecorator('product', {
              rules: [{ required: true, message: '请填写' }],
              initialValue: '2',
            })(
              <Select style={{ width: 200 }}>
                <Select.Option key="2" value="2">
                  VivaVideo
                </Select.Option>
                <Select.Option key="6" value="6">
                  VidStatus
                </Select.Option>
                <Select.Option key="3" value="3">
                  SlidePlus
                </Select.Option>
                <Select.Option key="10" value="10">
                  Tempo
                </Select.Option>
                <Select.Option key="15" value="15">
                  Vivacut
                </Select.Option>
                <Select.Option key="16" value="16">
                  Vivamini
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
          {formItemInputView('菜单名称', 'p_menu_title')}
          {formItemInputView('图表名称', 'name')}
          {formItemInputView('表名', 'database')}
          {formItemInputView('字段名称', 'field_name', '', true, 400)}
          {formItemInputView('日期字段', 'day_name', 'day')}
          {formItemInputView('平台字段', 'platform_name', 'platform', false)}
          {formItemInputView('地区字段', 'country_name', 'country', false)}
          {formItemInputView('时间计算开始', 'day_start', 1)}
          {formItemInputView('保留小数位', 'fixed_num', 0)}
          {formItemInputView('其他条件', 'other_where', '', false)}

          <Form.Item label="是否有百分号">
            {getFieldDecorator('suffix', {
              rules: [{ required: true, message: '请填写' }],
              initialValue: '2',
            })(
              <Select style={{ width: 200 }}>
                <Select.Option key="1" value="1">
                  有
                </Select.Option>
                <Select.Option key="2" value="2">
                  没有
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="RDS/HOLO">
            {getFieldDecorator('selectName', {
              rules: [{ required: true, message: '请填写' }],
              initialValue: 'RDS',
            })(
              <Select style={{ width: 200 }}>
                <Select.Option key="RDS" value="RDS">
                  RDS
                </Select.Option>
                <Select.Option key="HOLO" value="HOLO">
                  HOLO
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
          <div />
          <Form.Item label="sql模版">
            {getFieldDecorator('sql_template')(<TextArea rows={30} style={{ width: '600px' }} />)}
          </Form.Item>
          <div />
          <Button onClick={this.submit} style={{ marginTop: 10 }} type="primary">
            提交
          </Button>
        </Form>
      </Card>
    );
  }
}
export default Form.create()(InsertAndUpdateView);

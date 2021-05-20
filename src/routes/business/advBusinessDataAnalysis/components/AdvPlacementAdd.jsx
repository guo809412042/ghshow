import React, { Fragment } from 'react';
import {
  Button, Modal, Form, Select, Input, message,
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { UpdateAdvPlacement, AddAdvPlacement, GetVCMAdvPlacementList } from '../services';
import { AdvCompanyList } from './utils';

const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class AdvPlacement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      placementList: [],
    };
  }

  show = async () => {
    this.setState({ visible: true });
  };

  productChanged = async (product) => {
    const params = {
      product,
    };
    const { data } = await GetVCMAdvPlacementList(params);
    this.props.form.setFieldsValue({ placement_name: '' });
    this.setState({
      placementList: data.map(v => ({
        placement_id: v.name,
        placement_name: v.name,
      })),
    });
  }

  submit = () => {
    const { content, callback } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let res;
        if (content) {
          values.id = content.id;
          res = await UpdateAdvPlacement(values);
        } else {
          res = await AddAdvPlacement(values);
        }
        if (res && res.code === 20000) {
          message.success('保存成功');
          this.setState({ visible: false });
          if (typeof callback === 'function') {
            callback();
          }
        } else {
          message.warning(res.message);
        }
      }
    });
  }

  render=() => {
    const {
      appList = [], isAdd = true, content = {},
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (<Fragment>
      {isAdd ? <Button type="primary" onClick={this.show}>添加</Button> : <a onClick={this.show}>编辑</a>}
      <Modal title="添加广告位" width={500} visible={this.state.visible} onCancel={() => this.setState({ visible: false })} onOk={this.submit}>
        <Form ref={this.formRef} layout="horizontal">
          <FormItem label="产品" {...formItemLayout}>
            {getFieldDecorator('product_id', { initialValue: content.product_id ? String(content.product_id) : '', rules: [{ required: true, message: '请选择产品' }] })(
              <Select showSearch optionFilterProp="children" style={{ width: 200 }} onChange={this.productChanged}>
                {appList.map(item => (
                  <Option value={String(item.value)} key={item.key}>
                    {item.key}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem label="平台" {...formItemLayout}>
            {getFieldDecorator('platform', { initialValue: content.platform || '1', rules: [{ required: true, message: '请选择平台' }] })(
              <Select showSearch optionFilterProp="children" style={{ width: 200 }}>
                <Option value="1" key="1">
                    Android
                </Option>
                <Option value="2" key="2">
                    iOS
                </Option>
              </Select>,
            )}
          </FormItem>

          <FormItem label="广告商" {...formItemLayout}>
            {getFieldDecorator('company', { initialValue: content.company || '' })(
              <Select style={{ width: 200 }} showSearch allowClear>
                {AdvCompanyList.map(v => <Option key={v.name} value={v.name}>{v.name}</Option>)}
              </Select>,
            )}
          </FormItem>

          <FormItem label="广告位名称" {...formItemLayout}>
            {getFieldDecorator('placement_name', { initialValue: content.placement_name || '' })(
              <Select style={{ width: 200 }} showSearch allowClear>
                {this.state.placementList.map(v => <Option key={v.placement_name} value={v.placement_name}>{v.placement_name}</Option>)}
              </Select>,
            )}
          </FormItem>

          <FormItem label="广告位ID" {...formItemLayout}>
            {getFieldDecorator('placement_id', { initialValue: content.placement_id || '' })(
              <Input style={{ width: 200 }} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    </Fragment>);
  }
}

export default Form.create()(AdvPlacement);

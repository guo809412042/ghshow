import React, { Component } from 'react';
import intl from 'react-intl-universal';
import {
  Modal, Button, Form, Select,
} from 'antd';
import { getGHData } from '../../../../utils/request';

const FormItem = Form.Item;
const Option = Select.Option;

class DevState extends Component {
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
        if (content.platform === 'Android') {
          const sql = `UPDATE gh_event_manage SET android_dev='${
            values.android_dev
          }', android_state='${values.android_state}' WHERE id = ${content.id} `;
          await getGHData(sql);
        } else if (content.platform === 'iOS') {
          const sql = `UPDATE gh_event_manage SET ios_dev='${
            values.ios_dev
          }', ios_state='${values.ios_state}' WHERE id = ${content.id} `;
          await getGHData(sql);
        } else {
          const sql = `UPDATE gh_event_manage SET android_dev='${
            values.android_dev
          }', android_state='${values.android_state}', ios_dev='${
            values.ios_dev
          }', ios_state='${values.ios_state}' WHERE id = ${content.id} `;
          await getGHData(sql);
        }
        this.setState({ visible: false });
        callback && callback();
      }
    });
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { content, iosdev, androiddev } = this.props;
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
          状态
        </Button>
        <Modal
          title="状态"
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
          <Form>
            {content.platform.includes('Android') && (
              <div>
                <FormItem {...formItemLayout} label="安卓负责人">
                  {getFieldDecorator('android_dev', {
                    initialValue: content.android_dev,
                  })(<Select style={{ width: 300 }}>
                    {androiddev.map(item => (
                      <Option key={item.name} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} label="安卓状态">
                  {getFieldDecorator('android_state', {
                    initialValue:
                      String(content.android_state) === 'null'
                        ? ''
                        : String(content.android_state),
                  })(<Select style={{ width: 300 }}>
                    <Option value="0">未开始</Option>
                    <Option value="1">开发完成</Option>
                    <Option value="2">测试完成</Option>
                  </Select>)}
                </FormItem>
              </div>
            )}
            {content.platform.includes('iOS') && (
              <div>
                <FormItem {...formItemLayout} label="iOS负责人">
                  {getFieldDecorator('ios_dev', {
                    initialValue: content.ios_dev,
                  })(<Select style={{ width: 300 }}>
                    {iosdev.map(item => (
                      <Option key={item.name} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} label="iOS状态">
                  {getFieldDecorator('ios_state', {
                    initialValue:
                      String(content.ios_state) === 'null'
                        ? ''
                        : String(content.ios_state),
                  })(<Select style={{ width: 300 }}>
                    <Option value="0">未开始</Option>
                    <Option value="1">开发完成</Option>
                    <Option value="2">测试完成</Option>
                  </Select>)}
                </FormItem>
              </div>
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DevState);

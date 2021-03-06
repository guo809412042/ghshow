/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  Form, Input, Modal, Select, InputNumber, Tooltip, Col, Row,
} from 'antd';
import cookie from 'js-cookie';
import { APP_PRODUCT_LIST, TYPE_LIST, DAT_TYPE } from './const';
import { getConditionValue } from '../../utils/request';
import { getConfigList } from '../chartConfig/service';
import {
  createWarning, getWarningList, updateWarning, userList,
} from './service';

class InsertAndUpdateView extends React.Component {
  state = {
    visible: false,
    modalType: 'add',
    editRow: {},
    countryList: [],
    selectPtitle: undefined,
    selectPTitleList: [],
    dataSource: [],
    emailList: [],
    confirmLoading: false,
  };

  componentDidMount() {
    this.getCountryList();
    this.getWarningData();
    this.getUserList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.state.visible && nextProps.visible) {
      this.props.form.resetFields();
      this.setState(
        {
          visible: nextProps.visible,
          modalType: nextProps.modalType,
          editRow: nextProps.editRow,
        },
        async () => {
          if (nextProps.visible) {
            if (nextProps.modalType === 'edit' || nextProps.modalType === 'copy') {
              const res = await getWarningList({ id: nextProps.editRow.id });
              const row = res.rows[0];
              await this.getWarningData();
              this.props.form.setFieldsValue({
                name: row.name,
                type: row.type,
                country: row.country ? row.country.split(',') : [],
                platform: row.platform ? row.platform.split(',') : [],
                p_title_name: row.p_title_name,
                number: row.number,
                state: row.state,
                channel: row.channel,
                operator: row.operator,
                time_type: row.time_type,
                count: row.count,
                chart_id: row.chart_id,
                sendUser: row.send_user ? row.send_user.split(',') : [row.username],
              });
              this.setState({
                selectPtitle: row.p_title_name,
              });
            } else {
              this.getWarningData();
            }
          }
        },
      );
    }
  }

  getUserList = async () => {
    const res = await userList();
    const emails = [];
    for (const i of res.data) {
      if (i.email && !emails.includes(i.email)) {
        emails.push(i.email);
      }
    }
    this.setState({
      emailList: emails,
    });
  };

  getWarningData = async () => {
    const res = await getConfigList({ product: this.props.product });
    const selectPTitleList = [];
    for (const i of res) {
      if (!selectPTitleList.includes(i.p_menu_title)) {
        selectPTitleList.push(i.p_menu_title);
      }
    }
    this.setState({
      dataSource: res,
      selectPTitleList,
    });
  };

  getCountryList = async () => {
    const res = await getConditionValue('country');
    this.setState({
      countryList: res,
    });
  };

  submit = () => {
    this.setState({
      confirmLoading: true,
    });
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        this.setState({
          confirmLoading: false,
        });
        return;
      }
      const data = {
        ...values,
        product: this.props.product,
        send_user: values.sendUser.join(','),
        platform: values.platform ? values.platform.join(',') : '',
        country: values.country ? values.country.join(',') : '',
      };
      if (this.state.modalType === 'add' || this.state.modalType === 'copy') {
        data.username = cookie.get('email');
        delete data.id;
        await createWarning(data);
      } else {
        await updateWarning(data, this.state.editRow.id);
      }
      this.props.submitOk(true);
      this.props.form.resetFields();
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    });
  };

  render() {
    const {
      visible, modalType, countryList, selectPTitleList, selectPtitle, dataSource, confirmLoading,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Modal
        visible={visible}
        onCancel={() => {
          this.setState({ visible: false });
          this.props.submitOk(false);
        }}
        onOk={this.submit}
        title={modalType === 'edit' ? '??????' : '??????'}
        width={600}
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item label="????????????" {...formlayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '?????????' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="??????" {...formlayout}>
            {getFieldDecorator('product', {
              rules: [{ required: true, message: '?????????' }],
              initialValue: APP_PRODUCT_LIST[this.props.product],
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="????????????" {...formlayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '?????????' }],
              initialValue: '1',
            })(
              <Select placeholder="????????????">
                {Object.keys(TYPE_LIST).map(v => (
                  <Select.Option key={v} value={v}>
                    {TYPE_LIST[v]}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="????????????" {...formlayout}>
            <Row gutter={12}>
              <Col span={12}>
                {getFieldDecorator('country')(
                  <Select placeholder="??????" showSearch style={{ width: '100%' }} mode="multiple">
                    {countryList.map(v => (
                      <Select.Option key={v.value} value={v.value}>
                        {v.value}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator('platform')(
                  <Select placeholder="??????" style={{ width: '100%' }} mode="multiple">
                    <Select.Option key="1" value="1">
                      Android
                    </Select.Option>
                    <Select.Option key="2" value="2">
                      iOS
                    </Select.Option>
                  </Select>,
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="????????????" {...formlayout}>
            <Row gutter={12}>
              <Col span={10}>
                {getFieldDecorator('p_title_name', {
                  rules: [{ required: true, message: '?????????' }],
                })(
                  <Select
                    placeholder="??????"
                    showSearch
                    style={{ width: '100%' }}
                    onChange={v => this.setState({ selectPtitle: v })}
                  >
                    {selectPTitleList.map(v => (
                      <Select.Option key={v} value={v}>
                        {v}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Col>
              <Col span={14}>
                {getFieldDecorator('chart_id', {
                  rules: [{ required: true, message: '?????????' }],
                })(
                  <Select placeholder="????????????" showSearch style={{ width: '100%' }}>
                    {selectPtitle
                      ? dataSource
                        .filter(v => v.p_menu_title === selectPtitle)
                        .map(v => (
                          <Select.Option key={v.id} value={v.id}>
                            <Tooltip title={v.name}>{v.name}</Tooltip>
                          </Select.Option>
                        ))
                      : []}
                  </Select>,
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="????????????" {...formlayout}>
            <Row gutter={12}>
              <Col span={7}>
                {getFieldDecorator('operator', {
                  rules: [{ required: true, message: '?????????' }],
                  initialValue: '<=',
                })(
                  <Select placeholder="??????" style={{ width: '100%' }}>
                    <Select.Option key="<=" value="<=">
                      ??????
                    </Select.Option>
                    <Select.Option key=">=" value=">=">
                      ??????
                    </Select.Option>
                    <Select.Option key="===" value="===">
                      ??????
                    </Select.Option>
                  </Select>,
                )}
              </Col>
              <Col span={7}>
                {getFieldDecorator('time_type', {
                  rules: [{ required: true, message: '?????????' }],
                  initialValue: '1',
                })(
                  <Select placeholder="??????" style={{ width: '100%' }}>
                    {Object.keys(DAT_TYPE).map(v => (
                      <Select.Option key={v} value={v}>
                        {DAT_TYPE[v]}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Col>
              <Col span={7}>
                {getFieldDecorator('number', {
                  rules: [{ required: true, message: '?????????' }],
                })(<InputNumber placeholder="??????" style={{ width: '100%' }} />)}
              </Col>
              %
            </Row>
          </Form.Item>
          <Form.Item label="????????????" {...formlayout}>
            {getFieldDecorator('state', {
              rules: [{ required: true, message: '?????????' }],
              initialValue: '1',
            })(
              <Select placeholder="????????????">
                <Select.Option key="1" value="1">
                  ??????
                </Select.Option>
                <Select.Option key="0" value="0">
                  ??????
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="?????????" {...formlayout}>
            {getFieldDecorator('sendUser', {
              rules: [{ required: true, message: '?????????' }],
              initialValue: [cookie.get('email')],
            })(
              <Select placeholder="?????????" mode="multiple" showSearch>
                {this.state.emailList.map(v => (
                  <Select.Option key={v} value={v}>
                    {v}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="????????????" {...formlayout}>
            {getFieldDecorator('channel', {
              rules: [{ required: true, message: '?????????' }],
              initialValue: '1',
            })(
              <Select placeholder="????????????">
                <Select.Option key="1" value="1">
                  ??????
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="????????????" {...formlayout}>
            {getFieldDecorator('count', {
              rules: [{ required: true, message: '?????????' }],
              initialValue: '1',
            })(<InputNumber disabled />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(InsertAndUpdateView);

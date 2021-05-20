/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  Form, Input, Modal, Select, InputNumber, Col, Row,
} from 'antd';
import cookie from 'js-cookie';
import {
  APP_PRODUCT_LIST, DAT_TYPE, SUB_TYPE_MAP,
} from './const';
import { getConditionValue, getData } from '../../utils/request';
// import { getConfigList } from '../chartConfig/service';
import { dbsourcesql } from './sqlTemplate';

import {
  createWarning, getWarningList, updateWarning, userList,
} from './service';

class InsertAndUpdateView extends React.Component {
  state = {
    visible: false,
    modalType: 'add',
    editRow: {},
    content: {},
    countryList: [],
    selectPtitle: undefined,
    selectPTitleList: [],
    dataSource: [],
    emailList: [],
    confirmLoading: false,
    mediaSource: [],
    campaignName: [],
  };

  componentDidMount() {
    this.getCountryList();
    // this.getWarningData();
    this.getUserList();
    this.getmediaSourceList();
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
              // await this.getWarningData();
              this.props.form.setFieldsValue({
                name: row.name,
                product: row.product,
                type: row.type,
                country: row.country ? row.country.split(',') : [],
                campaign: row.campaign ? row.campaign.split(',') : [],
                platform: row.platform,
                data_time: row.data_time,
                warning_type: row.warning_type ? String(row.warning_type) : undefined,
                // warning_sub_type: row.warning_sub_type,
                state: row.state,
                compare_type: String(row.compare_type),
                channel: row.channel,
                operator: row.operator,
                data_number: row.data_number,
                // time_type: row.time_type ? String(row.time_type) : undefined,
                sendUser: row.send_user ? row.send_user.split(',') : [row.username],
              });
              this.setState({
                content: row,
              });
            }
          }
        },
      );
    }
  }

  getmediaSourceList = async () => {
    const mediaSql = dbsourcesql.replace(/#type#/g, 'media_source').replace(/#db#/g, 'ads_pub_dp_cltusr_sub_1d').replace(/#where#/, '');
    const mediaSource = await getData(mediaSql);
    this.setState({
      mediaSource,
    });
  }

  getcampaignNameList = async (value) => {
    const { getFieldValue } = this.props.form;
    const campaignSql = dbsourcesql.replace(/#type#/g, 'campaign_name').replace(/#db#/g, 'ads_pub_dp_cltusr_sub_1d').replace(/#where#/, ` and media_source in ('${value}') and product_id = ${getFieldValue('product')}`);
    const campaignName = await getData(campaignSql);
    this.setState({
      campaignName,
    });
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

  // getWarningData = async () => {
  //   const res = await getConfigList({ product: this.props.product });
  //   const selectPTitleList = [];
  //   for (const i of res) {
  //     if (!selectPTitleList.includes(i.p_menu_title)) {
  //       selectPTitleList.push(i.p_menu_title);
  //     }
  //   }
  //   this.setState({
  //     dataSource: res,
  //     selectPTitleList,
  //   });
  // };

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
      const data = Object.assign({ time_type: 7 }, {
        ...values,
        // product: this.props.product,
        send_user: values.sendUser.join(','),
        campaign: values.campaign ? values.campaign.join(',') : '',
        // channel: values.channel.join(','),
        // platform: values.platform ? values.platform.join(',') : '',
        country: values.country ? values.country.join(',') : '',
      });
      console.log('data', data);
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
      visible, modalType, countryList, confirmLoading, mediaSource, campaignName, content,
    } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
        title={modalType === 'edit' ? '编辑' : '新增'}
        width={600}
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item label="预警名称" {...formlayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请选择' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="产品" {...formlayout}>
            {getFieldDecorator('product', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: this.props.product || undefined,
            })(<Select placeholder="选择产品" style={{ width: 200 }}>
              {Object.keys(APP_PRODUCT_LIST).map(v => (
                <Select.Option key={v} value={v}>
                  {APP_PRODUCT_LIST[v]}
                </Select.Option>
              ))}
            </Select>)}
          </Form.Item>
          <Form.Item label="平台" {...formlayout}>
            {getFieldDecorator('platform', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="平台" style={{ width: '100%' }}>
                <Select.Option key="1" value="1">
                  Android
                </Select.Option>
                <Select.Option key="2" value="2">
                  iOS
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="地区" {...formlayout}>
            {getFieldDecorator('country')(
              <Select placeholder="地区" showSearch style={{ width: '100%' }} mode="multiple">
                {countryList.map(v => (
                  <Select.Option key={v.value} value={v.value}>
                    {v.value}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="渠道" {...formlayout}>
            {getFieldDecorator('channel')(
              <Select placeholder="渠道" showSearch style={{ width: '100%' }} onChange={this.getcampaignNameList}>
                {mediaSource.map(v => (
                  <Select.Option key={v.media_source} value={v.media_source}>
                    {v.media_source}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="campaign" {...formlayout}>
            {getFieldDecorator('campaign')(
              <Select placeholder="campaign" showSearch style={{ width: '100%' }} mode="multiple">
                {campaignName.map(v => (
                  <Select.Option key={v.campaign_name} value={v.campaign_name}>
                    {v.campaign_name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="数据日期" {...formlayout}>
            {getFieldDecorator('data_time')(
              <InputNumber style={{ width: '100%' }} min={1}/>,
            )}
          </Form.Item>
          <Form.Item label="预警指标" {...formlayout}>
            <Row gutter={12}>
              <Col span={12}>
                {getFieldDecorator('warning_type', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: '1',
                })(
                  <Select
                    placeholder="指标"
                    showSearch
                    style={{ width: '100%' }}
                    onChange={v => this.setState({ selectPtitle: v })}
                  >
                    <Select.Option key="1" value="1">新增</Select.Option>
                    <Select.Option key="2" value="2">CPA</Select.Option>
                    <Select.Option key="3" value="3">消耗</Select.Option>
                    <Select.Option key="4" value="4">ROI</Select.Option>
                    <Select.Option key="5" value="5">预估ROI</Select.Option>
                    <Select.Option key="6" value="6">留存率</Select.Option>
                  </Select>,
                )}
              </Col>
              {getFieldValue('warning_type') === '2' && <Col span={12}>
                {getFieldDecorator('warning_sub_type', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: content.warning_sub_type,
                })(
                  <Select showSearch style={{ width: '100%' }}>
                    {SUB_TYPE_MAP[getFieldValue('warning_type')]
                      .map(v => (
                        <Select.Option key={v.value} value={v.value}>
                          {v.name}
                        </Select.Option>
                      ))}
                  </Select>,
                )}
              </Col>}
            </Row>
          </Form.Item>
          <Form.Item label="衡量方式" {...formlayout}>
            <Row gutter={12}>
              <Col span={12}>
                {getFieldDecorator('compare_type', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: '1',
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option key="1" value="1">
                    相对值
                    </Select.Option>
                    <Select.Option key="2" value="2">
                    绝对值
                    </Select.Option>
                  </Select>,
                )}
              </Col>
              <Col span={12}>
                {getFieldDecorator('operator', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: '<=',
                })(
                  <Select placeholder="计算" style={{ width: '100%' }}>
                    <Select.Option key="<=" value="<=">
                    &lt;=
                    </Select.Option>
                    <Select.Option key=">=" value=">=">
                    &gt;=
                    </Select.Option>
                    <Select.Option key="<" value="<">
                    &lt;
                    </Select.Option>
                    <Select.Option key=">" value=">">
                    &gt;
                    </Select.Option>
                  </Select>,
                )}
              </Col>
              {getFieldValue('compare_type') === '1' && <Col span={12}>
                {getFieldDecorator('time_type', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: content.time_type ? String(content.time_type) : '7',
                })(
                  <Select placeholder="时间" style={{ width: '100%' }}>
                    {Object.keys(DAT_TYPE).map(v => (
                      <Select.Option key={String(v)} value={String(v)}>
                        {DAT_TYPE[v]}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Col>}
              <Col span={12}>
                {getFieldDecorator('data_number', {
                  rules: [{ required: true, message: '请输入' }],
                })(<InputNumber style={{ width: '100%' }} />)}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="是否启用" {...formlayout}>
            {getFieldDecorator('state', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: '1',
            })(
              <Select placeholder="推送渠道">
                <Select.Option key="1" value="1">
                  启用
                </Select.Option>
                <Select.Option key="0" value="0">
                  停用
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="发送人" {...formlayout}>
            {getFieldDecorator('sendUser', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: [cookie.get('email')],
            })(
              <Select placeholder="发送人" mode="multiple" showSearch>
                {this.state.emailList.map(v => (
                  <Select.Option key={v} value={v}>
                    {v}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(InsertAndUpdateView);

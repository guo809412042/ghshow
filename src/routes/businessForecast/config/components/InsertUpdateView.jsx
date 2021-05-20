/* eslint-disable react/no-unused-state */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import React from 'react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {
  Form, Modal, Select, DatePicker, InputNumber, Col, Row, message,
} from 'antd';
import moment from 'moment';
import {
  COUNTRY,
  CHANNEL_TYPE,
  TYPES,
  ORGANIC_CN_FORM,
  PUT_CN_FROM,
  ORGANIC_NOT_CN_FORM,
  PUT_NOT_CN_FROM,
} from '../const';
import { createConfig, updateConfig, getConfigList } from '../../services';
import * as orgFunc from '../../orgFunc';
import * as putFunc from '../../putFunc';

const add = (num1, num2) => Number(num1) + Number(num2);
const multip = (num1, num2) => Number(num1) * Number(num2);

const getFormData = (selectCountry, selectChannel) => {
  let data;
  if (selectCountry === '中国') {
    if (Number(selectChannel) === 1) {
      data = ORGANIC_CN_FORM;
    } else {
      data = PUT_CN_FROM;
    }
  } else if (Number(selectChannel) === 1) {
    data = ORGANIC_NOT_CN_FORM;
  } else {
    data = PUT_NOT_CN_FROM;
  }
  return data;
};
const { MonthPicker } = DatePicker;
class InsertUpdateView extends React.Component {
  state = {
    visible: false,
    modalType: 'add',
    selectCountry: '中国',
    selectChannel: '1',
    editRow: {},
    dateTime: undefined,
    firstDate: undefined,
  };

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.state.visible) {
      this.setState(
        {
          visible: nextProps.visible,
          modalType: nextProps.modalType,
          editRow: nextProps.editRow,
        },
        () => {
          if (nextProps.modalType === 'edit') {
            this.setState(
              {
                selectCountry: nextProps.editRow.country,
                selectChannel: nextProps.editRow.channel.toString(),
              },
              () => {
                this.getFirstDate();
                const values = nextProps.editRow;
                const { country, channel } = nextProps.editRow;
                const data = getFormData(country, channel);
                this.props.form.setFieldsValue({
                  country,
                  channel: values.channel.toString(),
                  date_time: moment(values.date_time, 'YYYYMM'),
                  type: values.type.toString(),
                  first_date: moment(values.first_date || new Date(), 'YYYYMM'),
                });
                for (const i of data) {
                  for (const j of i.children) {
                    this.props.form.setFieldsValue({
                      [`${j.key}`]: values[j.key],
                    });
                  }
                }
              },
            );
          } else {
            this.getFirstDate();
            this.props.form.resetFields();
          }
        },
      );
    }
  }

  submit = () => {
    const { form } = this.props;
    const { modalType, editRow } = this.state;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return '';
      }
      values.date_time = moment(values.date_time).format('YYYYMM');
      values.first_date = moment(values.first_date).format('YYYYMM');
      if (modalType === 'add') {
        await createConfig(values);
      } else {
        await updateConfig(editRow.id, values);
      }
      this.props.submitOk(true);
      message.success('操作成功！');
      this.setState({
        visible: false,
      });
    });
  };

  getFirstDate = async () => {
    const { selectCountry, selectChannel, dateTime } = this.state;
    if (dateTime) {
      let res = await getConfigList({
        country: selectCountry,
        channel: selectChannel,
        startDate: '199001',
        endDate: moment(dateTime).format('YYYYMM'),
      });
      res = res.data.filter(v => v.date_time === v.first_date);
      if (res.length) {
        const firstDate = moment(res[res.length - 1].first_date.toString(), 'YYYYMM');
        this.props.form.setFieldsValue({
          first_date: firstDate,
        });
        this.setState(
          {
            firstDate,
          },
          this.setFirstValue,
        );
      }
    }
  };

  setFirstValue = async () => {
    const {
      selectCountry, selectChannel, dateTime, firstDate,
    } = this.state;
    if (firstDate) {
      const date = moment(dateTime).format('YYYYMM');
      const first = moment(firstDate).format('YYYYMM');
      if (Number(selectChannel) === 2 && date !== first) {
        const orgRes = await getConfigList({
          country: selectCountry,
          channel: 1,
          startDate: date,
          endDate: date,
        });
        const putRes = await getConfigList({
          country: selectCountry,
          channel: 2,
          startDate: moment(dateTime)
            .subtract(1, 'month')
            .format('YYYYMM'),
          endDate: moment(dateTime)
            .subtract(1, 'month')
            .format('YYYYMM'),
        });
        const org = orgRes.data.find(v => Number(v.channel) === 1);
        const row = putRes.data.find(v => Number(v.channel) === 2);
        if (selectCountry === '中国') {
          this.props.form.setFieldsValue({
            month_init_and: multip(add(putFunc.E10(row, org), putFunc.J10(row)), putFunc.O10(org)),
            month_init_ios: multip(add(putFunc.H10(row, org), putFunc.N10(row)), putFunc.P10(org)),
          });
        } else if (selectCountry !== '中国') {
          this.props.form.setFieldsValue({
            month_init_gp: multip(add(putFunc.F3(row, org), putFunc.J3(row)), putFunc.N3(org)),
            month_init_ios: multip(add(putFunc.H3(row, org), putFunc.L3(row)), putFunc.O3(org)),
          });
        }
      }
      if (Number(selectChannel) === 2 && date === first) {
        if (selectCountry === '中国') {
          this.props.form.setFieldsValue({
            month_init_and: undefined,
            month_init_ios: undefined,
          });
        } else if (selectCountry !== '中国') {
          this.props.form.setFieldsValue({
            month_init_gp: undefined,
            month_init_ios: undefined,
          });
        }
      }
    }
  };

  valueChange = async (value, key) => {
    const { selectCountry, selectChannel, dateTime } = this.state;
    let lastMonthRes = await getConfigList({
      country: selectCountry,
      channel: selectChannel,
      startDate: moment(dateTime)
        .subtract(1, 'month')
        .format('YYYYMM'),
      endDate: moment(dateTime)
        .subtract(1, 'month')
        .format('YYYYMM'),
    });
    lastMonthRes = lastMonthRes.data;
    if (lastMonthRes.length) {
      if (key === 'month_renewal_and' && value) {
        this.props.form.setFieldsValue({
          month_renewal_init_user: add(orgFunc.F10(lastMonthRes[0]), orgFunc.K10(lastMonthRes[0])) * value,
        });
      }
      if (key === 'month_renewal_gp' && value) {
        this.props.form.setFieldsValue({
          month_init_gp: add(orgFunc.E3(lastMonthRes[0]), orgFunc.I3(lastMonthRes[0])) * value,
        });
      }
      if (key === 'month_renewal_ios' && value) {
        this.props.form.setFieldsValue({
          month_init_ios: add(orgFunc.K3(lastMonthRes[0]), orgFunc.G3(lastMonthRes[0])) * value,
        });
      }
    }
  };

  formView = () => {
    const { getFieldDecorator } = this.props.form;

    const formTemplate = (label, key) => (
      <Col span={12} key={key}>
        <Form.Item label={label} key={key} labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator(key, {
            rules: [
              {
                required: true,
                message: '请填写!',
              },
            ],
          })(
            key === 'month_renewal_and'
              || key === 'month_renewal_gp'
              || key === 'month_renewal_ios'
              || key === 'month_renewal_and' ? (
                <InputNumber onBlur={e => this.valueChange(e.target.value, key)} />
              ) : (
                <InputNumber />
              ),
          )}
        </Form.Item>
      </Col>
    );
    const { selectChannel, selectCountry } = this.state;
    const data = getFormData(selectCountry, selectChannel);
    return data.map(v => (
      <div
        style={{
          border: '1px dashed #e3e3e3',
          padding: 10,
          margin: 5,
        }}
      >
        <p style={{ borderBottom: '1px dashed #e3e3e3' }}>{v.title}</p>
        <Row>{v.children.map(item => formTemplate(item.label, item.key))}</Row>
      </div>
    ));
  };

  render() {
    const {
      visible, modalType, selectCountry, selectChannel,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={visible}
        onCancel={() => {
          this.setState({ visible: false });
          this.props.submitOk(false);
        }}
        onOk={this.submit}
        title={modalType === 'edit' ? '编辑' : '新增'}
        width={880}
      >
        <Form layout="inline">
          <Form.Item label="预测地区">
            {getFieldDecorator('country', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: selectCountry,
            })(
              <Select
                style={{ width: 100 }}
                onChange={value => this.setState({ selectCountry: value }, this.getFirstDate)}
              >
                {Object.keys(COUNTRY).map(v => (
                  <Select.Option key={v} value={COUNTRY[v]}>
                    {COUNTRY[v]}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="渠道类型">
            {getFieldDecorator('channel', {
              initialValue: selectChannel,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select
                style={{ width: 100 }}
                onChange={value => this.setState({ selectChannel: value }, this.getFirstDate)}
              >
                {Object.keys(CHANNEL_TYPE).map(v => (
                  <Select.Option key={v} value={v}>
                    {CHANNEL_TYPE[v]}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="预测时间">
            {getFieldDecorator('date_time', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <MonthPicker
                locale={locale}
                style={{ width: 120 }}
                onChange={value => this.setState(
                  {
                    dateTime: value,
                  },
                  this.getFirstDate,
                )
                }
              />,
            )}
          </Form.Item>
          <Form.Item label="预测类型">
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select style={{ width: 100 }}>
                {Object.keys(TYPES).map(v => (
                  <Select.Option key={v} value={v}>
                    {TYPES[v]}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Form>
        <Form layout="horizontal">
          <div
            style={{
              border: '1px dashed #e3e3e3',
              padding: 10,
              margin: 5,
            }}
          >
            <p style={{ borderBottom: '1px dashed #e3e3e3' }}>初始值</p>
            <Row>
              <Col span={12} key="first_date">
                <Form.Item label="首月" key="first_date" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  {getFieldDecorator('first_date', {
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <MonthPicker
                      locale={locale}
                      style={{ width: 120 }}
                      onChange={value => this.setState(
                        {
                          firstDate: value,
                        },
                        this.setFirstValue,
                      )
                      }
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>

          {this.formView()}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(InsertUpdateView);

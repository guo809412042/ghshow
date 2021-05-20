/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  Form, Modal, Input, Select, Row, Col, Icon, message, Spin, Switch, Button, Table,
} from 'antd';
import jsCookie from 'js-cookie';
import moment from 'moment';
import _ from 'lodash';
import { getHoloData } from '../../../utils/request';
import { eventNameSQL } from './sqlTemplate';
import { literalOptions, numberOptions } from '../../common/constants';
import { getFunnelEvent, createFunnelEvent, updateFunnelEvent } from '../service';
import { createSqlWhere } from '../../../utils/utils';
import style from './index.less';
import { getEventNameList } from '../../event/services/index';


class InsertOrUpdateView extends React.Component {
  state = {
    visible: false,
    modalType: 'add',
    editRow: {},
    loading: false,
    eventList: [], // 事件列表
    eventKeyList: [], // 事件key列表
    eventValueList: [], // 事件valuke列表
    steps: [
      {
        index: 1,
        keys: [],
      },
    ],
    stepsType: [['select', []]],
    eventSource: [],
    eventKeySource: [],
    checkModal: false,
    checkResult: [], // 校验结果
    eventNamesJson: {},
    productId: 0,
  };

  async componentDidMount() {
    await this.getEventNameCH();
    await this.getEventNameList();
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.product_id !== this.state.productId) {
      await this.getEventNameCH();
      await this.getEventNameList();
      this.setState({ productId: nextProps.product_id });
    }
    if (nextProps.visible !== this.state.visible) {
      this.props.form.resetFields();
      this.setState(
        {
          visible: nextProps.visible,
          modalType: nextProps.modalType,
          editRow: nextProps.editRow,
          loading: true,
          steps: [
            {
              index: 1,
              keys: [],
            },
          ],
          eventList: [],
          eventKeyList: [],
          eventValueList: [],
          stepsType: [['select', []]],
        },
        () => {
          this.setState({
            loading: false,
          });
          if (nextProps.modalType === 'edit') {
            this.handleEdit(nextProps.editRow.funnel_id);
          }
        },
      );
    }
  }

  // 获取事件中文名称
  getEventNameCH=async () => {
    const res = await getEventNameList();
    const EventNamesJson = {};
    res.data.forEach((v) => {
      EventNamesJson[v.event_name] = v.event_name_zh;
    });
    this.setState({ eventNamesJson: EventNamesJson });
  }

  handleEdit = async (funnelId) => {
    const { funnelType } = this.props;
    const res = await getFunnelEvent({ funnelId, product_id: this.props.product_id, funnelType });
    let data = res.data;
    data = data.sort((a, b) => a.step - b.step);
    const { form } = this.props;
    form.setFieldsValue({
      name: data[0].name,
      tag: data[0].tag,
    });
    const steps = [];
    const stepsType = [];
    for (let i = 1; i <= data.length; i++) {
      const stepType = ['select', []];
      const arr = {
        index: i,
        keys: [],
      };
      const eventKey = data[i - 1].event_key;
      for (let j = 1; j <= JSON.parse(eventKey).length; j++) {
        arr.keys.push(j);
        stepType[1].push('select');
      }
      steps.push(arr);
      stepsType.push(stepType);
    }
    this.setState(
      {
        steps,
        stepsType,
      },
      () => {
        steps.forEach((step, index) => {
          const eventName = data[step.index - 1].event_name;
          const row = JSON.parse(data[step.index - 1].event_key);
          stepsType[index][1].push('select');
          form.setFieldsValue({
            [`event-${step.index}`]: eventName,
          });
          step.keys.forEach((key) => {
            form.setFieldsValue({
              [`event-key-${step.index}-${key}`]: row[key - 1].key,
              [`event-operator-${step.index}-${key}`]: row[key - 1].operator,
              [`event-value-${step.index}-${key}`]: row[key - 1].value,
            });
          });
        });
      },
    );
  };

  getEventNameList = async () => {
    const { eventNamesJson } = this.state;
    if ([6, 33].includes(+this.props.product_id)) {
      this.setState({
        eventSource: [],
      });
    } else {
      const res = await getHoloData(
        createSqlWhere({
          sql: eventNameSQL,
          database: this.props.database,
        }),
      );
      const eventSource = [];
      for (const i of res) {
        if (!eventSource.includes(i.event_name)) {
          eventSource.push({
            event_name: i.event_name,
            event_name_zh: eventNamesJson[i.event_name] || '',
          });
        }
      }
      this.setState({
        eventSource,
      });
    }
  };

  handleSearch = (e) => {
    const { eventSource } = this.state;
    if (e) {
      const eventList = eventSource.filter(v => (v.event_name).toUpperCase().includes(e.toUpperCase()));
      this.setState({
        eventList: eventList.length ? eventList.slice(0, 100) : [e],
      });
    } else {
      this.setState({
        eventList: [],
      });
    }
  };

  handleKeySearch = (e) => {
    const { eventKeySource } = this.state;
    if (e) {
      const eventKeyList = eventKeySource.filter(v => v.key_name.toUpperCase().includes(e.toUpperCase()));
      this.setState({
        eventKeyList: eventKeyList.length ? eventKeyList : [{ key_name: e }],
      });
    } else {
      this.setState({
        eventKeyList: eventKeySource,
      });
    }
  };

  eventChange = async (e) => {
    if ([6, 33].includes(+this.props.product_id)) {
      this.setState({
        eventKeySource: [],
        eventKeyList: [],
      });
    } else if (e) {
      const startDate = moment()
        .subtract(3, 'days')
        .format('YYYYMMDD');
      const endDate = moment()
        .subtract(1, 'days')
        .format('YYYYMMDD');
      const sql = `SELECT key_name
       FROM holo_${this.props.product}_log_event_key_count
      where event_name= '${e}'
      and ds >= '${startDate}' and ds <='${endDate}' 
      group by key_name
      `;
      const res = await getHoloData(sql);
      this.setState({
        eventKeySource: res,
        eventKeyList: res,
      });
    } else {
      this.setState({
        eventKeySource: [],
        eventKeyList: [],
      });
    }
  };

  addEvent = () => {
    const { steps, stepsType } = this.state;
    stepsType.push(['select', []]);
    const add = Math.max(...steps.map(v => v.index));
    steps.push({
      index: add * 1 + 1,
      keys: [],
    });
    this.setState({
      steps,
      stepsType,
    });
  };

  addKey = (index, i) => {
    const { steps, stepsType } = this.state;
    stepsType[i][1].push('select');
    const keys = steps[i].keys;
    const add = keys.length ? keys[keys.length - 1] : 0;
    steps[i].keys.push(add * 1 + 1);
    this.setState({
      steps,
      stepsType,
    });
  };

  remove = (index, i) => {
    let { steps } = this.state;
    const { stepsType } = this.state;
    stepsType.splice(i, 1);
    steps = steps.filter(v => v.index !== index);
    this.setState({
      steps,
      stepsType,
    });
  };

  removeKey = (pIndex, key, i, j) => {
    const { steps, stepsType } = this.state;
    stepsType[i][1].splice(j, 1);
    const keys = steps[i].keys;
    steps[i].keys = keys.filter(v => v !== key);
    this.setState({
      steps,
      stepsType,
    });
  };

  eventKeyChange = async (e, pIndex, key) => {
    if ([6, 33].includes(+this.props.product_id)) {
      this.setState({
        eventValueList: [],
      });
    } else {
      const { form } = this.props;
      const eventName = form.getFieldValue(`event-${pIndex}`);
      const startDate = moment()
        .subtract(3, 'days')
        .format('YYYYMMDD');
      const endDate = moment()
        .subtract(1, 'days')
        .format('YYYYMMDD');
      if (e) {
        const sql = `
        SELECT param_value
        FROM holo_${this.props.product}_log_event_key_count
        where event_name= '${eventName}'
        and key_name= '${e}' 
        and ds >= '${startDate}' and ds <= '${endDate}'
        and param_value IS NOT NULL
        group by param_value
         `;
        const eventValueList = await getHoloData(sql);
        this.setState({
          eventValueList,
        });
      } else {
        this.setState({
          eventValueList: [],
        });
      }
    }
  };

  handleClick = (pIndex) => {
    this.setState(
      {
        eventKeyList: [],
      },
      () => {
        const { form } = this.props;
        const eventName = form.getFieldValue(`event-${pIndex}`);
        if (eventName) {
          this.eventChange(eventName);
        }
      },
    );
  };

  handleValueFocus = (pIndex, index) => {
    this.setState(
      {
        eventValueList: [],
      },
      () => {
        const { form } = this.props;
        const eventName = form.getFieldValue(`event-${pIndex}`);
        const eventKey = form.getFieldValue(`event-key-${pIndex}-${index}`);
        if (eventName && eventKey) {
          this.eventKeyChange(eventKey, pIndex, index);
        }
      },
    );
  };

  submit = async () => {
    const { form, product_id, funnelType } = this.props;
    const { modalType, editRow, steps } = this.state;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      const data = {
        name: values.name,
        tag: values.tag,
        product_id,
      };
      const eventName = [];
      const eventKeys = [];

      for (const i of steps) {
        eventName.push(values[`event-${i.index}`]);
        const arr = {
          event: values[`event-${i.index}`],
          key: [],
        };
        for (const j of i.keys) {
          if (values[`event-key-${i.index}-${j}`]) {
            arr.key.push({
              key: values[`event-key-${i.index}-${j}`],
              operator: values[`event-operator-${i.index}-${j}`],
              value: values[`event-value-${i.index}-${j}`] || [],
            });
          }
        }
        eventKeys.push(arr);
      }
      data.event_name = eventName.join('||');
      data.event_key = JSON.stringify(eventKeys);
      data.funnel_type = funnelType;
      if (modalType === 'add') {
        data.username = jsCookie.get('email');
        await createFunnelEvent(data);
      } else {
        data.username = editRow.username;
        data.update_username = jsCookie.get('email');
        await updateFunnelEvent(editRow.funnel_id, data);
      }
      message.success('操作成功！');
      this.setState(
        {
          visible: false,
          editRow: {},
          steps: [
            {
              index: 1,
              keys: [1],
            },
          ],
          eventList: [],
          eventKeyList: [],
          eventValueList: [],
          stepsType: [['select', ['select']]],
        },
        () => {
          this.props.submitOk(true);
        },
      );
    });
  };

  eventTypeChange = (e, index) => {
    const { stepsType } = this.state;
    stepsType[index][0] = e ? 'select' : 'input';
    this.setState({
      stepsType,
    });
  };

  eventKeyTypeChange = (e, index, j) => {
    const { stepsType } = this.state;
    stepsType[index][1][j] = e ? 'select' : 'input';
    this.setState({
      stepsType,
    });
  };

  move = (step, index) => {
    const { steps, stepsType } = this.state;
    const lastStep = _.cloneDeep(steps[index - 1]);
    const lastStepKey = _.cloneDeep(stepsType[index - 1]);
    steps[index - 1] = step;
    steps[index] = lastStep;
    stepsType[index - 1] = stepsType[index];
    stepsType[index] = lastStepKey;
    this.setState({
      steps,
      stepsType,
    });
  };

  formItems = () => {
    const {
      steps, eventList, eventKeyList, eventValueList, eventNamesJson, eventSource,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const colors = ['#eea2a2', '#bbc1bf', '#57c6e1', '#b49fda', '#7ac5d8'];
    return steps.map((step, index) => (
      <Row key={step.index}>
        {index ? (
          <Col span={1}>
            <Icon
              onClick={() => this.move(step, index)}
              type="vertical-align-top"
              style={{
                cursor: 'pointer',
                color: `${colors[index % colors.length]}`,
                fontSize: 24,
              }}
            />
          </Col>
        ) : (
          <Col span={1} />
        )}
        <Col span={1}>
          <span
            style={{
              background: `${colors[index % colors.length]}`,
              color: '#fff',
              padding: '5px 10px',
              borderRadius: 4,
            }}
          >
            {index * 1 + 1}
          </span>
        </Col>
        <Col
          span={22}
          style={{
            border: '1px dashed rgba(0,0,0,0.3)',
            padding: 20,
            borderRadius: 5,
            marginBottom: 20,
          }}
        >
          <Row id={`${step.index}-row`}>
            <Col id={step.index} span={18}>
              <Form.Item key={step.index[index]}>
                {getFieldDecorator(`event-${step.index}`, {
                  rules: [{ required: true, message: '请选择' }],
                })(
                  eventSource.length > 0
                    ? <Select
                      placeholder="事件名称"
                      showSearch
                      onSearch={this.handleSearch}
                      filterOption={false}
                      style={{ width: '95%' }}
                    // filterOption={(inputValue, option) => option.key.toLocaleLowerCase().indexOf(inputValue.toLocaleLowerCase()) > -1}
                    >
                      {eventList.map(v => (
                        <Select.Option key={v.event_name} value={v.event_name}>
                          {v.event_name} {v.event_name_zh}
                        </Select.Option>
                      ))}
                    </Select> : <Input />,
                )}
              </Form.Item>
            </Col>
            <Button onClick={() => this.addKey(step.index, index)} icon="plus-circle" type="primary">
              添加参数
            </Button>
            {index ? (
              <Icon
                type="close-circle"
                style={{ fontSize: 20, marginLeft: 10, cursor: 'pointer' }}
                onClick={() => this.remove(step.index, index)}
              />
            ) : (
              ''
            )}
          </Row>

          {step.keys.map((key, j) => (
            <Row id={`${key}-row-key`}>
              <Col span={6}>
                <Form.Item>
                  {getFieldDecorator(`event-key-${step.index}-${key}`)(
                    <Select
                      placeholder="参数"
                      showSearch
                      onFocus={() => this.handleClick(step.index)}
                      onSearch={this.handleKeySearch}
                      filterOption={false}
                    >
                      {eventKeyList.map(v => (
                        <Select.Option key={v.key_name} value={v.key_name}>
                          {v.key_name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={6} offset={1}>
                <Form.Item>
                  {getFieldDecorator(`event-operator-${step.index}-${key}`, {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: '=',
                  })(<Select>{numberOptions}</Select>)}
                </Form.Item>
              </Col>
              <Col span={6} offset={1}>
                <Form.Item>
                  {getFieldDecorator(`event-value-${step.index}-${key}`)(
                    <Select
                      placeholder="参数值"
                      showSearch
                      mode="tags"
                      onFocus={() => this.handleValueFocus(step.index, key)}
                      filterOption={(inputValue, option) => option.key.toUpperCase().includes(inputValue.toUpperCase())}
                    >
                      {eventValueList.map(v => (
                        <Select.Option key={v.param_value} value={v.param_value}>
                          {v.param_value}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Icon
                type="close-circle"
                style={{
                  fontSize: 20,
                  marginLeft: 10,
                  cursor: 'pointer',
                  lineHeight: '42px',
                }}
                onClick={() => this.removeKey(step.index, key, index, j)}
              />
            </Row>
          ))}
        </Col>
      </Row>
    ));
  };

  // 校验每个事件参数是否有设备值,考虑Android和iOS
  // 相应参数值设备数不为0，则校验通过
  checkValue=async () => {
    const { steps } = this.state;
    const { form, productName, keyDatabase } = this.props;
    const eventName = [];
    let eventKeys = [];
    form.validateFields(async (err, values) => {
      // console.log(values);
      if (err) return;

      for (const i of steps) {
        eventName.push(values[`event-${i.index}`]);
        const arr = {
          event: values[`event-${i.index}`],
          key: [],
        };
        for (const j of i.keys) {
          if (values[`event-key-${i.index}-${j}`]) {
            arr.key.push({
              key: values[`event-key-${i.index}-${j}`],
              operator: values[`event-operator-${i.index}-${j}`],
              value: values[`event-value-${i.index}-${j}`] || [],
            });
          }
        }
        eventKeys.push(arr);
      }
      const date = moment()
        .subtract(1, 'days')
        .format('YYYYMMDD');

      const sqlArr = [];
      eventKeys.map((i) => {
        i.key.map((j) => {
          let paramValueStr = '';
          j.value.map((k, index) => {
            if (index === 0) {
              paramValueStr = `'${k}'`;
            } else {
              paramValueStr = `${paramValueStr},'${k}'`;
            }
          });
          const database = keyDatabase || `holo_${this.props.product}_log_event_key_count`;
          const sql = `
          SELECT 
          param_value,
          event_name,
          key_name,
          SUM(duid_total) AS duid_total,
          ${productName}
          FROM ${database}
          where event_name= '${i.event}'
          and key_name= '${j.key}' 
          and ds = '${date}' 
          and param_value in (${paramValueStr})
          and param_value IS NOT NULL
          group by event_name,key_name, param_value,${productName}
          order by event_name,key_name, param_value desc
           `;
          sqlArr.push(sql);
        });
      });


      let resultList = [];
      const promiseList = [];
      sqlArr.map((sql) => {
        promiseList.push(getHoloData(sql));
      });
      await Promise.all(promiseList).then((res) => {
        resultList = res.flat();
      });
      console.log('resultList___________________-');
      console.log(resultList);

      eventKeys = eventKeys.map((i) => {
        i.key = i.key.map((j) => {
          // android平台
          if (resultList.find(r => r.key_name === j.key && i.event === r.event_name && r.duid_total && r[productName] === '1')) {
            j.pass = 1;
            j.android = 1;
            j.ios = 0;
          } else if (resultList.find(r => r.key_name === j.key && i.event === r.event_name && r.duid_total && r[productName] === '2')) {
            // iOS平台
            j.pass = 1;
            j.android = 0;
            j.ios = 1;
          } else {
            j.pass = 0;
            j.android = 0;
            j.ios = 0;
          }
          j.event = j.key;

          return j;
        });
        i.children = i.key;
        return i;
      });
      this.setState({ checkResult: eventKeys, checkModal: true });
      console.log('eventKeyseventKeyseventKeyseventKeyseventKeyseventKeys');
      console.log(eventKeys);
    });
  }

  render() {
    const {
      visible, modalType, loading, checkModal, checkResult,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          visible={visible}
          onCancel={() => {
            this.setState({ visible: false });
            this.props.submitOk(false);
          }}
          onOk={this.submit}
          footer={[
            <Button
              style={{ float: 'left' }}
              key="calibrate"
              onClick={this.checkValue}
            >
            校验
            </Button>,
            <Button
              key="back"
              onClick={() => {
                this.setState({ visible: false });
                this.props.submitOk(false);
              }}
            >
            取消
            </Button>,
            modalType === 'edit' ? (
              <Button
                type="again"
                onClick={() => this.setState(
                  {
                    modalType: 'add',
                  },
                  this.submit,
                )
                }
              >
              另存为新漏斗
              </Button>
            ) : (
              ''
            ),
            <Button key="submit" type="primary" loading={loading} onClick={this.submit}>
            提交
            </Button>,
          ]}
          title={modalType === 'edit' ? '编辑' : '新增'}
          width={950}
        >
          <Spin spinning={loading}>
            <Form>
              <Form.Item label="漏斗名称" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请选择' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="漏斗标签" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('tag')(<Input />)}
              </Form.Item>
              <Form.Item label="漏斗步骤" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                <Button icon="plus-circle" onClick={this.addEvent} type="primary">
                添加步骤
                </Button>
              </Form.Item>
              {this.formItems()}
            </Form>
          </Spin>
        </Modal>
        <Modal
          visible={checkModal}
          onCancel={() => {
            this.setState({ checkModal: false });
          }}
          onOk={() => {
            this.setState({ checkModal: false });
          }}
          footer={null}
        >
          {checkResult.map(i => (
            <div key={i.event} style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 'bold' }}>事件：{i.event}</div>
              <div>
                {i.key.map(j => (
                  <div className={style['event-param']} key={j.key} >
                    <span className={style['title-cell']}>{j.key}</span>
                    <span className={style['other-cell']} >Android{j.android ? <Icon type="check" /> : <Icon type="close" />}</span>
                    <span className={style['other-cell']}>iOS{j.ios ? <Icon type="check" /> : <Icon type="close" />}</span>
                    <span className={style['other-cell']} style={j.pass ? { color: 'green' } : { color: 'red' }}>{j.pass ? '校验通过' : '校验失败'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Modal>
      </div>
    );
  }
}
export default Form.create()(InsertOrUpdateView);

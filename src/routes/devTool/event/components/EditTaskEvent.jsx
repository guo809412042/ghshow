import React from 'react';
import {
  Modal, Button, Form, Select, Input, Icon, Tag, message, Checkbox,
} from 'antd';

import {
  productList,
  platformList,
  // IDpageDict,
  // IDmoduleDict,
  // IDcontrolDict,
  // IDactionDict,
  // IDpageList,
  // IDmoduleList,
  // IDcontrolList,
  // IDactionList,
  eventTypeList,
} from '../const';
import { addEvent, eventManage, updataEvent } from '../service';

import styles from '../style.less';

const FormItem = Form.Item;
const Option = Select.Option;
let uuid = 0;
class EditTaskEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      lastestEventList: [],
      innerRecord: {},
    };
  }

  showModal = async () => {
    if (this.props.inTable) {
      this.setState({
        innerRecord: this.props.record,
      });
    }
    this.setState({ visible: true }, this.init);

    eventManage({
      collection: 'all',
      product: `${this.props.taskInfo.product_id}`,
    }).then((res) => {
      if (res.code === 20000) {
        this.setState({
          lastestEventList: this.getLastestEventList(res.data),
        });
      }
    });
  };

  hideModal = () => {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({
      keys: [],
    });
    uuid = 0;
    this.setState({ visible: false, innerRecord: {} });
  };

  submit = async () => {
    const {
      taskInfo,
      inTable,
      record,
      form: { validateFields },
      reFresh,
    } = this.props;
    validateFields(async (err, values) => {
      if (err) {
        return false;
      }
      // if (
      //   (values.android_dev && values.android_dev.length > 1)
      //   || (values.ios_dev && values.ios_dev.length > 1)
      // ) {
      //   message.warning('安卓和ios负责人各自只能选一个');
      //   return false;
      // }
      const {
        event_id,
        event_name,
        product,
        platform,
        version,
        tag,
        remark_desc,
        android_dev,
        ios_dev,
        business_module,
      } = values;
      //  组装事件参数(事件参数用-连接的)
      const eventDict = {};
      for (const key in values) {
        if (key.includes('-')) {
          const [, objKey, index] = key.split('-');
          if (eventDict[index]) {
            eventDict[index][objKey] = values[key];
          } else {
            eventDict[index] = {
              [objKey]: values[key],
            };
          }
        }
      }
      const createParam = {
        // id: record.id,
        event_id,
        event_name,
        product,
        platform,
        version: version[0],
        tag,
        remark_desc,
        android_dev,
        ios_dev,
        eventParams: Object.values(eventDict),
        data_type: 1, // 修改类型
        business_module,
        task_id: taskInfo.id,
      };

      let res;

      if (inTable) {
        createParam.id = record.id;
        createParam.data_type = taskInfo.data_type; // 保持原始的事件添加类型
        res = await updataEvent(createParam);
      } else {
        res = await addEvent(createParam);
      }

      if (res.code === 20000) {
        message.success('修改成功');
        this.hideModal();
        reFresh && reFresh();
      } else {
        message.error(res.msg || '操作失败,请重试！');
      }
    });
  };

  init = () => {
    const {
      innerRecord: { extend },
    } = this.state;
    const { form } = this.props;

    // 初始化
    form.setFieldsValue({
      keys: [],
    });
    uuid = 0;

    const defaultEventKeyList = extend ? JSON.parse(extend) : [];
    defaultEventKeyList.map(() => {
      this.add();
    });
  };

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  changeEvent = (e) => {
    const { lastestEventList } = this.state;
    let tmp = {};
    lastestEventList.forEach((item) => {
      if (item.event_id === e) {
        tmp = item;
      }
    });

    this.setState(
      {
        innerRecord: tmp,
      },
      this.init,
    );
  };

  getLastestEventList = (listData) => {
    const lastestEventList = [];
    const map = new Map();

    listData.forEach((item) => {
      map.set(item.event_id, item);
    });

    map.forEach((item) => {
      lastestEventList.push(item);
    });

    return lastestEventList;
  };

  render() {
    const { visible, innerRecord, lastestEventList } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      inTable,
      listType,
      taskInfo,
      formFields,
      appVersionList,
      tagList,
    } = this.props;

    const modalProps = {
      title: '编辑事件',
      visible,
      onOk: this.submit,
      onCancel: this.hideModal,
      width: '1000px',
    };
    const defaultEventKeyList = innerRecord.extend ? JSON.parse(innerRecord.extend) : [];

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map(k => (
      <div>
        <FormItem label={`事件参数${k}`}>
          {getFieldDecorator(`event-key-${k}`, {
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].key : '',
            rules: [{ required: true, message: '必填' }],
          })(<Input placeholder="参数key" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator(`event-type-${k}`, {
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].type : '',
            rules: [{ required: true, message: '必填' }],
          })(
            <Select placeholder="事件类型">
              {eventTypeList.map(item => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator(`event-remark-${k}`, {
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].remark : '',
          })(<Input placeholder="参数说明" />)}
        </FormItem>
        <FormItem style={{ width: 50 }}>
          {getFieldDecorator(`event-required-${k}`, {
            valuePropName: 'checked',
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].required : true,
          })(<Checkbox placeholder="是否必传" />)}
        </FormItem>
        <Icon className={styles.removeIcon} type="minus-circle-o" onClick={() => this.remove(k)} />
      </div>
    ));
    return (
      <>
        <Button onClick={this.showModal} type="primary" size={inTable ? 'small' : 'default'}>
          {this.props.title || '编辑'}
        </Button>
        <Modal {...modalProps}>
          <Form layout="inline" className={styles.eventAdd}>
            <div className={styles.remarkDesc}>
              <FormItem label="事件ID" style={{ width: '100%' }}>
                {getFieldDecorator('event_id', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue: innerRecord?.event_id,
                })(
                  listType === 'insert' ? (
                    <Input placeholder="请输入事件id" />
                  ) : (
                    <Select
                      placeholder="请选择事件id"
                      disabled={inTable}
                      allowClear
                      optionFilterProp="children"
                      showSearch
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={this.changeEvent}
                    >
                      {lastestEventList.map(item => (
                        <Select.Option value={item.event_id} key={item.id}>
                          {item.event_id}
                        </Select.Option>
                      ))}
                    </Select>
                  ),
                )}
              </FormItem>
            </div>

            <div style={{ display: 'none' }}>
              {/* <FormItem label="事件ID-组装起来的id">
                {getFieldDecorator('event_id', {
                  initialValue: innerRecord.event_id
                })(<Input />)}
              </FormItem> */}
              <FormItem label="安卓负责人">
                {getFieldDecorator('android_dev', {
                  initialValue: innerRecord.android_dev,
                })(<Input />)}
              </FormItem>
              <FormItem label="ios负责人">
                {getFieldDecorator('ios_dev', {
                  initialValue: innerRecord.ios_dev,
                })(<Input />)}
              </FormItem>
            </div>
            <div>
              <FormItem label="事件名称">
                {getFieldDecorator('event_name', {
                  initialValue: innerRecord.event_name,
                  rules: [{ required: true, message: '必填' }],
                })(<Input disabled={inTable && listType === 'modify'} style={{ width: 740 }} />)}
              </FormItem>
            </div>
            <div className={styles.eventParamsBorder}>
              {formItems}
              <Tag color="orange" onClick={this.add} className={styles.addParamBtn}>
                <Icon type="plus" /> 添加参数
              </Tag>
            </div>
            <div>
              <FormItem label="应用名称" style={{ display: 'none' }}>
                {getFieldDecorator('product', {
                  initialValue: formFields.product,
                })(
                  <Select disabled>
                    {productList.map(item => (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="所属平台">
                {getFieldDecorator('platform', {
                  initialValue: innerRecord.platform,
                  rules: [{ required: true, message: '必填' }],
                })(
                  <Select disabled>
                    {platformList.map(item => (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="版本">
                {getFieldDecorator('version', {
                  initialValue: [taskInfo.version],
                  rules: [{ required: true, message: '必填' }],
                })(
                  <Select mode="tags" showSearch disabled>
                    {appVersionList.map(item => (
                      <Option disabled={getFieldValue('version') > 0} value={item.value} key={item.value}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="业务标签">
                {getFieldDecorator('tag', {
                  initialValue: innerRecord.tag,
                })(
                  <Select>
                    {tagList.map(item => (
                      <Option value={item.tag} key={item.tag}>
                        {item.tag}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="业务模块">
                {getFieldDecorator('business_module', { initialValue: innerRecord.business_module })(<Input />)}
              </FormItem>
            </div>
            <div className={styles.remarkDesc}>
              <FormItem label="触发条件">
                {getFieldDecorator('remark_desc', {
                  initialValue: innerRecord.remark_desc,
                })(<Input.TextArea rows={3} />)}
              </FormItem>
            </div>
          </Form>
        </Modal>
      </>
    );
  }
}
export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {},
})(EditTaskEvent);

import React from 'react';
import { Modal, Button, Form, Select, Input, Icon, Tag, message, Checkbox } from 'antd';

import { productList, platformList, eventTypeList } from '../const';
import { addEvent } from '../service';

const defaultEventKeyList = [];

import styles from '../style.less';

const FormItem = Form.Item;
const Option = Select.Option;
let uuid = 0;
class AddTaskEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  showModal = async () => {
    this.setState({ visible: true }, this.init);
  };

  hideModal = () => {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({
      keys: []
    });
    uuid = 0;
    this.setState({ visible: false });
  };

  submit = async () => {
    const {
      form: { validateFields },
      taskInfo,
      reFresh
    } = this.props;
    validateFields(async (err, values) => {
      if (err) {
        return false;
      }
      if ((values.android_dev && values.android_dev.length > 1) || (values.ios_dev && values.ios_dev.length > 1)) {
        message.warning('安卓和ios负责人各自只能选一个');
        return false;
      }
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
        business_module
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
              [objKey]: values[key]
            };
          }
        }
      }
      for (let index = 0; index < version.length; index++) {
        const element = version[index];
        const createParam = {
          event_id,
          event_name,
          product,
          platform,
          version: element,
          tag,
          remark_desc,
          android_dev: android_dev ? android_dev[0] : '',
          ios_dev: ios_dev ? ios_dev[0] : '',
          eventParams: Object.values(eventDict),
          business_module,
          task_id: taskInfo.id
        };
        if (createParam.ios_dev === '' && createParam.android_dev === '') {
          message.error('请填写负责人');
        }
        console.log(JSON.stringify(createParam));
        const res = await addEvent(createParam);
        if (res.code === 20000) {
          message.success('添加成功');
          this.hideModal();
          reFresh && reFresh();
        } else {
          message.error(res.msg || '操作失败,请重试！');
        }
      }
    });
  };

  init = () => {
    // const { form } = this.props;
    defaultEventKeyList.map(() => {
      this.add();
    });

    // setTimeout(() => {
    //   defaultEventKeyList.map((eventKey, index) => {
    //     form.setFieldsValue({
    //       [`eventKey-${index}`]: eventKey,
    //     });
    //   });
    // }, 0);
  };

  remove = k => {
    console.log('k', k);
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
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
      keys: nextKeys
    });
  };

  render() {
    const { visible } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      taskInfo,
      formFields,
      appVersionList,
      tagList,
      androidDevList,
      iosDevList,
      IDpageList,
      IDmoduleList,
      IDcontrolList,
      IDactionList,
      payloadList,
      objectList,
      actionList
    } = this.props;

    console.log(IDpageList, IDmoduleList, IDactionList);

    const modalProps = {
      title: '创建事件',
      visible,
      onOk: this.submit,
      onCancel: this.hideModal,
      width: '1000px'
    };

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map(k => (
      <div>
        <FormItem label={`事件参数${k}`}>
          {getFieldDecorator(`event-key-${k}`, {
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].key : '',
            rules: [{ required: true, message: '必填' }]
          })(<Input placeholder="参数key" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator(`event-type-${k}`, {
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].type : '',
            rules: [{ required: true, message: '必填' }]
          })(
            <Select placeholder="事件类型">
              {eventTypeList.map(item => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator(`event-remark-${k}`, {
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].remark : ''
          })(<Input placeholder="参数说明" />)}
        </FormItem>
        <FormItem style={{ width: 50 }}>
          {getFieldDecorator(`event-required-${k}`, {
            valuePropName: 'checked',
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].required : true
          })(<Checkbox placeholder="是否必传" />)}
        </FormItem>
        <Icon className={styles.removeIcon} type="minus-circle-o" onClick={() => this.remove(k)} />
      </div>
    ));
    return (
      <div>
        <Button onClick={this.showModal} type="primary">
          创建事件
        </Button>
        <Modal {...modalProps}>
          <Form layout="inline" className={styles.eventAdd}>
            <div style={{ display: 'none' }}>
              <FormItem label="安卓负责人">
                {getFieldDecorator('android_dev', { initialValue: [taskInfo.android_email] })(<Input disabled />)}
              </FormItem>
              <FormItem label="ios负责人">
                {getFieldDecorator('ios_dev', { initialValue: [taskInfo.ios_email] })(<Input disabled />)}
              </FormItem>
            </div>
            <div>
              <FormItem label="事件ID">
                {getFieldDecorator('idPayload', {
                  rules: [{ required: true, message: '必填' }]
                })(
                  <Select
                    placeholder="请选择载体"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {payloadList.map(item => (
                      <Option value={item.key} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('idPosition', {
                  rules: [
                    {
                      pattern: /^[^\u4e00-\u9fa5]+$/,
                      message: '不允许使用中文'
                    }
                  ]
                })(<Input placeholder="页面位置（非必要）" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('idObject', {
                  rules: [{ required: true, message: '必填' }]
                })(
                  <Select
                    placeholder="请选择对象"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {objectList.map(item => (
                      <Option value={item.key} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('idAction', {
                  rules: [{ required: true, message: '必填' }]
                })(
                  <Select
                    placeholder="请选择行为"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {actionList.map(item => (
                      <Option value={item.key} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('idControlValue', {
                  rules: [
                    {
                      pattern: /^[^\u4e00-\u9fa5]+$/,
                      message: '不允许使用中文'
                    }
                  ]
                })(<Input placeholder="补充信息（非必要）【原控件】" />)}
              </FormItem>
            </div>
            <div>
              <FormItem label="事件名称">
                {getFieldDecorator('event_name', {
                  rules: [{ required: true, message: '必填' }]
                })(<Input style={{ width: '740px' }} />)}
              </FormItem>
            </div>
            <div>
              <FormItem label="事件ID">
                {getFieldDecorator('event_id', { rules: [{ required: true, message: '必填' }] })(
                  <Input disabled style={{ width: '740px' }} />
                )}
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
                  initialValue: formFields.product
                })(
                  <Select disabled>
                    {productList.map(item => (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="所属平台">
                {getFieldDecorator('platform', {
                  initialValue: platformList[taskInfo.platform].value,
                  rules: [{ required: true, message: '必填' }]
                })(
                  <Select disabled>
                    {platformList.map(item => (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="版本">
                {getFieldDecorator('version', {
                  initialValue: [taskInfo.version],
                  rules: [{ required: true, message: '必填' }]
                })(
                  <Select mode="tags" showSearch disabled>
                    {appVersionList.map(item => (
                      <Option disabled={getFieldValue('version') > 0} value={item.value} key={item.value}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="业务标签">
                {getFieldDecorator(
                  'tag',
                  {}
                )(
                  <Select>
                    {tagList.map(item => (
                      <Option value={item.tag} key={item.tag}>
                        {item.tag}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="业务模块">{getFieldDecorator('business_module', {})(<Input />)}</FormItem>
            </div>
            <div className={styles.remarkDesc}>
              <FormItem label="触发条件">
                {getFieldDecorator('remark_desc', { rules: [{ required: true, message: '必填' }] })(
                  <Input.TextArea rows={3} />
                )}
              </FormItem>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    const {
      form: { setFieldsValue },
      payloadList,
      objectList,
      actionList
    } = props;
    const { idPayload, idPosition, idObject, idAction, idControlValue } = allValues;
    //  监听事件ID
    if (
      changedValues.idPayload ||
      changedValues.idPosition !== undefined ||
      changedValues.idObject ||
      changedValues.idAction ||
      changedValues.idControlValue !== undefined
    ) {
      const eventIdParams = [];
      const eventNameParams = [];
      if (idPayload) {
        eventIdParams.push(idPayload);
        eventNameParams.push(payloadList.filter(item => item.key == idPayload)[0].name);
      }
      if (idPosition) {
        eventIdParams.push(idPosition);
        eventNameParams.push(idPosition);
      }
      if (idObject) {
        eventIdParams.push(idObject);
        eventNameParams.push(objectList.filter(item => item.key == idObject)[0].name);
      }
      if (idAction) {
        eventIdParams.push(idAction);
        eventNameParams.push(actionList.filter(item => item.key == idAction)[0].name);
      }
      if (idControlValue) {
        eventIdParams.push(idControlValue);
        eventNameParams.push(idControlValue);
      }

      const eventName = eventNameParams
        .join('_')
        .replace(/_undefined/g, '')
        .replace(/_null/g, '')
        .replace(/undefined_/g, '')
        .replace(/undefined/g, '')
        .replace(/_defaultKey/g, '')
        .replace(/defaultKey_/g, '')
        .replace(/defaultKey/g, '');
      const eventId = eventIdParams
        .join('_')
        .replace(/_undefined/g, '')
        .replace(/_null/g, '')
        .replace(/undefined_/g, '')
        .replace(/undefined/g, '')
        .replace(/_defaultKey/g, '')
        .replace(/defaultKey_/g, '')
        .replace(/defaultKey/g, '');
      setFieldsValue({
        [`event_name`]: eventName,
        [`event_id`]: eventId
      });
    }
  }
})(AddTaskEvent);

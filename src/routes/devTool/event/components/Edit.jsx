/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable quotes */
/* eslint-disable arrow-parens */
/* eslint-disable camelcase */
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
import { addEvent } from '../service';

import styles from '../style.less';


const FormItem = Form.Item;
const Option = Select.Option;
let uuid = 0;
class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

showModal = async () => {
  this.setState({ visible: true }, this.init);
}

hideModal = () => {
  const { form } = this.props;
  form.setFieldsValue({
    keys: [],
  });
  uuid = 0;
  this.setState({ visible: false });
}

submit = async () => {
  const {
    // record,
    form: {
      validateFields,
    },
    reFresh,
    record,
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
      data_type: record.data_type || 0,
    };
    const res = await addEvent(createParam);
    if (res.code === 20000) {
      message.success('修改成功');
      this.hideModal();
      reFresh && reFresh();
    } else {
      message.error(res.msg || '操作失败,请重试！');
    }
  });
}

init = () => {
  const {
    record: {
      extend,
    },
  } = this.props;
  const defaultEventKeyList = extend ? JSON.parse(extend) : [];
  defaultEventKeyList.map(() => {
    this.add();
  });
}

remove = k => {
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

render() {
  const {
    visible,
  } = this.state;
  const {
    form: {
      getFieldDecorator,
      getFieldValue,
    },
    record,
    // record: {
    //   event_params: defaultEventKeyList,
    // },
    formFields,
    appVersionList,
    tagList,
    IDpageDict,
    IDpageList,
    IDmoduleDict,
    IDmoduleList,
    IDcontrolDict,
    IDcontrolList,
    IDactionDict,
    IDactionList,
    // androidDevList,
    // iosDevList,
  } = this.props;
  const modalProps = {
    title: '编辑事件',
    visible,
    onOk: this.submit,
    onCancel: this.hideModal,
    width: '800px',
  };
  const defaultEventKeyList = record.extend ? JSON.parse(record.extend) : [];
  const [defaultIdPage, defaultIdModule, defaultIdControlValue, defaultIdAction] = record.event_id ? record.event_id.split('_') : [];
  const defaultEventName = `${IDpageDict[defaultIdPage]}_${IDmoduleDict[defaultIdModule]}_${IDcontrolDict[defaultIdControlValue] || defaultIdControlValue}_${IDactionDict[defaultIdAction]}`;

  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');
  const formItems = keys.map((k) => (
    <div>
      <FormItem label={`事件参数${k}`}>
        {getFieldDecorator(`event-key-${k}`, {
          initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].key : '',
          rules: [{ required: true, message: '必填' }],
        })(<Input placeholder="参数key"/>)}
      </FormItem>
      <FormItem>
        {
          getFieldDecorator(`event-type-${k}`, {
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].type : '',
            rules: [{ required: true, message: '必填' }],
          })(
            <Select placeholder="事件类型">
              {
                eventTypeList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
              }
            </Select>,
          )
        }
      </FormItem>
      <FormItem>
        {
          getFieldDecorator(`event-remark-${k}`, {
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].remark : '',
          })(<Input placeholder="参数说明"/>)
        }
      </FormItem>
      <FormItem style={{ width: 50 }}>
        {
          getFieldDecorator(`event-required-${k}`, {
            valuePropName: 'checked',
            initialValue: k < defaultEventKeyList.length ? defaultEventKeyList[k].required : true,
          })(<Checkbox placeholder="是否必传"/>)
        }
      </FormItem>
      <Icon
        className={styles.removeIcon}
        type="minus-circle-o"
        onClick={() => this.remove(k)}
      />
    </div>
  ));
  return (
    <div style={{ marginRight: 10, display: 'inline-block' }}>
      <Button onClick={this.showModal} size="small">{this.props.title || '编辑'}</Button>
      <Modal {...modalProps}>
        <Form layout="inline" className={styles.eventAdd}>
          <div style={{ display: 'none' }}>
            <FormItem label="事件ID-组装起来的id" >
              {
                getFieldDecorator('event_id', {
                  initialValue: record.event_id,
                })(<Input />)
              }
            </FormItem>
            <FormItem label="安卓负责人" >
              {
                getFieldDecorator('android_dev', {
                  initialValue: record.android_dev,
                })(<Input />)
              }
            </FormItem>
            <FormItem label="ios负责人" >
              {
                getFieldDecorator('ios_dev', {
                  initialValue: record.ios_dev,
                })(<Input />)
              }
            </FormItem>
          </div>
          <div>
            <FormItem label="事件ID">
              {
                getFieldDecorator('idPage', {
                  initialValue: defaultIdPage,
                  rules: [{ required: true, message: '必填' }],
                })(
                  <Select placeholder="请选择页面">
                    {
                      IDpageList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                    }
                  </Select>,
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('idModule', {
                  initialValue: defaultIdModule,
                  rules: [{ required: true, message: '必填' }],
                })(
                  <Select placeholder="请选择模块">
                    {
                      IDmoduleList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                    }
                  </Select>,
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('idControlValue', {
                  initialValue: defaultIdControlValue,
                  rules: [
                    { required: true, message: '必填' },
                  ],
                })(
                  <Select
                    mode="tags"
                    placeholder="请选择控件"
                  >
                    {
                      IDcontrolList.map(item => <Option
                        value={item.value}
                        key={item.value}
                        disabled={getFieldValue('idControlValue') && getFieldValue('idControlValue')[0] && item.value !== getFieldValue('idControlValue')[0]}>{item.label}</Option>)
                    }
                  </Select>,
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('idAction', {
                  initialValue: defaultIdAction,
                  rules: [{ required: true, message: '必填' }],
                })(
                  <Select placeholder="请选择行为">
                    {
                      IDactionList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                    }
                  </Select>,
                )
              }
            </FormItem>
          </div>
          <div>
            <FormItem label="事件名称">
              {
                getFieldDecorator('event_name', {
                  initialValue: defaultEventName,
                  rules: [{ required: true, message: '必填' }],
                })(<Input style={{ width: '588px' }} />)
              }
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
              {
                getFieldDecorator('product', {
                  initialValue: formFields.product,
                })(
                  <Select disabled>
                    {
                      productList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                    }
                  </Select>,
                )
              }
            </FormItem>
            <FormItem label="所属平台">
              {
                getFieldDecorator('platform', {
                  initialValue: record.platform,
                  rules: [{ required: true, message: '必填' }],
                })(
                  <Select>
                    {
                      platformList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                    }
                  </Select>,
                )
              }
            </FormItem>
            <FormItem label="版本">
              {
                getFieldDecorator('version', {
                  initialValue: [record.version],
                  rules: [{ required: true, message: '必填' }],
                })(
                  <Select mode="tags" showSearch>
                    {
                      appVersionList.map(item => <Option disabled={getFieldValue('version') > 0} value={item.value} key={item.value}>{item.value}</Option>)
                    }
                  </Select>,
                )
              }
            </FormItem>
            <FormItem label="业务标签">
              {
                getFieldDecorator('tag', {
                  initialValue: record.tag,
                })(
                  <Select>
                    {
                      tagList.map(item => <Option value={item.tag} key={item.tag}>{item.tag}</Option>)
                    }
                  </Select>,
                )
              }
            </FormItem>
          </div>
          <div className={styles.remarkDesc}>
            <FormItem label="业务描述">
              {
                getFieldDecorator('remark_desc', {
                  initialValue: record.remark_desc,
                })(<Input.TextArea rows={3}/>)
              }
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
      form: {
        setFieldsValue,
      },
      IDpageDict,
      IDmoduleDict,
      IDcontrolDict,
      IDactionDict,
    } = props;
    const {
      idPage, idModule, idControlValue, idAction,
    } = allValues;
    //  监听事件ID
    if (
      changedValues.idPage
      || changedValues.idModule
      || changedValues.idControlValue
      || changedValues.idAction
    ) {
      const idControl = idControlValue && idControlValue[0] ? idControlValue[0] : null;
      const eventName = `${IDpageDict[idPage]}_${IDmoduleDict[idModule]}_${IDcontrolDict[idControl] || idControl}_${IDactionDict[idAction]}`;
      setFieldsValue({
        [`event_name`]: eventName,
        [`event_id`]: `${idPage}_${idModule}_${idControl}_${idAction}`,
      });
    }
  },
})(Edit);

import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Switch } from 'antd';
import { eventManage, getProductListValid } from '../services';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

const comStyle = {
  width: 300
};

const TYPES = [
  {
    value: 1,
    text: '载体'
  },
  {
    value: 2,
    text: '对象'
  },
  {
    value: 3,
    text: '行为'
  }
];

export default Form.create()(({ form, values = {}, visible, changeModalvisible }) => {
  const [query, setQuery] = useState({
    product: undefined,
    platform: undefined
  });
  const [product, setProduct] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [event, setEvent] = useState([]);
  const [productObj, setProductObj] = useState({});

  useEffect(() => {
    getProductListValid().then(res => {
      console.log(res);
      if (res.code === 20000) {
        const obj = {};
        res.data.forEach(item => {
          obj[item.product_id] = item.product_name;
        });

        setProductObj(obj);
      }
    });

    eventManage().then(res => {
      if (res.code === 20000) {
        const eventMap = new Map();
        res.data.reverse().forEach(item => {
          eventMap.set(item.event_id, item);
        });

        const platformSet = new Set();
        const productSet = new Set();

        [...eventMap.values()].forEach(item => {
          platformSet.add(item.platform);
          productSet.add(item.product);
        });

        setProduct([...productSet]);
        setPlatform([...platformSet]);
        setEvent([...eventMap.values()]);
      }
    });
  }, []);
  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      console.log({
        ...values,
        ...event.filter(
          item =>
            item.event_id === fieldsValue.event_id &&
            item.platform === fieldsValue.platform &&
            item.product === fieldsValue.product
        )[0],
        is_alarm: Number(fieldsValue.is_alarm),
        alarm_level: Number(fieldsValue.alarm_level)
      });

      // return;

      changeModalvisible(false, {
        ...values,
        ...event.filter(
          item =>
            item.event_id === fieldsValue.event_id &&
            item.platform === fieldsValue.platform &&
            item.product === fieldsValue.product
        )[0],
        is_alarm: Number(fieldsValue.is_alarm),
        alarm_level: Number(fieldsValue.alarm_level)
      });
    });
  };

  const renderContent = () => [
    <FormItem key="product" {...formLayout} label="所属产品">
      {form.getFieldDecorator('product', {
        initialValue: values.product,
        rules: [
          {
            required: true,
            message: '请选择产品'
          }
        ]
      })(
        <Select
          placeholder="请选择产品"
          style={comStyle}
          onChange={e => {
            form.setFieldsValue({
              event_id: undefined
            });
            setQuery(q => ({ ...q, product: e }));
          }}
        >
          {product.map(t => (
            <Select.Option value={t} key={t}>
              {productObj[t] || t}
            </Select.Option>
          ))}
        </Select>
      )}
    </FormItem>,
    <FormItem key="platform" {...formLayout} label="所属平台">
      {form.getFieldDecorator('platform', {
        initialValue: values.platform,
        rules: [
          {
            required: true,
            message: '请选择平台'
          }
        ]
      })(
        <Select
          placeholder="请选择平台"
          style={comStyle}
          onChange={e => {
            form.setFieldsValue({
              event_id: undefined
            });
            setQuery(q => ({ ...q, platform: e }));
          }}
        >
          {platform.map(p => (
            <Select.Option value={p} key={p}>
              {p}
            </Select.Option>
          ))}
        </Select>
      )}
    </FormItem>,
    <FormItem key="event_id" {...formLayout} label="事件ID">
      {form.getFieldDecorator('event_id', {
        initialValue: values.event_id,
        rules: [
          {
            required: true,
            message: '请选择平台'
          }
        ]
      })(
        <Select placeholder="请选择事件ID" style={comStyle}>
          {event
            .filter(item => {
              if (query.product !== item.product || query.platform !== item.platform) {
                return false;
              }
              return true;
            })
            .map(t => (
              <Select.Option value={t.event_id} key={t.id}>
                {`${t.event_id} - ${t.event_name}`}
              </Select.Option>
            ))}
        </Select>
      )}
    </FormItem>,

    <FormItem key="is_alarm" {...formLayout} label="告警状态">
      {form.getFieldDecorator('is_alarm', {
        initialValue: values.is_alarm,
        valuePropName: 'checked'
      })(<Switch />)}
    </FormItem>,

    <FormItem key="alarm_level" {...formLayout} label="告警等级">
      {form.getFieldDecorator('alarm_level', {
        initialValue: values.alarm_level,
        rules: [
          {
            required: true,
            message: '请选择告警等级'
          }
        ]
      })(
        <Select placeholder="请选择告警等级" style={comStyle}>
          <Select.Option value="0">P0</Select.Option>
          <Select.Option value="1">P1</Select.Option>
          <Select.Option value="2">P2</Select.Option>
        </Select>
      )}
    </FormItem>
  ];

  return (
    <>
      <Modal
        width={500}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="告警信息"
        visible={visible}
        onCancel={() => changeModalvisible(false, null)}
        onOk={() => handleSubmit()}
      >
        {renderContent()}
      </Modal>
    </>
  );
});

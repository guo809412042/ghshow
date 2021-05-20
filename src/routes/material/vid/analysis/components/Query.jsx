/*
 * @Date: 2020-05-08 10:54:02
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-09-09 09:54:13
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React from 'react';
import moment from 'moment';
import {
  DatePicker, Collapse, Radio, Button, Select, Form, Input, message,
} from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

// function range(start, end) {
//   console.log(start, end);
//   const result = [];
//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }
//   return result;
// }

const Query = ({
  setQueryState, form, queryState, countryData,
}) => {
  const { productId } = queryState;

  console.log('product', productId);
  const {
    getFieldDecorator, validateFields, getFieldValue,
  } = form;
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (values.time && productId === '2') {
          if (values.time[1].valueOf() >= moment().add(-20, 'minute').valueOf()) {
            message.error('请选择20分钟前的时间');
          }
        }
        setQueryState({
          ...values,
          country: values.country === 'all' ? undefined : values.country,
          startTime: values.time ? values.time[0].valueOf() : undefined,
          endTime: values.time ? values.time[1].valueOf() : undefined,
          time: undefined,
          clearWatermark: values.clearWatermark !== '0' && productId === '2',
        });
      }
    });
  };

  const disabledDate = current => current && current > moment().endOf('day');

  return <Collapse defaultActiveKey={['1']}>
    <Collapse.Panel
      header="查询"
      key="1"
    >
      <Form layout="inline" onSubmit={handleSubmit}>
        <Form.Item label="Userid">
          {getFieldDecorator('userId', {
            initialValue: '',
          })(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="country">
          {getFieldDecorator('country', {
            initialValue: 'all',
          })(
            <Select style={{ width: 120 }}>
              <Option value="all">全部</Option>
              {countryData.map(item => <Option value={item.key}>{item.value}</Option>)}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Deviceid">
          {getFieldDecorator('deviceId', {
            initialValue: '',
          })(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Taskid">
          {getFieldDecorator('taskId', {
            initialValue: '',
          })(
            <Input />,
          )}
        </Form.Item>
        {
          (getFieldValue('clearWatermark') === '0' || productId !== '2') ? <Form.Item label="Template id">
            {getFieldDecorator('templateCode', {
              initialValue: '',
            })(
              <Input />,
            )}
          </Form.Item> : null
        }
        <Form.Item label="平台">
          {getFieldDecorator('platform', {
            initialValue: '0',
          })(
            <Radio.Group
            >
              <Radio.Button value="0" key="0">
                全部
              </Radio.Button>
              <Radio.Button value="1" key="1">
                Android
              </Radio.Button>
              <Radio.Button value="2" key="2">
                iOS
              </Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label="Task result">
          {getFieldDecorator('state', {
            initialValue: '1',
          })(
            <Select style={{ width: 120 }}>
              <Option value="1">成功</Option>
              <Option value="2">失败</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="日期排序方式">
          {getFieldDecorator('desc', {
            initialValue: 'true',
          })(
            <Select style={{ width: 120 }}>
              <Option value="true">日期倒序</Option>
              <Option value="false">日期正序</Option>
            </Select>,
          )}
        </Form.Item>
        {productId === '2' && <Form.Item label="去水印查询">
          {getFieldDecorator('clearWatermark', {
            initialValue: '0',
          })(
            <Select style={{ width: 120 }}>
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>,
          )}
        </Form.Item>}
        <Form.Item label="Time">
          {getFieldDecorator('time', {
          })(
            <RangePicker
              disabledDate={disabledDate}
              // disabledTime={disabledDateTime}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
      </Form>
    </Collapse.Panel>
  </Collapse>;
};

export default Form.create()(Query);

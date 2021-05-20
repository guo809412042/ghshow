import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

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
  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      changeModalvisible(false, { ...values, ...fieldsValue });
    });
  };

  const renderContent = () => [
    <FormItem key="type" {...formLayout} label="类型">
      {form.getFieldDecorator('type', {
        initialValue: values.type,
        rules: [
          {
            required: true,
            message: '请选择配置对象'
          }
        ]
      })(
        <Select placeholder="请选择配置对象" style={comStyle}>
          {TYPES.map(t => (
            <Select.Option value={t.value} key={t.value}>
              {t.text}
            </Select.Option>
          ))}
        </Select>
      )}
    </FormItem>,
    <FormItem key="key" {...formLayout} label="英文名称">
      {form.getFieldDecorator('key', {
        initialValue: values.key,
        rules: [
          {
            required: true,
            message: '请输入英文名称'
          }
        ]
      })(<Input placeholder="请输入英文名称" style={comStyle} />)}
    </FormItem>,
    <FormItem key="name" {...formLayout} label="中文名称">
      {form.getFieldDecorator('name', {
        initialValue: values.name,
        rules: [
          {
            required: true,
            message: '请输入中文名称'
          }
        ]
      })(<Input placeholder="请输入中文名称" style={comStyle} />)}
    </FormItem>
  ];

  return (
    <>
      <Modal
        width={500}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="配置信息"
        visible={visible}
        onCancel={() => changeModalvisible(false, null)}
        onOk={() => handleSubmit()}
      >
        {renderContent()}
      </Modal>
    </>
  );
});

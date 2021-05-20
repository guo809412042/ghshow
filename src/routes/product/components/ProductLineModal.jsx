import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Input, Select,
} from 'antd';
import { getEmployeeList } from '../services/index';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const comStyle = {
  width: 300,
};

export default Form.create()(({
  form, values = {}, visible, changeModalvisible,
}) => {
  const [employee, setEmployee] = useState([]);

  const getEmployee = async () => {
    const res = await getEmployeeList();

    if (res.code === 20000) {
      setEmployee(res.data);
    }
  };

  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      changeModalvisible(false, {
        ...values,
        ...fieldsValue,
      });
    });
  };

  const renderContent = () => [
    <FormItem key="name" {...formLayout} label="产品线名称">
      {form.getFieldDecorator('name', {
        initialValue: values.name,
        rules: [
          {
            required: true,
            message: '请输入产品线名称',
          },
        ],
      })(<Input placeholder="请输入产品线名称" style={comStyle} />)}
    </FormItem>,
    <FormItem key="owner_email" {...formLayout} label="产品线负责人（第一审批人）">
      {form.getFieldDecorator('owner_email', {
        initialValue: values.owner_email,
        rules: [
          {
            required: true,
            message: '请选择产品线负责人（第一审批人）',
          },
        ],
      })(
        <Select
          placeholder="请选择产品线负责人（第一审批人）"
          style={comStyle}
          optionFilterProp="children"
          showSearch
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {employee.map(em => (
            <Select.Option value={em.email} key={em.email}>
              {`${em.name}-${em.email}`}
            </Select.Option>
          ))}
        </Select>,
      )}
    </FormItem>,
    <FormItem key="reviewer_email" {...formLayout} label="数据组负责人（第二审批人）">
      {form.getFieldDecorator('reviewer_email', {
        initialValue: values.reviewer_email,
        rules: [
          {
            required: true,
            message: '请选择数据组负责人（第二审批人）',
          },
        ],
      })(
        <Select
          placeholder="请选择数据组负责人（第二审批人）"
          style={comStyle}
          optionFilterProp="children"
          showSearch
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {employee.map(em => (
            <Select.Option value={em.email} key={em.email}>
              {`${em.name}-${em.email}`}
            </Select.Option>
          ))}
        </Select>,
      )}
    </FormItem>,
  ];

  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <>
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="产品线配置"
        visible={visible}
        onCancel={() => changeModalvisible(false, null)}
        onOk={() => handleSubmit()}
      >
        {renderContent()}
      </Modal>
    </>
  );
});

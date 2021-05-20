import React, { useState, useEffect } from 'react';
import { Modal, Form, Select } from 'antd';
import { getEmployeeList } from '../services/index';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

const comStyle = {
  width: 300
};

export default Form.create()(({ form, values = {}, visible, changeModalvisible }) => {
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

      const item = employee.filter(i => i.email === fieldsValue.email)[0];

      changeModalvisible(false, {
        ...values,
        ...fieldsValue,
        ...item
      });
    });
  };

  const renderContent = () => [
    <FormItem key="email" {...formLayout} label="姓名">
      {form.getFieldDecorator('email', {
        initialValue: values.email,
        rules: [
          {
            required: true,
            message: '请选择员工'
          }
        ]
      })(
        <Select
          placeholder="请选择员工"
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
        </Select>
      )}
    </FormItem>,
    <FormItem key="job_type" {...formLayout} label="职责">
      {form.getFieldDecorator('job_type', {
        initialValue: values.job_type,
        rules: [
          {
            required: true,
            message: '请选择职责'
          }
        ]
      })(
        <Select placeholder="请选择职责" style={comStyle}>
          <Select.Option value={0} key={0}>
            埋点设计
          </Select.Option>
          <Select.Option value={1} key={1}>
            ios开发
          </Select.Option>
          <Select.Option value={2} key={2}>
            安卓开发
          </Select.Option>
          <Select.Option value={3} key={3}>
            测试
          </Select.Option>
        </Select>
      )}
    </FormItem>
  ];

  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <>
      <Modal
        width={450}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="新增人员"
        visible={visible}
        onCancel={() => changeModalvisible(false, null)}
        onOk={() => handleSubmit()}
      >
        {renderContent()}
      </Modal>
    </>
  );
});

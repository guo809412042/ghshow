import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Input, Select, InputNumber, Icon, Radio,
} from 'antd';
import { getProductLineList } from '../services/index';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const comStyle = {
  width: 250,
};

export default Form.create()(({
  form, values = {}, visible, changeModalvisible, ids = [],
}) => {
  const [productLine, setProductLine] = useState([]);

  const getProductLine = async () => {
    const res = await getProductLineList();

    if (res.code === 20000) {
      setProductLine(res.data);
    }
  };

  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // 有修改内容才提交
      let flag = false;
      for (const k in fieldsValue) {
        if (fieldsValue[k] !== values[k]) {
          flag = true;
          if (fieldsValue[k] === '') {
            fieldsValue[k] = '<Empty>'
          }
        }
      }
      if (flag) {
        changeModalvisible(false, {
          ...values,
          ...fieldsValue,
        });
      } else {
        changeModalvisible(false);
      }
    });
  };

  const handleProductLineChange = (value, e) => {
    form.setFieldsValue({
      product_line: e.props.children,
    });
  };

  const repeatProductId = (rule, value, callback) => {
    try {
      if (ids.includes(value)) {
        callback('id 重复，请重新输入');
      } else {
        callback();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderContent = () => [
    <FormItem key="product_line_id" {...formLayout} label="产品线">
      {form.getFieldDecorator('product_line_id', {
        initialValue: values.product_line_id,
        rules: [
          {
            required: true,
            message: '请选择产品线',
          },
        ],
      })(
        <Select placeholder="请选择产品线" style={comStyle} onChange={handleProductLineChange}>
          {productLine.map(line => (
            <Select.Option value={line.id} key={line.id}>
              {line.name}
            </Select.Option>
          ))}
        </Select>,
      )}
    </FormItem>,
    <FormItem key="product_line" {...formLayout} label="产品线名称" style={{ display: 'none' }}>
      {form.getFieldDecorator('product_line', {
        initialValue: values.product_line,
      })(<Input />)}
    </FormItem>,
    <FormItem key="product_id" {...formLayout} label="产品ID">
      {form.getFieldDecorator('product_id', {
        initialValue: values.product_id,
        rules: [
          {
            required: true,
            message: '请输入产品ID',
          },
          values.product_id
            ? {
              type: 'number',
            }
            : {
              validator: repeatProductId,
            },
        ],
      })(<InputNumber placeholder="请输入产品ID" style={comStyle} disabled={!!values.product_id} />)}
      &nbsp; <Icon type="question-circle-o" /> &nbsp; 数字类型命名，提交后不可修改
    </FormItem>,
    <FormItem key="product_name" {...formLayout} label="产品名称">
      {form.getFieldDecorator('product_name', {
        initialValue: values.product_name,
        rules: [
          {
            required: true,
            message: '请输出产品名称',
          },
        ],
      })(<Input placeholder="请输出产品名称" style={comStyle} disabled={!!values.product_name} />)}
      &nbsp; <Icon type="question-circle-o" /> &nbsp; 大驼峰法命名规范,例如：VivaVideo，提交后不可修改
    </FormItem>,
    <p key="tips" style={{ textIndent: 50, fontWeight: 'bold' }}>
      阿里移动分析APPKEY
    </p>,
    <FormItem key="ali_android_app_key" {...formLayout} label="安卓">
      {form.getFieldDecorator('ali_android_app_key', {
        initialValue: values.ali_android_app_key,
      })(<Input placeholder="安卓 APPKEY" style={comStyle} />)}
      &nbsp; <Icon type="question-circle-o" /> &nbsp; 例如：27589792
    </FormItem>,
    <FormItem key="ali_ios_app_key" {...formLayout} label="IOS">
      {form.getFieldDecorator('ali_ios_app_key', {
        initialValue: values.ali_ios_app_key,
      })(<Input placeholder="IOS APPKEY" style={comStyle} />)}
      &nbsp; <Icon type="question-circle-o" /> &nbsp; 例如：27589792
    </FormItem>,
    <FormItem key="product_package_name" {...formLayout} label="GP后台包">
      {form.getFieldDecorator('product_package_name', {
        initialValue: values.product_package_name,
      })(<Input placeholder="请输入" style={comStyle} />)}
      &nbsp; <Icon type="question-circle-o" /> &nbsp; 例如：com.quvideo.xiaoying
    </FormItem>,
    <FormItem key="product_apple_id" {...formLayout} label="IOS APPID">
      {form.getFieldDecorator('product_apple_id', {
        initialValue: values.product_apple_id,
      })(<Input placeholder="请输入" style={comStyle} />)}
      &nbsp; <Icon type="question-circle-o" /> &nbsp; 例如：738897668
    </FormItem>,
    <FormItem key="product_ios_token" {...formLayout} label="IOS TOKEN">
      {form.getFieldDecorator('product_ios_token', {
        initialValue: values.product_ios_token,
      })(<Input placeholder="请输入" style={comStyle} />)}
      &nbsp; <Icon type="question-circle-o" /> &nbsp; 例如：6eab260d-f0d2-45ba-b27c-6c5e1e33b813
    </FormItem>,
    <FormItem key="product_state" {...formLayout} label="产品状态">
      {form.getFieldDecorator('product_state', {
        initialValue: values.product_state || 0,
        rules: [
          {
            required: true,
            message: '请选择产品状态',
          },
        ],
      })(
        <Radio.Group style={comStyle}>
          <Radio value={1}>上线</Radio>
          <Radio value={0}>下线</Radio>
        </Radio.Group>,
      )}
    </FormItem>,
    <FormItem key="title" {...formLayout} label="备注">
      {form.getFieldDecorator('title', {
        initialValue: values.title,
      })(<Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder="请出入内容" style={comStyle} />)}
    </FormItem>,
  ];

  useEffect(() => {
    getProductLine();
  }, []);

  return (
    <>
      <Modal
        width={800}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="产品配置"
        visible={visible}
        onCancel={() => changeModalvisible(false, null)}
        onOk={() => handleSubmit()}
      >
        {renderContent()}
      </Modal>
    </>
  );
});

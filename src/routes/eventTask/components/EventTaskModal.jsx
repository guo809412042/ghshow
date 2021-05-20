import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Input, Select, message,
} from 'antd';
import {
  getProductLineList,
  getProductListValid,
  // getProductVersion,
  getEventTaskEmployeeList,
} from '../services/index';
import {
  getAppVersion,
} from '../../../utils/utils';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const comStyle = {
  width: 300,
};

export default Form.create()(({
  form, values = {}, visible, changeModalvisible,
}) => {
  const [productLine, setProductLine] = useState([]);
  const [product, setProduct] = useState([]);
  // const [version, setVersion] = useState([]);
  // const [selectVersion, setSelectVersion] = useState([]);
  const [andVersion, setAndVersion] = useState([]);
  const [iosVersion, setiosVersion] = useState([]);
  const [filterVersion, setFilterVersion] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [platform, setPlatform] = useState(2);

  const handleSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('fieldsValue', fieldsValue);
      // 有修改内容才提交
      let flag = false;
      for (const k in fieldsValue) {
        if (fieldsValue[k] !== values[k]) {
          flag = true;
        }
      }
      // if (fieldsValue.version.length > 1) {
      //   message.error('版本只能选择一个');
      //   return false;
      // }
      if (flag) {
        changeModalvisible(false, {
          ...values,
          ...fieldsValue,
          // version: fieldsValue.version[0],
        });
      } else {
        changeModalvisible(false);
      }
    });
  };

  const handleProductLineChange = (value, e) => {
    form.resetFields(['product_name', 'platform', 'version']);
  };

  const handleProductChange = async (_, e) => {
    const productId = e.props['data-product_id'];
    form.setFieldsValue({ product_id: productId });
    form.resetFields(['version']);
    const v1 = await getAppVersion(1, productId);
    // console.log('v1', v1);
    const v2 = await getAppVersion(2, productId);
    setAndVersion(v1);
    setiosVersion(v2);
  };

  const handlePlatformChange = async (v) => {
    form.resetFields(['version']);
    const key = v === 0 ? 'iOS' : 'Android';
    // console.log(version.filter(item => new RegExp(key, 'i').test(item.platform)));
    setFilterVersion(key === 'iOS' ? iosVersion : andVersion);

    setPlatform(v);
  };

  const init = async () => {
    const pi = await getProductListValid();
    if (pi.code === 20000) {
      setProduct(pi.data);
    }

    const pl = await getProductLineList();
    if (pl.code === 20000) {
      setProductLine(pl.data);
    }

    const ee = await getEventTaskEmployeeList();
    console.log(ee);

    if (ee.code === 20000) {
      setEmployee(ee.data);
    }
  };

  const handleVersionChange = (value) => {
    console.log('value', value);
    if (value.length) {
      form.setFieldsValue({ version: value[value.length - 1] });
    }
  };

  useEffect(() => {
    init();
  }, []);

  const renderContent = () => [
    <FormItem key="task_name" {...formLayout} label="任务名称">
      {form.getFieldDecorator('task_name', {
        initialValue: values.task_name,
        rules: [
          {
            required: true,
            message: '请输入任务名称',
          },
        ],
      })(<Input placeholder="请输入项目名称" style={comStyle} />)}
    </FormItem>,

    <FormItem key="product_line" {...formLayout} label="业务线">
      {form.getFieldDecorator('product_line', {
        initialValue: values.product_line,
        rules: [
          {
            required: true,
            message: '请选择业务线',
          },
        ],
      })(
        <Select placeholder="请选择业务线" style={comStyle} onChange={handleProductLineChange}>
          {productLine.map(line => (
            <Select.Option value={line.id} key={line.id}>
              {line.name}
            </Select.Option>
          ))}
        </Select>,
      )}
    </FormItem>,
    <FormItem key="product_id" style={{ display: 'none' }}>
      {form.getFieldDecorator('product_id', {
        initialValue: values.product_line,
      })(<Input />)}
    </FormItem>,
    <FormItem key="product_name" {...formLayout} label="产品名称">
      {form.getFieldDecorator('product_name', {
        initialValue: values.product_name,
        rules: [
          {
            required: true,
            message: '请选择产品名称',
          },
        ],
      })(
        <Select placeholder="请选择产品名称" style={comStyle} onChange={handleProductChange}>
          {product
            .filter(item => form.getFieldValue('product_line') === item.product_line_id)
            .map(p => (
              <Select.Option value={p.product_name} data-product_id={p.product_id} key={p.id}>
                {p.product_name}
              </Select.Option>
            ))}
        </Select>,
      )}
    </FormItem>,
    <FormItem key="platform" {...formLayout} label="平台">
      {form.getFieldDecorator('platform', {
        initialValue: values.platform,
        rules: [
          {
            required: true,
            message: '请选择平台',
          },
        ],
      })(
        <Select placeholder="请选择平台" style={comStyle} onChange={handlePlatformChange}>
          <Select.Option value={2} key={2}>
            不限平台
          </Select.Option>
          <Select.Option value={0} key={0}>
            ios
          </Select.Option>
          <Select.Option value={1} key={1}>
            安卓
          </Select.Option>
        </Select>,
      )}
    </FormItem>,
    <FormItem key="version" {...formLayout} label="版本">
      {form.getFieldDecorator('version', {
        initialValue: values.version ? [values.version] : [],
        rules: [
          {
            required: true,
            message: '请选择版本',
          },
        ],
      })(
        <Select placeholder="请选择版本" style={comStyle} mode="tags" onBlur={handleVersionChange}>
          {filterVersion.map(v => (
            <Select.Option value={v.value} key={v.value}>
              {v.value}
            </Select.Option>
          ))}
        </Select>,
      )}
    </FormItem>,

    <FormItem key="document_url" {...formLayout} label="任务文档">
      {form.getFieldDecorator('document_url', {
        initialValue: values.document_url,
        rules: [
          {
            required: true,
            message: '请输入需求文档',
          },
        ],
      })(<Input placeholder="请输入需求文档" style={comStyle} />)}
    </FormItem>,
    <FormItem key="designer_email" {...formLayout} label="埋点设计人员">
      {form.getFieldDecorator('designer_email', {
        initialValue: values.designer_email,
        rules: [
          {
            required: true,
            message: '请选择埋点设计人员',
          },
        ],
      })(
        <Select placeholder="请选择埋点设计人员" style={comStyle}>
          {employee
            .filter(i => i.job_type === 0)
            .map(e => (
              <Select.Option value={e.email} key={e.id}>
                {e.name}
              </Select.Option>
            ))}
        </Select>,
      )}
    </FormItem>,
    // [0, 2].includes(platform) && (
    //   <FormItem key="ios_email" {...formLayout} label="ios开发">
    //     {form.getFieldDecorator('ios_email', {
    //       initialValue: values.ios_email,
    //       rules: [
    //         {
    //           required: true,
    //           message: '请选择ios开发人员',
    //         },
    //       ],
    //     })(
    //       <Select placeholder="请选择ios开发人员" style={comStyle}>
    //         {employee
    //           .filter(i => i.job_type === 1)
    //           .map(e => (
    //             <Select.Option value={e.email} key={e.id}>
    //               {e.name}
    //             </Select.Option>
    //           ))}
    //       </Select>,
    //     )}
    //   </FormItem>
    // ),
    // [1, 2].includes(platform) && (
    //   <FormItem key="android_email" {...formLayout} label="android开发">
    //     {form.getFieldDecorator('android_email', {
    //       initialValue: values.android_email,
    //       rules: [
    //         {
    //           required: true,
    //           message: '请选择android开发人员',
    //         },
    //       ],
    //     })(
    //       <Select placeholder="请选择android开发人员" style={comStyle}>
    //         {employee
    //           .filter(i => i.job_type === 2)
    //           .map(e => (
    //             <Select.Option value={e.email} key={e.id}>
    //               {e.name}
    //             </Select.Option>
    //           ))}
    //       </Select>,
    //     )}
    //   </FormItem>
    // ),
    // <FormItem key="tester_email" {...formLayout} label="测试人员">
    //   {form.getFieldDecorator('tester_email', {
    //     initialValue: values.tester_email,
    //     rules: [
    //       {
    //         required: true,
    //         message: '请选择测试人员',
    //       },
    //     ],
    //   })(
    //     <Select placeholder="请选择测试人员" style={comStyle}>
    //       {employee
    //         .filter(i => i.job_type === 3)
    //         .map(e => (
    //           <Select.Option value={e.email} key={e.id}>
    //             {e.name}
    //           </Select.Option>
    //         ))}
    //     </Select>,
    //   )}
    // </FormItem>,
    <FormItem key="remark" {...formLayout} label="备注">
      {form.getFieldDecorator('remark', {
        initialValue: values.remark,
      })(<Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} placeholder="请出入内容" style={comStyle} />)}
    </FormItem>,
  ];

  return (
    <>
      <Modal
        width={500}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="创建任务"
        visible={visible}
        onCancel={() => changeModalvisible(false, null)}
        onOk={() => handleSubmit()}
      >
        {renderContent()}
      </Modal>
    </>
  );
});

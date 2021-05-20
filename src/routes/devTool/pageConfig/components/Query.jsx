import React from 'react';
import {
  Form, Button, Select, Collapse,
} from 'antd';

import Add from './Add';
// import {
//   IDpageList,
//   IDmoduleList,
//   IDactionList,
// } from '../const';
// import exportExcelxlsx from '../../../../utils/exportExcel2';
import styles from '../../../../styles/index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const SearchForm = ({
  // listData,
  formFields,
  // versionList,
  appVersionList,
  // moduleListAll,
  tagList,
  androidDevList,
  iosDevList,
  form: {
    getFieldDecorator,
    validateFields,
    // resetFields,
  },
  product,

  dispatch,
  reFresh,

}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return false;
      }
      const { idPage, idModule } = values;
      let event_id = '';
      if (idPage || idModule) {
        event_id = `${idPage || ''}_${idModule || ''}`;
      }
      console.log('values', values);
      values.event_id = event_id;
      dispatch({
        type: 'pageConfig/saveFormFields',
        payload: {
          data: values,
        },
      });
      reFresh();
    });
  };

  // const resetInitData = () => {
  //   dispatch({
  //     type: 'pageConfig/saveFormFields',
  //     payload: {
  //       data: {
  //         class_name: null,
  //         version: null,
  //         tag: null,
  //         module_name: null,
  //       },
  //     },
  //   });
  //   resetFields(['class_name', 'version', 'tag', 'module_name']);
  // };

  // const productChange = (value) => {
  //   dispatch({
  //     type: 'pageConfig/saveFormFields',
  //     payload: {
  //       data: {
  //         product: value,
  //       },
  //     },
  //   });
  //   initData();
  //   resetInitData();
  // };

  // const download = () => {
  //   exportExcelxlsx(listData, '事件管理', undefined, false);
  // };


  // const handleReset = () => {
  //   resetFields();
  // };

  // const selectAttr = {
  //   showSearch: true,
  //   allowClear: true,
  //   optionFilterProp: 'children',
  //   notFoundContent: '无法找到',
  //   style: { width: 200 },
  // };
  return (
    <Collapse defaultActiveKey={['1']} style={{ marginTop: '15px' }}>
      <Panel header="配置中心" key="1">
        <Form layout="inline" onSubmit={handleSubmit}>
          <FormItem label="类型" className={styles.marginPxForItem}>
            {
              getFieldDecorator('type', {
                initialValue: '',
              })(
                <Select style={{ width: 200 }}>
                  <Option value="" key="">all</Option>
                  <Option value="1" key="1">页面</Option>
                  <Option value="2" key="2">模块</Option>
                  <Option value="3" key="3">控件</Option>
                  <Option value="4" key="4">行为</Option>
                </Select>,
              )
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            <Button type="primary" htmlType="submit">查询</Button>
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            <Add
              formFields={formFields}
              appVersionList={appVersionList}
              tagList={tagList}
              androidDevList={androidDevList}
              iosDevList={iosDevList}
              reFresh={reFresh}
              product={product}
            />
          </FormItem>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default Form.create()(SearchForm);

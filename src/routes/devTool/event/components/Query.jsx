import React from 'react';
import {
  Form, Button, Select, Collapse, Input, Radio,
} from 'antd';

import Add from './Add';
import {
  IDpageList,
  IDmoduleList,
  IDactionList,
} from '../const';
import exportExcelxlsx from '../../../../utils/exportExcel2';
import styles from '../../../../styles/index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const SearchForm = ({
  listData,
  formFields,
  versionList,
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
  IDpageDict,
  IDpageList,
  IDmoduleDict,
  IDmoduleList,
  IDcontrolDict,
  IDcontrolList,
  IDactionDict,
  IDactionList,
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
        type: 'devToolEvent/saveFormFields',
        payload: {
          data: values,
        },
      });
      reFresh();
    });
  };

  // const resetInitData = () => {
  //   dispatch({
  //     type: 'devToolEvent/saveFormFields',
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
  //     type: 'devToolEvent/saveFormFields',
  //     payload: {
  //       data: {
  //         product: value,
  //       },
  //     },
  //   });
  //   initData();
  //   resetInitData();
  // };

  const download = () => {
    exportExcelxlsx(listData, '事件管理', undefined, false);
  };


  // const handleReset = () => {
  //   resetFields();
  // };

  const selectAttr = {
    showSearch: true,
    allowClear: true,
    optionFilterProp: 'children',
    notFoundContent: '无法找到',
    style: { width: 200 },
  };
  return (
    <Collapse defaultActiveKey={['1']} style={{ marginTop: '15px' }}>
      <Panel header="页面/模块/行为/标签" key="1">
        <Form layout="inline" onSubmit={handleSubmit}>
          {/* <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('product', { initialValue: defaultProduct })(
                <Select
                  placeholder="选择产品"
                  onChange={productChange}
                  {...selectAttr}
                >
                  {
                    productList.map(item => <Option value={String(item.value)} key={String(item.value)}>{item.label}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem> */}
          <FormItem label="事件ID-组装起来的id" style={{ display: 'none' }}>
            {
              getFieldDecorator('event_id', {})(<Input />)
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('idPage')(
                <Select placeholder="页面筛选" {...selectAttr}>
                  {
                    IDpageList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem>
          {/* <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('class_name', {})(
                <Select placeholder="分类筛选" {...selectAttr}>
                  {
                    classList.map(item => <Option value={item.class_name} key={item.class_name}>{item.class_name}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem> */}
          <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('idModule', {})(
                <Select placeholder="模块筛选" {...selectAttr}>
                  {
                    IDmoduleList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('idAction', {})(
                <Select placeholder="行为筛选" {...selectAttr}>
                  {
                    IDactionList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('version', {})(
                <Select placeholder="版本筛选" {...selectAttr}>
                  {
                    versionList.map(item => <Option value={item.version} key={item.version}>{item.version}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('tag', {})(
                <Select placeholder="标签筛选" {...selectAttr}>
                  {
                    tagList.map(item => <Option value={item.tag} key={item.tag}>{item.tag}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('android_dev', {})(
                <Select placeholder="安卓负责人" {...selectAttr}>
                  {
                    androidDevList.map(item => <Option value={item.name} key={item.name}>{item.name}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('ios_dev', {})(
                <Select placeholder="ios负责人" {...selectAttr}>
                  {
                    iosDevList.map(item => <Option value={item.name} key={item.name}>{item.name}</Option>)
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            {
              getFieldDecorator('collection', {
                initialValue: 'all',
              })(
                <Radio.Group defaultValue="all" buttonStyle="solid">
                  <Radio.Button value="collection">收藏</Radio.Button>
                  <Radio.Button value="all">全部</Radio.Button>
                  <Radio.Button value="my">我的</Radio.Button>
                </Radio.Group>,
              )
            }
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            <Button type="primary" htmlType="submit">查询</Button>
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            <Button type="primary" icon="download" onClick={download}>导出</Button>
          </FormItem>
          <FormItem className={styles.marginPxForItem}>
            <Add
              formFields={formFields}
              appVersionList={appVersionList}
              tagList={tagList}
              androidDevList={androidDevList}
              iosDevList={iosDevList}
              reFresh={reFresh}
              IDpageDict={IDpageDict}
              IDpageList={IDpageList}
              IDmoduleDict={IDmoduleDict}
              IDmoduleList={IDmoduleList}
              IDcontrolDict={IDcontrolDict}
              IDcontrolList={IDcontrolList}
              IDactionDict={IDactionDict}
              IDactionList={IDactionList}
            />
          </FormItem>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default Form.create()(SearchForm);

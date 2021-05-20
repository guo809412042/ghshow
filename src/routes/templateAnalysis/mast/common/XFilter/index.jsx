import React, { useState } from 'react';
import { Form, Button, Collapse } from 'antd';

const { Panel } = Collapse;
const { Item } = Form;

const XFilter = ({
  onSearch = () => {},
  children = () => null,
  form: {
    getFieldDecorator,
    validateFields,
  },
  title = '搜索',
  extraButton,
}) => {
  const handleSearch = () => {
    validateFields((err, values) => {
      if (!err) {
        onSearch(values);
      }
    });
  };

  return (
    <Collapse defaultActiveKey='1'>
      <Panel header={title || '搜索'} key='1'>
        <Form
          layout="inline"
        >
          {children({ getFieldDecorator })}
          <Item>
            <Button
              type="primary"
              onClick={() => handleSearch()}
            >
              查询
            </Button>
          </Item>
          {extraButton && (
            <Item>
              {extraButton}
            </Item>
          )}
        </Form>
      </Panel>
    </Collapse>
  );
};

export default Form.create()(XFilter);

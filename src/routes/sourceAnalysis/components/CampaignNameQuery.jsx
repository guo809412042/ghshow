/* eslint-disable react/prop-types */
import React from 'react';
import { Collapse, Select, Form } from 'antd';
import _ from 'lodash';
import { SOURCE_KEYS_VIVA } from '../viva/constant';

const CampaignNameQuery = ({
  setCampainName,
  selectCampaign,
  campaignList,
  setCurrentKeyIndex,
  currentKeyIndex,
  setTags,
  tags,
}) => (
  <div style={{ marginTop: 10 }}>
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel key="1" header="查询">
        <Form layout="inline">
          <Form.Item label="campaign">
            <Select
              style={{ width: 600 }}
              showSearch
              onChange={(value) => {
                if (value) {
                  setCurrentKeyIndex(2);
                  const newTags = _.clone(tags);
                  newTags.push({
                    tag: SOURCE_KEYS_VIVA[1],
                    name: value,
                  });
                  setTags(newTags);
                }
                setCampainName(value);
              }}
              allowClear
              value={selectCampaign}
              disabled={
                SOURCE_KEYS_VIVA[currentKeyIndex].value === SOURCE_KEYS_VIVA[2].value
                || SOURCE_KEYS_VIVA[currentKeyIndex].value === SOURCE_KEYS_VIVA[3].value
              }
            >
              {campaignList.map(v => (
                <Select.Option key={v.campaign_name} value={v.campaign_name}>
                  {v.campaign_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Collapse.Panel>
    </Collapse>
  </div>
);

export default CampaignNameQuery;

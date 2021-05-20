import React from 'react';
import { Collapse, Radio, Select, Button, DatePicker, Input } from 'antd';

export default ({ searchDetail, setSearchDetail, countryList, appVersionList }) => (
  <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
    <Collapse.Panel header="查询" key="1">
      <Radio.Group
        value={searchDetail.showType || '1'}
        onChange={e => {
          console.log(e);
          setSearchDetail({
            ...searchDetail,
            showType: e.target.value
          });
        }}
      >
        <Radio.Button key="1" value="1">
          明细
        </Radio.Button>
        <Radio.Button key="2" value="2">
          统计
        </Radio.Button>
      </Radio.Group>
      &nbsp;&nbsp;
      <Radio.Group
        value={searchDetail.platform || '1'}
        onChange={e =>
          setSearchDetail({
            ...searchDetail,
            platform: e.target.value
          })
        }
      >
        <Radio.Button key="1" value="1">
          Android
        </Radio.Button>
        <Radio.Button key="2" value="2">
          iOS
        </Radio.Button>
      </Radio.Group>
      <Select
        placeholder="用户"
        allowClear
        style={{ width: 120, margin: '0 8px' }}
        value={searchDetail.new_user}
        onChange={e =>
          setSearchDetail({
            ...searchDetail,
            new_user: e
          })
        }
      >
        <Select.Option key="" value="">
          全部
        </Select.Option>
        <Select.Option key="1" value="1">
          新用户
        </Select.Option>
        <Select.Option key="0" value="0">
          老用户
        </Select.Option>
      </Select>
      <Select
        allowClear
        style={{ width: 200 }}
        value={searchDetail.country}
        onChange={e =>
          setSearchDetail({
            ...searchDetail,
            country: e
          })
        }
        showSearch
        placeholder="地区"
      >
        <Select.Option key="" value="">
          全部
        </Select.Option>
        {countryList.map(v => (
          <Select.Option key={v.country} value={v.country}>
            {v.country}
          </Select.Option>
        ))}
      </Select>
      <Select
        allowClear
        style={{ width: 200, margin: 8 }}
        value={searchDetail.app_version}
        onChange={e =>
          setSearchDetail({
            ...searchDetail,
            app_version: e
          })
        }
        showSearch
        placeholder="版本"
      >
        <Select.Option key="" value="">
          全部
        </Select.Option>
        {appVersionList.map(v => (
          <Select.Option key={v.app_version} value={v.app_version}>
            {v.app_version}
          </Select.Option>
        ))}
      </Select>
      <Input.Search
        onChange={e =>
          setSearchDetail({
            ...searchDetail,
            ttid: e.target.value
          })
        }
        allowClear
        placeholder="ttid"
        style={{ width: 200, margin: 8 }}
      />
      <Input.Search
        onChange={e => {
          setSearchDetail({
            ...searchDetail,
            name: e.target.value
          });
        }}
        allowClear
        placeholder="素材名称"
        style={{ width: 200 }}
      />
      <DatePicker.RangePicker
        value={[searchDetail.startDate, searchDetail.endDate]}
        style={{ width: 240, margin: '0 8px' }}
        onChange={e =>
          setSearchDetail({
            ...searchDetail,
            startDate: e[0],
            endDate: e[1]
          })
        }
      />
      <Button type="primary" onClick={() => setSearchDetail({ ...searchDetail })}>
        查询
      </Button>
    </Collapse.Panel>
  </Collapse>
);

import React from 'react';
import {
  Collapse, Radio, Select, Button, DatePicker, Input, Checkbox,
} from 'antd';

export default ({
  searchDetail, setSearchDetail, countryList, appVersionList, mediaSource,
}) => (
  <Collapse style={{ marginBottom: 8 }} defaultActiveKey={['1']}>
    <Collapse.Panel header="查询" key="1">
      <Radio.Group
        value={searchDetail.platform || '1'}
        onChange={e => setSearchDetail({
          ...searchDetail,
          platform: e.target.value,
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
        onChange={e => setSearchDetail({
          ...searchDetail,
          new_user: e,
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
        placeholder="等于"
        style={{ width: 120, margin: '0 8px' }}
        value={searchDetail.equal}
        onChange={(e) => {
          setSearchDetail({
            ...searchDetail,
            equal: e,
          });
          console.log(e);
        }}
      >
        <Select.Option key="0" value="0">
          等于
        </Select.Option>
        <Select.Option key="1" value="1">
          不等于
        </Select.Option>
      </Select>
      <Select
        mode="multiple"
        allowClear
        style={{ width: 200 }}
        value={searchDetail.country}
        onChange={(e) => {
          console.log(e);
          setSearchDetail({
            ...searchDetail,
            country: e,
          });
        }}
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
        onChange={e => setSearchDetail({
          ...searchDetail,
          app_version: e,
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
        // value={searchDetail.ttid}
        onSearch={e => setSearchDetail({
          ...searchDetail,
          ttid: e,
        })
        }
        allowClear
        placeholder="ttid"
        style={{ width: 200, margin: 8 }}
      />
      <Input.Search
        // value={searchDetail.tt_name}
        onSearch={(e) => {
          setSearchDetail({
            ...searchDetail,
            tt_name: e,
          });
        }
        }
        allowClear
        placeholder="素材名称"
        style={{ width: 200 }}
      />
      <DatePicker.RangePicker
        value={[searchDetail.startDate, searchDetail.endDate]}
        style={{ width: 240, margin: '0 8px' }}
        onChange={e => setSearchDetail({
          ...searchDetail,
          startDate: e[0],
          endDate: e[1],
        })
        }
      />
      <Select
        placeholder="渠道"
        allowClear
        value={searchDetail.media_source}
        onChange={e => setSearchDetail({
          ...searchDetail,
          media_source: e,
        })
        }
        style={{ width: 200, margin: 8 }}
      >
        {mediaSource.map(item => (
          <Select.Option key={item.media_source} value={item.media_source}>
            {item.media_source}
          </Select.Option>
        ))}
      </Select>
      <Button type="primary" onClick={() => setSearchDetail(searchDetail)}>
        查询
      </Button>
    </Collapse.Panel>
  </Collapse>
);

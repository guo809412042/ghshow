import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  DatePicker, Select, Radio, Table,
} from 'antd';
import { detailTabColumns } from '../constant';
import {
  parentTagsSQL, childTagsSQL, parentTableSQL,
  childTableSQL,
  tagTableSQL,
  tagSQL,
} from '../sqlTemplate';
import { createSqlWhere } from '../../../../../utils/utils';
import { getData } from '../../../../../utils/request';

const DetailView = () => {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));
  const [spiderType, setspiderType] = useState(undefined);
  const [tagType, setTagType] = useState('a');
  const [tagValue, setTagValue] = useState(undefined);
  const [tagsValue, setTagsValue] = useState(undefined);
  const [tags, setTags] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [tagDataSource, setTagDataSource] = useState([]);
  const [tagsList, setTagList] = useState([]);
  const parentTag = async () => {
    const sql = createSqlWhere({
      sql: parentTagsSQL, startDate, endDate,
    });
    const res = await getData(sql);
    setTags(res);
  };
  const fetchTags = async () => {
    const sql = createSqlWhere({ sql: tagSQL, startDate, endDate });
    const res = await getData(sql);
    setTagList(res);
  };
  const fetchTag = async () => {
    let sql = createSqlWhere({
      sql: tagTableSQL, startDate, endDate,
    });
    sql = sql.replace(/#tagName#/, tagsValue ? ` split_part(name,':',2) = "${tagsValue}"` : 'name <> \'all\'');
    const res = await getData(sql);
    setTagDataSource(res);
  };
  const parentTable = async () => {
    let sql = createSqlWhere({
      sql: parentTableSQL,
      startDate,
      endDate,
    });
    sql = sql.replace(/#tagName#/, tagValue ? ` split_part(name,':',2) = "${tagValue}"` : 'name <> \'all\'');
    const res = await getData(sql);
    const data = [];
    let videoTag = '';
    if (tagType === 'a' && spiderType) {
      videoTag = spiderType === 'is_spider' ? 'parent_is_spider_cnt' : 'parent_not_spider_cnt';
    }
    res.forEach((v, index) => {
      data.push({
        tag_id: v.tag_id,
        ds: v.ds,
        name: v.name,
        vdo_cnt: spiderType ? v[videoTag] : tagType === 'a' ? v.parent_all_cnt : v.child_all_cnt,
        index,
      });
    });
    setDataSource(data);
  };
  const childTag = async () => {
    const sql = createSqlWhere({
      sql: childTagsSQL, startDate, endDate,
    });
    const res = await getData(sql);
    setTags(res);
  };
  const childTable = async () => {
    let sql = createSqlWhere({
      sql: childTableSQL,
      startDate,
      endDate,
    });
    sql = sql.replace(/#tagName#/, tagValue ? ` split_part(name,':',2) = "${tagValue}"` : 'name <> \'all\'');
    const res = await getData(sql);
    const data = [];
    let videoTag = '';
    if (tagType === 'b' && spiderType) {
      videoTag = spiderType === 'is_spider' ? 'child_is_spider_cnt' : 'child_not_spider_cnt';
    }
    res.forEach((v, index) => {
      data.push({
        tag_id: v.tag_id,
        ds: v.ds,
        name: v.name,
        vdo_cnt: spiderType ? v[videoTag] : tagType === 'a' ? v.parent_all_cnt : v.child_all_cnt,
        index,
      });
    });
    setDataSource(data);
  };
  const tagFecthAll = () => {
    if (tagType === 'a') {
      parentTag();
      parentTable();
    } else {
      childTag();
      childTable();
    }
  };
  useEffect(() => {
    tagFecthAll();
  }, [tagType]);
  useEffect(() => {
    if (tagType === 'a') {
      parentTable();
    } else {
      childTable();
    }
  }, [tagValue, spiderType]);
  useEffect(() => {
    fetchTag();
    tagFecthAll();
    fetchTags();
  }, [startDate, endDate]);
  useEffect(() => {
    fetchTag();
  }, [tagsValue]);
  return <div>
    <DatePicker.RangePicker
      value={[startDate, endDate]}
      onChange={(values) => {
        setStartDate(values[0]);
        setEndDate(values[1]);
      }}
    />
    <h3 style={{ marginTop: 20 }}>分类数据</h3>
    <div>
      <Select
        style={{
          marginRight: 10,
          width: 120,
        }}
        allowClear
        placeholder="视频类型"
        value={spiderType}
        onChange={value => setspiderType(value)}
      >
        <Select.Option key="is_spider" value="is_spider">爬虫视频</Select.Option>
        <Select.Option key="not_spider" value="not_spider">非爬虫视频</Select.Option>
      </Select>
      <Radio.Group value={tagType} onChange={value => setTagType(value.target.value)}>
        <Radio.Button value="a">一级标签</Radio.Button>
        <Radio.Button value="b">二级标签</Radio.Button>
      </Radio.Group>
      <Select
        style={{
          marginLeft: 10,
          width: 200,
        }}
        value={tagValue}
        showSearch
        allowClear
        onChange={value => setTagValue(value)}
        placeholder="标签"
      >
        {tags.map(v => <Select.Option value={v.name} key={v.name}>{v.name}</Select.Option>)}
      </Select>
    </div>
    <Table
      style={{ marginTop: 20 }}
      dataSource={dataSource}
      columns={detailTabColumns}
      rowKey="index"
      bordered
    />
    <h3 style={{ marginTop: 20 }}>标签数据</h3>
    <Select
      style={{
        marginRight: 10,
        width: 300,
      }}
      value={tagsValue}
      showSearch
      allowClear
      onChange={value => setTagsValue(value)}
      placeholder="标签"
    >
      {tagsList.map(v => <Select.Option value={v.name} key={v.name}>{v.name}</Select.Option>)}
    </Select>
    <Table
      style={{ marginTop: 20 }}
      dataSource={tagDataSource}
      columns={detailTabColumns}
      rowKey="index"
      bordered
    />
  </div>;
};
export default DetailView;

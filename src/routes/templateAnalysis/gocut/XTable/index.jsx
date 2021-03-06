import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form, DatePicker, Select } from 'antd';
import { numberDivide } from '../const';
import { getDataSql, getAllCountryListSql, getAllVersionListSql, getAllMediaSourceListSql } from './sql';
import XTable from '../../../templateAnalysis/mast/common/XTable';
import XFilter from '../../../templateAnalysis/mast/common/XFilter';
import { columns } from './column';
import { getData } from '../../../../utils/request';

const { Item } = Form;
const { RangePicker } = DatePicker;

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [contryList, setContryList] = useState([]);
  const [versionList, setVersionList] = useState([]);
  const [mediaSourceList, setMediaSourceList] = useState([]);
  const [filterParams, setFilterParams] = useState({
    date: [moment().subtract(8, 'd'), moment().subtract(1, 'd')],
    platform: 1,
    country: undefined,
    app_version: undefined,
    new_user: undefined,
  });
  const [curPlatform, setCurPlatform] = useState(filterParams.platform);

  const getTableDate = async () => {
    const sql = getDataSql(filterParams);
    const resp = await getData(sql);
    setDataSource(resp);
  };

  const handleSearch = (params) => {
    setFilterParams({
      ...filterParams,
      ...params,
    })
  };

  const getAllCountryList = async () => {
    const sql = getAllCountryListSql();
    const resp = await getData(sql);

    setContryList(resp);
  };

  const getVersionList = async () => {
    const sql = getAllVersionListSql({ platform: curPlatform, });
    const resp = await getData(sql);

    setVersionList(resp);
  };

  const getMediaSourceList = async () => {
    const sql = getAllMediaSourceListSql();
    const resp = await getData(sql);

    setMediaSourceList(resp);
  };

  const handChangePlatform = (val) => {
    setCurPlatform(val);
  };

  const getDownLoadData = () => {
    const list = [];
    dataSource.forEach(l => {
      const {
        ds,
        platform,
        App_Launch,
        app_launch,
        Home_Show,
        Home_ff,
        Edit_ff,
        Home_edit_click,
        gallery_ff,
        Edit_export_click,
        Videoedit_Share_Show,
        Share_exposure,
        Videoedit_Share_Click,
        Share_share_click,
      } = l;
      const clickRate = +platform === 2 ? numberDivide(Home_edit_click, Home_Show)
        : numberDivide(Home_edit_click, Home_ff);
      const homePageExoortRate = +platform === 2 ? numberDivide(Edit_export_click, Home_Show)
        : numberDivide(Edit_export_click, Home_ff);
      const shareRate = +platform === 2 ? numberDivide(Videoedit_Share_Click, Videoedit_Share_Show)
        : numberDivide(Share_share_click, Share_exposure);
      const home2ShareRate = +platform === 2 ? numberDivide(Videoedit_Share_Click, Home_Show)
        : numberDivide(Share_share_click, Home_ff);
      const opt = {
        ??????: ds,
        ?????????: +platform === 2 ? 'IOS' : '??????',
        app??????: +platform === 2 ? app_launch : App_Launch,
        ????????????: +platform === 2 ? Home_Show : Home_ff,
        ??????????????????: Home_edit_click,
        ?????????????????????: clickRate + '%',
        ???????????????: gallery_ff,
        ??????????????????: numberDivide(gallery_ff, Home_edit_click) + '%',
        ???????????????: Edit_ff,
        ??????????????????: numberDivide(Edit_ff, gallery_ff) + '%',
        ??????????????????: Edit_export_click,
        ?????????: numberDivide(Edit_export_click, Edit_ff) + '%',
        ????????????????????????: homePageExoortRate + '%',
        ???????????????: +platform === 2 ? Videoedit_Share_Show : Share_exposure,
        ?????????????????????:+platform === 2 ? Videoedit_Share_Click : Share_share_click,
        ?????????: shareRate + '%',
        ??????????????????: home2ShareRate + '%',
      };
      list.push(opt);
    });
    return list;
  };

  useEffect(() => {
    getTableDate();
  }, [filterParams]);

  useEffect(() => {
    getVersionList();
  }, [curPlatform]);

  useEffect(() => {
    getAllCountryList();
    getMediaSourceList();
  }, []);

  return (
    <div style={{ marginBottom: 30 }}>
      <XFilter onSearch={handleSearch} title="??????">
        {
          ({ getFieldDecorator }) => (
            <>
              <Item label="??????">
                {
                  getFieldDecorator("date", {
                    initialValue: filterParams.date,
                  })(
                    <RangePicker />
                  )
                }
              </Item>
              <Item label="??????">
                {
                  getFieldDecorator("platform", {
                    initialValue: filterParams.platform,
                  })(
                    <Select
                      style={{
                        width: 200
                      }}
                      onChange={handChangePlatform}
                      allowClear
                      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      <Select.Option value={1} key="??????">
                        ??????
                      </Select.Option>
                      <Select.Option value={2} key="IOS">
                        IOS
                      </Select.Option>
                    </Select>
                  )
                }
              </Item>
              <Item label="??????">
                {
                  getFieldDecorator("country", {
                    initialValue: filterParams.country,
                  })(
                    <Select
                      mode="multiple"
                      style={{
                        width: 260
                      }}
                      allowClear
                      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {
                        contryList.map(l => (
                          <Select.Option value={l.country} key={l.country}>
                            {l.country}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Item>
              <Item label="??????">
                {
                  getFieldDecorator("app_version", {
                    initialValue: filterParams.app_version,
                  })(
                    <Select
                      mode="multiple"
                      style={{
                        width: 260
                      }}
                      allowClear
                      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {
                        versionList.map(l => (
                          <Select.Option value={l.app_version} key={l.app_version}>
                            {l.app_version}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Item>
              <Item label="??????">
                {
                  getFieldDecorator("media_source", {
                    initialValue: filterParams.media_source,
                  })(
                    <Select
                      mode="multiple"
                      style={{
                        width: 260
                      }}
                      allowClear
                      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {
                        mediaSourceList.map(l => (
                          <Select.Option value={l.media_source} key={l.media_source}>
                            {l.media_source}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Item>
              <Item label="????????????">
                {
                  getFieldDecorator("new_user", {
                    initialValue: filterParams.new_user,
                  })(
                    <Select
                      style={{
                        width: 100
                      }}
                      allowClear
                      filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      <Select.Option value={1}>
                        ?????????
                      </Select.Option>
                      <Select.Option value={2}>
                        ?????????
                      </Select.Option>
                    </Select>
                  )
                }
              </Item>
            </>
          )
        }
      </XFilter>
      <XTable
        dataSource={dataSource}
        columns={columns}
        // dowloadFn={getDownLoadData}
        // dowloadOpt={{
        //   name: '????????????????????????'
        // }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

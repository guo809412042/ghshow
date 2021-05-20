/*
 * @Date: 2021-03-05 14:09:44
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-03-30 11:22:48
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useEffect, useState } from 'react';
import {
  Collapse, Select, Button, DatePicker, Icon, Popover,
} from 'antd';
import { getData } from '../../../../utils/request';
import { countryListSql } from './sqlTemplate';

export default ({ onSearch }) => {
  // const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(undefined);

  // app 类型
  const [countries, setCountries] = useState(undefined);
  const [countryList, setCountryList] = useState([]);

  // const getAppProduct = async () => {
  //   const res = await getHoloData(appProductSQL);
  //   setAppProductList(res);
  // };
  const getCountryList = async () => {
    const res = await getData(countryListSql);
    // console.log('res', res);
    // const list = COUNTRY_NAME_COMMON_LIST.concat(
    const list = res.map(v => ({ country_code: [v.country_name], country_name: v.country_name }));
    // );
    // const { data: customCountry } = await getDataList();
    // console.log('datadatadata', data);
    // console.log('resresres', res);
    // console.log('customCountry', customCountry);
    // customCountry.forEach((item) => {
    //   item.country_code = item.country_codes.split(',');
    //   item.country_name = item.country_codes;
    // });
    // console.log('list', list);
    setCountryList(list);
  };

  // const handleChange = (e) => {
  //   let c = new Set();
  //   for (const i in e) {
  //     if (e[i].includes(',')) {
  //       const newCountrys = e[i].split(',');
  //       c = new Set([...c, ...newCountrys]);
  //     } else {
  //       c = new Set([...c, e[i]]);
  //     }
  //   }

  //   setCountries([...c]);
  // };

  useEffect(() => {
    getCountryList();
  }, []);

  const handleSearch = () => {
    onSearch({
      // startDate,
      endDate,
      // appProduct,
      countries,
    });
  };
  return <div style={{ marginBottom: 16 }}>
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel
        header="查询"
        key="1"
      >
        <span style={{ marginRight: 8 }}>地区:</span>
        <Select
          allowClear
          // mode="multiple"
          showSearch
          key="地区"
          value={countries}
          placeholder="全部"
          onChange={setCountries}
          style={{ width: 300, marginRight: 16 }}
        >
          {countryList.map(v => (
            <Select.Option key={v.country_name} value={v.country_name}>
              {v.group_name || v.country_name}
            </Select.Option>
          ))}
        </Select>
        <span style={{ cursor: 'pointer', marginRight: 8 }}>日期:<Popover content="所选时间为当月1号到截止时间，选择0305即数据为0301-0305的数据，对比上月即0201-0205">
          <Icon type="question-circle" />
        </Popover></span>
        <DatePicker onChange={setEndDate} style={{ marginRight: 16 }}/>
        {/* <Icon
          type="QuestionCircleOutlined"
          style={{
            fontSize: 20,
            marginLeft: 10,
            cursor: 'pointer',
            lineHeight: '42px',
          }}
        /> */}
        <Button onClick={handleSearch} type="primary">
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  </div>;
};

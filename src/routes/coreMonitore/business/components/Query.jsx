import React, { useState, useEffect } from 'react';
import { Collapse, Button, Select } from 'antd';
import _ from 'lodash';
import { getCountryAndAppVersionAndChannel, selectAttr } from '../../../../utils/utils';
import { literalOptions, numberOptions } from '../../../common/constants';

export default ({
  search, onSearch, product_id, platform,
}) => {
  const [countryOperation, setCountryOperation] = useState(search.countryOperation);
  const [appVersionOperation, setAppVersionOperation] = useState(search.appVersionOperation);
  const [selectCountry, setSelectCountry] = useState(search.selectCountry);
  const [selectAppVersion, setSelectAppVersion] = useState(search.selectAppVersion);
  const [countryList, setCountryList] = useState([]);
  const [appVersionList, setAppVersionList] = useState([]);
  const getCountryAndAppVersion = async () => {
    const { countryList, appVersionList } = await getCountryAndAppVersionAndChannel(platform, product_id);
    setCountryList(countryList);
    setAppVersionList(appVersionList);
  };
  useEffect(() => {
    getCountryAndAppVersion();
  }, [platform]);

  const handleSearch = () => {
    // onSearch({
    //   countryOperation,
    //   appVersionOperation,
    //   selectCountry,
    //   selectAppVersion,
    // });
    const country = countryOperation + (!selectCountry ? '' : `'${selectCountry}'`);
    const appVersion = appVersionOperation + (!selectAppVersion ? '' : `'${selectAppVersion}'`);
    onSearch(`${country}||${appVersion}`);
  };

  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="查询" key="1">
          <Select {...selectAttr} value={countryOperation} onChange={setCountryOperation}>
            {literalOptions}
          </Select>
          <Select {...selectAttr} placeholder="地区" value={selectCountry} onChange={setSelectCountry}>
            {_.map(countryList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Select {...selectAttr} value={appVersionOperation} onChange={setAppVersionOperation}>
            {numberOptions}
          </Select>
          <Select placeholder="版本" {...selectAttr} value={selectAppVersion} onChange={setSelectAppVersion}>
            {_.map(appVersionList, item => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
          <Button onClick={handleSearch} type="primary">
            添加
          </Button>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Button, Radio, TreeSelect,
} from 'antd';
import QueryTemplate from '../../../common/QueryTemplate';
import { APP_PRODUCT_LIST_WITHOUT_VID, PLAFORM_LIST } from '../../../../utils/const';
import {
  coutnrySQL,
  sourceSQL,
  langSQL,
  appVersionSQL,
  levelOneSQL,
  levelOneTwoSQL,
  levelTwoThereeSQL,
} from '../sqlTemplate';
import { getData } from '../../../../utils/request';
import { IS_VIP, DAY_TYPE } from '../const';
import { createSqlWhere } from '../../../../utils/utils';

export default ({ search, setSearch }) => {
  const [treeData, setTreeData] = useState([]);
  const [issueType, setIssueType] = useState([]);
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);
  const [product, setProduct] = useState(search.product);
  const [platform, setPlatform] = useState(search.platform);

  const [country, setCountry] = useState(search.country);
  const [countryList, setCountryList] = useState([]);

  const [source, setSource] = useState(search.source);
  const [sourceList, setSourceList] = useState([]);

  const [lang, setLang] = useState(search.lang);
  const [langList, setLangList] = useState([]);

  const [isVip, setIsVip] = useState(search.isVip);

  const [maxAppVersion, setMaxAppVersion] = useState(search.maxAppVersion);
  const [minAppVersion, setMinAppVersion] = useState(search.minAppVersion);

  const [appVersionList, setAppVersionList] = useState([]);

  const [dayType, setDayType] = useState(search.dayType);

  const getCountryList = async () => {
    let where = '';
    if (source.length) {
      where += ` and source in (${source.map(v => `'${v}'`).join(',')})`;
    }
    const res = await getData(
      createSqlWhere({
        sql: coutnrySQL,
        platform: platform ? ` and  platform = '${platform}'` : '',
        product,
        where,
      }),
    );
    setCountryList(res.map(v => ({ value: v.country, label: v.country })));
  };
  const getSourceList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: sourceSQL,
        platform: platform ? ` and  platform = '${platform}'` : '',
        product,
      }),
    );
    setSourceList(res.map(v => ({ value: v.source, label: v.source })));
  };
  const getLangList = async () => {
    let where = '';
    if (source.length) {
      where += ` and source in (${source.map(v => `'${v}'`).join(',')})`;
    }
    if (country.length) {
      where += ` and country in (${country.map(v => `'${v}'`).join(',')})`;
    }
    const res = await getData(
      createSqlWhere({
        sql: langSQL,
        platform: platform ? ` and  platform = '${platform}'` : '',
        product,
        where,
      }),
    );
    setLangList(res.map(v => ({ value: v.lang, label: v.lang })));
  };
  const getAppVerisonList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: appVersionSQL,
        product,
        platform,
      }),
    );
    setAppVersionList(
      res.map(v => ({
        label: v.app_version,
        value: v.appkey,
      })),
    );
  };
  const getLevelTree = async () => {
    const res1 = await getData(levelOneSQL);
    const res12 = await getData(levelOneTwoSQL);
    const res23 = await getData(levelTwoThereeSQL);
    const data = [];
    for (const i of res1) {
      const arr = {
        title: i.level_one,
        value: i.level_one,
        key: i.level_one,
        children: [],
      };
      const list1 = res12.filter(v => v.level_one === i.level_one);

      for (const j of list1) {
        const arr1 = {
          title: j.level_two,
          value: `${i.level_one}-${j.level_two}`,
          key: `${i.level_one}-${j.level_two}`,
          children: [],
        };
        const list2 = res23.filter(v => v.level_two === j.level_two && v.level_one === i.level_one);
        for (const k of list2) {
          arr1.children.push({
            title: k.level_three,
            value: `${k.level_one}-${k.level_two}-${k.level_three}`,
            key: `${k.level_one}-${k.level_two}-${k.level_three}`,
          });
        }
        arr.children.push(arr1);
      }
      data.push(arr);
    }
    setTreeData(data);
  };
  useEffect(() => {
    if (product) {
      getSourceList();
    }
  }, [product]);
  useEffect(() => {
    if (product) {
      getCountryList();
    }
  }, [product, platform, source]);
  useEffect(() => {
    if (product) {
      getLangList();
    }
  }, [product, platform, source, country]);
  useEffect(() => {
    if (platform && product) {
      getAppVerisonList();
    }
  }, [platform, product]);
  useEffect(() => {
    getLevelTree();
  }, []);
  const appProductList = Object.keys(APP_PRODUCT_LIST_WITHOUT_VID).map(v => ({
    value: v,
    label: APP_PRODUCT_LIST_WITHOUT_VID[v],
  }));
  const platformList = Object.keys(PLAFORM_LIST).map(v => ({
    value: v,
    label: PLAFORM_LIST[v],
  }));
  const isVipList = Object.keys(IS_VIP).map(v => ({
    value: v,
    label: IS_VIP[v],
  }));
  useEffect(() => {
    if (source.length === 1 && source.includes('email')) {
      setCountry([]);
      setMaxAppVersion(undefined);
      setMinAppVersion(undefined);
      setIsVip(undefined);
    }
    if (source.length === 1 && (source.includes('GP') || source.includes('appstore'))) {
      setIsVip(undefined);
    }
  }, [source]);
  const treeChange = (values) => {
    setIssueType(values);
  };
  const tProps = {
    treeData,
    value: issueType,
    onChange: treeChange,
    treeCheckable: true,
    searchPlaceholder: '服务总结标签',
    allowClear: true,
    style: {
      width: 600,
      marginRight: 8,
    },
  };
  return (
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel header="查询" key="1">
        <QueryTemplate data={appProductList} value={product} title="产品" setValue={setProduct} />
        <QueryTemplate data={platformList} value={platform} title="平台" setValue={setPlatform} />
        <QueryTemplate multiple data={sourceList} value={source} title="渠道" setValue={setSource} width={150} />
        <QueryTemplate
          multiple
          disabled={source.length === 1 && source.includes('email')}
          data={countryList}
          value={country}
          title="地区"
          setValue={setCountry}
        />
        <QueryTemplate multiple data={langList} value={lang} title="语言" setValue={setLang} />
        <QueryTemplate
          data={isVipList}
          disabled={
            source.length === 1 && (source.includes('email') || source.includes('GP') || source.includes('appstore'))
          }
          value={isVip}
          title="会员状态"
          setValue={setIsVip}
        />
        <div />
        <TreeSelect {...tProps} />
        <QueryTemplate
          data={appVersionList}
          value={minAppVersion}
          title="最小版本"
          setValue={setMinAppVersion}
          showSearch={false}
          disabled={source.length === 1 && source.includes('email')}
        />
        <QueryTemplate
          data={appVersionList}
          value={maxAppVersion}
          title="最大版本"
          setValue={setMaxAppVersion}
          showSearch={false}
          disabled={source.length === 1 && source.includes('email')}
        />
        <div />
        <QueryTemplate
          type="rangePicker"
          title="创建时间"
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Radio.Group value={dayType} onChange={e => setDayType(e.target.value)}>
          {Object.keys(DAY_TYPE).map(v => (
            <Radio.Button key={v} value={v}>
              {DAY_TYPE[v]}
            </Radio.Button>
          ))}
        </Radio.Group>
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          onClick={() => {
            let minVersion = '';
            let maxVersion = '';
            if (minAppVersion) {
              const appVersion = appVersionList.find(v => v.value === minAppVersion);
              minVersion = appVersion.label;
            }
            if (maxAppVersion) {
              const appVersion = appVersionList.find(v => v.value === maxAppVersion);
              maxVersion = appVersion.label;
            }
            setSearch({
              startDate,
              endDate,
              product,
              platform,
              country,
              source,
              lang,
              isVip,
              maxAppVersion,
              minAppVersion,
              issueType,
              dayType,
              minVersion,
              maxVersion,
            });
          }}
        >
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  );
};

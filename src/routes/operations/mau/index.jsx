import React, { useState, useEffect } from 'react';
import {
  Row, Col, Divider, Statistic, DatePicker,
} from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { getData } from '../../../utils/request';
import { DownLoadButton } from '../../common/DownLoadButton';
import {
  usCountryCode, mfCountryCode, asiaCountryCode,
} from '../../../utils/countryList';

export default () => {
  // const [countryZone, setCountryZone] = useState(countryList);
  const [hzData, setHzData] = useState([]);
  const [phData, setPhData] = useState([]);
  const [inData, setInData] = useState([]);
  const [usData, setUSData] = useState([]);
  const [FLKFData, setFLKFData] = useState([]);
  // const [FLKFData, setFLKFData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [exportDauData, setDauExportData] = useState([]);
  const [month, setMonth] = useState(moment(moment(new Date()).subtract(1, 'months'), 'YYYY-MM'));

  // 页面要显示的 MEAST-FLKF 地区要显示的国家code
  const [mfCountryList, setMfCountryList] = useState([]);
  // 页面要显示的 US 地区要显示的国家code
  const [usCountryList, setUsCountryList] = useState([]);
  // 页面要显示的 ASIA 地区要显示的国家code
  const [asiaCountryList, setAsiaCountryList] = useState([]);

  const getHzData = async () => {
    const countryList = await getData(`
    select  country_name,country_code_2 as country_code from 
      dim_pub_log_country_code
    `);

    // asia 区域
    const phBaseCoutryList = ['PH', 'JP', 'SG', 'TW', 'HK', 'MY'];
    const [...asisCountryLists] = new Set([...phBaseCoutryList, ...asiaCountryCode]);
    // const phCountry = countryList
    //   .filter(v => ['PH', 'JP', 'SG', 'TW', 'HK', 'MY'].includes(v.country_code))
    //   .map(v => v.country_name);
    const phCountry = countryList
      .filter(v => asisCountryLists.includes(v.country_code))
      .map(v => v.country_name);
      // 设置要在页面上显示的国家code
    setAsiaCountryList(asisCountryLists);


    const inCountry = countryList.filter(v => ['IN'].includes(v.country_code)).map(v => v.country_name);

    // 除去重复的国家code
    const [...usCountryLists] = new Set([...usCountryCode, ...['BR', 'US']]);
    // 设置 ul要显示的 国家code
    setUsCountryList(usCountryLists);
    // const usCountry = countryList.filter(v => ['BR', 'US'].includes(v.country_code)).map(v => v.country_name);

    // 查找国家的名称
    const usCountry = countryList.filter(v => usCountryLists.includes(v.country_code)).map(v => v.country_name);

    const fkBaseCountryList = [
      'SA',
      'AG',
      'BH',
      'IL',
      'IQ',
      'IR',
      'AE',
      'JO',
      'KW',
      'LB',
      'OM',
      'YE',
      'PS',
      'QA',
      'MA',
      'DZ',
      'EG',
      'TN',
      'LY',
      'SY',
      'IE',
      'EE',
      'AT',
      'BG',
      'BE',
      'PL',
      'DK',
      'DE',
      'FR',
      'FI',
      'NL',
      'CZ',
      'HR',
      'LV',
      'LT',
      'LU',
      'RO',
      'MT',
      'PT',
      'SE',
      'CY',
      'SK',
      'SI',
      'ES',
      'GR',
      'HU',
      'IT',
      'AL',
      'AZ',
      'BY',
      'IS',
      'BA',
      'RU',
      'MK',
      'MD',
      'NO',
      'CH',
      'UA',
      'GB',
      'GEO',
      'MNE',
      'SRB',
      'YK',
    ];
    // 去除重复的 国家code
    const [...mfCountryLists] = new Set([...mfCountryCode, ...fkBaseCountryList]);
    // 设置要显示的 国家代码
    setMfCountryList(mfCountryLists);
    // const fkCountry = countryList
    // .filter(v => fkBaseCountryList.includes(v.country_code))
    // .map(v => v.country_name);
    const fkCountry = countryList
      .filter(v => mfCountryLists.includes(v.country_code))
      .map(v => v.country_name);

    const res = await getData(`
    select sum(mau) as mau,type 
    from vcm_app_comm_daliy_data
    where country = '中国'
    and bizdate = '${moment(month)
    .endOf('day')
    .format('YYYYMMDD')}'
    group by type order by type
    `);
    const DauRes = await getData(`
    select sum(dau) as dau,type, bizdate 
    from vcm_app_comm_daliy_data
    where country = '中国'
    and bizdate >= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}01'
    and bizdate <= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}31'
    group by bizdate, type order by bizdate
    `);
    console.log('DauRes', DauRes);
    setHzData(res);

    const resPh = await getData(`
    select sum(mau) as mau,type 
    from vcm_app_comm_daliy_data
    where country in (${phCountry.map(v => `'${v}'`).join(',')})
    and bizdate = '${moment(month)
    .endOf('day')
    .format('YYYYMMDD')}'
    group by type order by type
    `);
    const DauPhRes = await getData(`
    select sum(dau) as dau,type, bizdate 
    from vcm_app_comm_daliy_data
    where country in (${phCountry.map(v => `'${v}'`).join(',')})
    and bizdate >= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}01'
    and bizdate <= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}31'
    group by bizdate, type order by bizdate
    `);
    setPhData(resPh);

    const resVid = await getData(`
    SELECT  active_dvc_cnt_1m AS mau
        ,app_active_dvc_cnt_1m AS app_mau
        ,ds
    FROM    rpt_vid_itr_idx_1m
    WHERE   ds >= '${moment(month).format('YYYYMM')}01'
    AND     ds <= '${moment(month).format('YYYYMM')}31'
    AND     product_id = 6
    ORDER BY ds ASC
    LIMIT   1000
    ;
    `);

    const DauResVid = await getData(`
    select  active_dvc_cnt_1d as dau
        ,ds as bizdate
      from    rpt_vid_itr_idx_1d
      where   ds <= '${moment(month).format('YYYYMM')}31'
      and     ds >= '${moment(month).format('YYYYMM')}01'
      order by ds 
    ;
    `);

    // console.log('resVid', resVid);

    const resIn = await getData(`
    select sum(mau) as mau,type 
    from vcm_app_comm_daliy_data
    where country in (${inCountry.map(v => `'${v}'`).join(',')})
    and bizdate = '${moment(month)
    .endOf('day')
    .format('YYYYMMDD')}'
    group by type order by type
    `);
    const DauInRes = await getData(`
    select sum(dau) as dau,type, bizdate 
    from vcm_app_comm_daliy_data
    where country in (${inCountry.map(v => `'${v}'`).join(',')})
    and bizdate >= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}01'
    and bizdate <= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}31'
    group by bizdate, type order by bizdate
    `);
    if (resVid.length) {
      resIn.push({
        mau: resVid[0].mau,
        type: 'vid',
      });
    }
    if (DauResVid.length) {
      DauResVid.map((v) => {
        DauInRes.push({ ...v, type: 'vid' });
      });
    }
    // 某些产品印度没有数据，保证数据总行数一致
    // if (resIn.length !== resPh.length) {
    //   let resInNew = [];
    //   resPh.forEach((element) => {
    //     const arr = resIn.filter(item => item.type === element.type);
    //     if (arr.length) {
    //       resInNew = resInNew.concat(arr);
    //     } else {
    //       resInNew = resInNew.concat([{ mau: 0, type: element.type }]);
    //     }
    //   });
    //   setInData(resInNew);
    // } else {
    setInData(resIn);
    // }

    const resUs = await getData(`
    select sum(mau) as mau,type 
    from vcm_app_comm_daliy_data
    where country in (${usCountry.map(v => `'${v}'`).join(',')})
    and bizdate = '${moment(month)
    .endOf('day')
    .format('YYYYMMDD')}'
    group by type order by type
    `);
    const DauUsRes = await getData(`
    select sum(dau) as dau,type, bizdate 
    from vcm_app_comm_daliy_data
    where country in (${usCountry.map(v => `'${v}'`).join(',')})
    and bizdate >= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}01'
    and bizdate <= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}31'
    group by bizdate, type order by bizdate
    `);
    setUSData(resUs);

    const resFk = await getData(`
    select sum(mau) as mau,type 
    from vcm_app_comm_daliy_data
    where country in (${fkCountry.map(v => `'${v}'`).join(',')})
    and bizdate = '${moment(month)
    .endOf('day')
    .format('YYYYMMDD')}'
    group by type order by type
    `);
    const DauFkRes = await getData(`
    select sum(dau) as dau,type, bizdate 
    from vcm_app_comm_daliy_data
    where country in (${fkCountry.map(v => `'${v}'`).join(',')})
    and bizdate >= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}01'
    and bizdate <= '${moment(month)
    .endOf('day')
    .format('YYYYMM')}31'
    group by bizdate, type order by bizdate
    `);
    setFLKFData(resFk);

    const data = res
      .map(v => ({
        ...v,
        zone: 'HZ',
      }))
      .concat(
        resPh.map(v => ({
          ...v,
          zone: 'ASIA1',
        })),
      )
      .concat(
        resUs.map(v => ({
          ...v,
          zone: 'US',
        })),
      )
      .concat(
        resIn.map(v => ({
          ...v,
          zone: 'IN',
        })),
      )
      .concat(
        resFk.map(v => ({
          ...v,
          zone: 'MEAST-FLKF',
        })),
      );

    const dauData = DauRes.map(v => ({
      ...v,
      zone: 'HZ',
    }))
      .concat(
        DauPhRes.map(v => ({
          ...v,
          zone: 'ASIA1',
        })),
      )
      .concat(
        DauInRes.map(v => ({
          ...v,
          zone: 'IN',
        })),
      )
      .concat(
        DauUsRes.map(v => ({
          ...v,
          zone: 'US',
        })),
      )
      .concat(
        DauFkRes.map(v => ({
          ...v,
          zone: 'MEAST-FLKF',
        })),
      );
    setDauExportData(dauData);
    setExportData(data);
    console.log(dauData);
    // console.log('asia', phCountry);
    // console.log('mf', fkCountry);
    // console.log('us', usCountry);
  };

  useEffect(() => {
    getHzData();
  }, [month]);
  return (
    <div style={{ margin: 20 }}>
      <DownLoadButton
        filename="mau"
        data={exportData}
        columns={[{ title: 'zone', key: 'zone' }, { title: '产品', key: 'type' }, { title: 'mau', key: 'mau' }]}
      />
      <DownLoadButton
        filename="dau"
        data={exportDauData}
        title="dau"
        columns={[
          { title: 'zone', key: 'zone' },
          { title: '产品', key: 'type' },
          { title: 'dau', key: 'dau' },
          { title: 'day', key: 'bizdate' },
        ]}
      />
      <DatePicker.MonthPicker locale={locale} value={month} onChange={setMonth} />
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={4}>
          <h3>HZ</h3>
          <span>CN</span>
        </Col>
        <Col span={6}>
          <h3>ASIA1</h3>
          {/* <span style={{ wordBreak: 'break-all' }}>PH,JP,SG,TW,HK,MY</span> */}
          <span style={{ wordBreak: 'break-all' }}>{asiaCountryList.join(',')}</span>
        </Col>
        <Col span={4}>
          <h3>US</h3>
          {/* <span style={{ wordBreak: 'break-all' }}>BR,US</span> */}
          <span style={{ wordBreak: 'break-all' }}>{usCountryList.join(',')}</span>
        </Col>
        <Col span={4}>
          <h3>IN</h3>
          <span>IN</span>
        </Col>
        <Col span={6}>
          <h3>MEAST-FLKF</h3>
          {/* <span style={{ wordBreak: 'break-all' }}>
            SA,AG,BH,IL,IQ,IR,AE,JO, OM,YE,PS,QA,MA,DZ,,KW,LB, EG,TN,LY,SY,IE,EE,AT,BG,BE, PL,DK,DE,FR,FI,NL,CZ,HR,LV,
            LT,LU,RO, MT,PT,SE,CY,SK,SI, ES,GR,HU,IT,AL,AZ,BY,IS,BA,RU, MK,MD,NO,CH,UA,GB,GEO,MNE,SRB,YK
          </span> */}
          <span style={{ wordBreak: 'break-all' }}>
            {mfCountryList.join(',')}
          </span>
        </Col>
      </Row>
      <Divider />
      <Row gutter={24}>
        <Col span={4}>
          {hzData.map(v => (
            <div>
              <Statistic title={v.type} value={v.mau} />
              <Divider />
            </div>
          ))}
        </Col>
        <Col span={6}>
          {phData.map(v => (
            <div>
              <Statistic title={v.type} value={v.mau} />
              <Divider />
            </div>
          ))}
        </Col>
        <Col span={4}>
          {usData.map(v => (
            <div>
              <Statistic title={v.type} value={v.mau} />
              <Divider />
            </div>
          ))}
        </Col>
        <Col span={4}>
          {inData.map(v => (
            <div>
              <Statistic title={v.type} value={v.mau} />
              <Divider />
            </div>
          ))}
        </Col>
        <Col span={6}>
          {FLKFData.map(v => (
            <div>
              <Statistic title={v.type} value={v.mau} />
              <Divider />
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};

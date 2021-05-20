/*
 * @Date: 2021-02-25 14:45:50
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-25 16:52:17
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table, Radio,
} from 'antd';
import styles from './styles/index.less';
import Query from './components/Query';
import { productMap } from './const';
import {
  getListSQL, getMonthListSQL, dauListSQL, dauMonthListSQL, usrn1dListSQL, usrn1dMonthListSQL,
} from './components/sqlTemplate';
import { getData, getHoloData } from '../../../utils/request';
import { DownLoadButton } from '../../common/DownLoadButton';

/*
校验流程：
1：用户上传Excel，解析成json arr 存放rc.quvidep.vip/cdn/gh/{uuid}.json
2：将当前记录保存至数据库
3：校验流程：
    a：获取爬虫数据，比对偏差金额，计算偏差率
    b：提交审批，审批通过后，当月数据不允许变更及提交当月的数据
*/

export default () => {
  const [spinning, setSpinning] = useState(false);
  const [dayType, setDayType] = useState('1');
  const [dataList, setDataList] = useState([]);
  const [search, setSearch] = useState({
    product: '',
    platform: '',
    vip: '',
    userType: '',
    countries: [],
    mediaSources: [],
    versions: [],
    campaignName: [],
    groupBy: 'platform',
    startDate: moment().subtract(7, 'days'),
    endDate: moment().subtract(1, 'days'),
  });

  const onSearch = async (params) => {
    console.log('params', params);
    setSearch(params);
  };

  const getWheres = () => {
    const {
      campaignName,
      countries,
      // endDate,
      mediaSources,
      platform,
      product,
      // startDate,
      userType,
    } = search;
    let where = ' ';
    let where2 = ' ';
    let where3 = ' ';
    let where4 = ' ';
    if (product) {
      where += ` and product_id=${product} `;
      where2 += ` and product_id=${product} `;
      where3 += ` and product_id=${product} `;
      where4 += ` and product_id=${product} `;
    }
    if (platform) {
      where += ` and platform = ${platform} `;
      where2 += ` and platform = ${platform} `;
      where3 += ` and platform = ${platform} `;
      where4 += ` and platform = ${platform} `;
    }
    if (userType) {
      where += ` and new_user = ${userType} `;
      where3 += ` and user_type = ${userType === '0' ? 2 : userType} `;
      where4 += ` and user_type = ${userType === '0' ? 2 : userType} `;
    }
    if (mediaSources && mediaSources.length > 0) {
      where += ` and media_source in (${mediaSources.map(v => `'${v}'`).join(',')}) `;
      where2 += ` and media_source in (${mediaSources.map(v => `'${v}'`).join(',')}) `;
      where3 += ` and media_source in (${mediaSources.map(v => `'${v}'`).join(',')}) `;
      where4 += ` and media_source in (${mediaSources.map(v => `'${v}'`).join(',')}) `;
    }
    if (campaignName && campaignName.length > 0) {
      // console.log('ca', campaignName);
      where += decodeURIComponent(encodeURIComponent(` and campaign_name in (${campaignName.map(v => `'${v}'`).join(',')}) `).replace(/%24%24/g, '######'));
      where2 += decodeURIComponent(encodeURIComponent(` and campaign_name in (${campaignName.map(v => `'${v}'`).join(',')}) `).replace(/%24%24/g, '######'));
    }
    if (countries.length) {
      where += ` and country in (${countries.map(v => `'${v}'`).join(',')})`;
      where2 += ` and country_name in (${countries.map(v => `'${v}'`).join(',')})`;
      where3 += ` and country in (${countries.map(v => `'${v}'`).join(',')})`;
      where4 += ` and country in (${countries.map(v => `'${v}'`).join(',')})`;
    }
    return {
      where, where2, where3, where4,
    };
  };

  const getFetchData = async () => {
    const dateFormat = 'YYYYMMDD';
    const {
      where, where2, where3, where4,
    } = getWheres();
    // console.log('wherewhere', where);
    const { startDate, endDate } = search;
    setSpinning(true);
    const sql = dayType === '1' ? getListSQL.replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat))
      .replace(/#where#/g, where)
      .replace(/#where2#/g, where2)
      .replace(/#where3#/g, where3)
      .replace(/#where4#/g, where4)
      .replace(/###/g, '$')
      .replace(/###/g, '$') : getMonthListSQL.replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat))
      .replace(/#where#/g, where)
      .replace(/#where2#/g, where2)
      .replace(/#where3#/g, where3)
      .replace(/#where4#/g, where4)
      .replace(/###/g, '$')
      .replace(/###/g, '$');
    console.log('sql', sql);
    const res = await getData(sql);
    console.log('getData', res);
    const dauSql = dayType === '1' ? dauListSQL.replace(/#where4#/g, where4).replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat)) : dauMonthListSQL.replace(/#where4#/g, where4).replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat));
    console.log('dauSql', dauSql);
    const holoDauRes = await getData(dauSql);

    // console.log('holoRes', holoDauRes);
    const dauMap = {};

    for (let index = 0; index < holoDauRes.length; index++) {
      const element = holoDauRes[index];
      dauMap[`${element.product_id}-${element.platform}-${element.ds}`] = +element.dau || 0;
    }

    const usrn1dSql = dayType === '1' ? usrn1dListSQL.replace(/#where3#/g, where3).replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat)) : usrn1dMonthListSQL.replace(/#where3#/g, where3).replace(/#startDate#/g, moment(startDate).format(dateFormat))
      .replace(/#endDate#/g, moment(endDate).format(dateFormat));
    const holoUsrn1dRes = await getHoloData(usrn1dSql);
    // console.log('holoUsrn1dRes', holoUsrn1dRes);
    const usrn1dMap = {};
    for (let index = 0; index < holoUsrn1dRes.length; index++) {
      const element = holoUsrn1dRes[index];
      usrn1dMap[`${element.product_id}-${element.platform}-${element.ds}`] = +element.act_bef_1d_cnt || 0;
    }
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      element.dau = dauMap[`${element.product_id}-${element.platform}-${element.ds}`];
      element.act_bef_1d_cnt = usrn1dMap[`${element.product_id}-${element.platform}-${element.ds}`];
      element.stay_1 = (element.act_bef_1d_cnt && element.dau) ? `${(element.act_bef_1d_cnt / element.dau * 100).toFixed(2)}%` : 0;
      element.home_click_rate = (element.home_click_dvc_cnt && element.home_view_dvc_cnt) ? `${(element.home_click_dvc_cnt / element.home_view_dvc_cnt * 100).toFixed(2)}%` : 0;
      element.make_rate = (element.make_button_click_dvc_cnt && element.template_view_dvc_cnt) ? `${(element.make_button_click_dvc_cnt / element.template_view_dvc_cnt * 100).toFixed(2)}%` : 0;
      // 修改计算公式
      // element.save_rate = (element.share_dvc_cnt && element.make_button_click_dvc_cnt) ? `${(element.share_dvc_cnt / element.make_button_click_dvc_cnt * 100).toFixed(2)}%` : 0;
      element.save_rate = (element.share_dvc_cnt && element.make_button_click_dvc_cnt) ? `${(element.save_dvc_cnt / element.template_make_dvc_cnt * 100).toFixed(2)}%` : 0;

      element.success_rate = (element.save_dvc_cnt && element.home_view_dvc_cnt) ? `${(element.save_dvc_cnt / element.home_view_dvc_cnt * 100).toFixed(2)}%` : 0;
      element.share_rate = (element.share_dvc_cnt && element.save_dvc_cnt) ? `${(element.share_dvc_cnt / element.save_dvc_cnt * 100).toFixed(2)}%` : 0;
      element['save/dau'] = (element.save_dvc_cnt && element.dau) ? `${(element.save_dvc_cnt / element.dau * 100).toFixed(2)}%` : 0;
      element['install/dau'] = (element.install_num && element.dau) ? `${(element.install_num / element.dau * 100).toFixed(2)}%` : 0;
      element['share/dau'] = (element.share_dvc_cnt && element.dau) ? `${(element.share_dvc_cnt / element.dau * 100).toFixed(2)}%` : 0;
      element['share/install'] = (element.share_dvc_cnt && element.install_num) ? `${(element.share_dvc_cnt / element.install_num * 100).toFixed(2)}%` : 0;
      element['save/install'] = (element.save_dvc_cnt && element.install_num) ? `${(element.save_dvc_cnt / element.install_num * 100).toFixed(2)}%` : 0;
      // 人均制作
      // element['make_button_click_cnt/template_make_dvc_cnt'] = (element.template_make_cnt && element.template_make_dvc_cnt) ? `${(element.template_make_cnt / element.template_make_dvc_cnt * 100).toFixed(2)}%` : 0;
      element['make_button_click_cnt/template_make_dvc_cnt'] = (element.template_make_cnt && element.template_make_dvc_cnt) ? `${(element.template_make_cnt / element.template_make_dvc_cnt).toFixed(2)}` : 0;
      // 人均保存
      // element['save_cnt/save_dvc_cnt'] = (element.save_cnt && element.save_dvc_cnt) ? `${(element.save_cnt / element.save_dvc_cnt * 100).toFixed(2)}%` : 0;
      element['save_cnt/save_dvc_cnt'] = (element.save_cnt && element.save_dvc_cnt) ? `${(element.save_cnt / element.save_dvc_cnt).toFixed(2)}` : 0;
      // 人均分享
      // element['share_dvc_cnt/share_cnt'] = (element.share_dvc_cnt && element.share_cnt) ? `${(element.share_cnt / element.share_dvc_cnt * 100).toFixed(2)}%` : 0;
      element['share_dvc_cnt/share_cnt'] = (element.share_dvc_cnt && element.share_cnt) ? `${(element.share_cnt / element.share_dvc_cnt).toFixed(2)}` : 0;
      element.key = `${element.ds}-${element.product_id}-${element.platform}`;
    }
    setDataList(res);
    setSpinning(false);
  };

  useEffect(() => {
    getFetchData();
  }, [search, dayType]);
  const columns = [
    {
      title: '日期',
      dataIndex: 'ds',
      key: 'ds',
      width: 100,
      fixed: 'left',
      sorter: (a, b) => a.ds - b.ds,
    },
    {
      title: '产品',
      dataIndex: 'product_id',
      key: 'product_id',
      width: 100,
      fixed: 'left',
      render: text => (text ? productMap[text] : text),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      fixed: 'left',
      width: 100,
      render: text => (text === 1 ? 'Android' : 'iOS'),
    },
    {
      title: '日活',
      dataIndex: 'dau',
      key: 'dau',
      width: 100,
      sorter: (a, b) => a.dau - b.dau,
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '日新增',
      dataIndex: 'install_num',
      key: 'install_num',
      width: 100,
      sorter: (a, b) => a.install_num - b.install_num,
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '次留',
      dataIndex: 'stay_1',
      key: 'stay_1',
      width: 100,
      sorter: (a, b) => parseFloat(a.stay_1) - parseFloat(b.stay_1),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '封面曝光',
      dataIndex: 'home_view_dvc_cnt',
      key: 'home_view_dvc_cnt',
      width: 120,
      sorter: (a, b) => parseFloat(a.home_view_dvc_cnt) - parseFloat(b.home_view_dvc_cnt),
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '封面点击',
      dataIndex: 'home_click_dvc_cnt',
      key: 'home_click_dvc_cnt',
      width: 120,
      sorter: (a, b) => parseFloat(a.home_click_dvc_cnt) - parseFloat(b.home_click_dvc_cnt),
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '封面点击率',
      dataIndex: 'home_click_rate',
      key: 'home_click_rate',
      sorter: (a, b) => parseFloat(a.home_click_rate) - parseFloat(b.home_click_rate),
      width: 120,
      // render: (_text, row) => (row.home_click_cnt / row.home_view_cnt).toFixed(2),
    },
    {
      title: '详情页曝光',
      dataIndex: 'template_view_dvc_cnt',
      key: 'template_view_dvc_cnt',
      width: 120,
      sorter: (a, b) => a.template_view_dvc_cnt - b.template_view_dvc_cnt,
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '素材使用',
      dataIndex: 'make_button_click_dvc_cnt',
      key: 'make_button_click_dvc_cnt',
      width: 120,
      sorter: (a, b) => a.make_button_click_dvc_cnt - b.make_button_click_dvc_cnt,
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '保存率',
      dataIndex: 'save_rate',
      key: 'save_rate',
      width: 100,
      sorter: (a, b) => parseFloat(a.save_rate) - parseFloat(b.save_rate),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '使用率/制作率',
      dataIndex: 'make_rate',
      key: 'make_rate',
      width: 120,
      sorter: (a, b) => parseFloat(a.make_rate) - parseFloat(b.make_rate),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '保存（uv）',
      dataIndex: 'save_dvc_cnt',
      key: 'save_dvc_cnt',
      width: 100,
      sorter: (a, b) => parseFloat(a.save_dvc_cnt) - parseFloat(b.save_dvc_cnt),
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '素材编辑/制作',
      dataIndex: 'template_make_dvc_cnt',
      key: 'template_make_dvc_cnt',
      width: 120,
      sorter: (a, b) => a.template_make_dvc_cnt - b.template_make_dvc_cnt,
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '总完成率',
      dataIndex: 'success_rate',
      key: 'success_rate',
      width: 120,
      sorter: (a, b) => parseFloat(a.success_rate) - parseFloat(b.success_rate),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '分享（uv）',
      dataIndex: 'share_dvc_cnt',
      key: 'share_dvc_cnt',
      width: 120,
      sorter: (a, b) => parseFloat(a.share_dvc_cnt) - parseFloat(b.share_dvc_cnt),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '分享率',
      dataIndex: 'share_rate',
      key: 'share_rate',
      width: 100,
      sorter: (a, b) => parseFloat(a.share_rate) - parseFloat(b.share_rate),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '保存/日活',
      dataIndex: 'save/dau',
      key: 'save/dau',
      width: 120,
      sorter: (a, b) => parseFloat(a['save/dau']) - parseFloat(b['save/dau']),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '保存/新增',
      dataIndex: 'save/install',
      key: 'save/install',
      width: 120,
      sorter: (a, b) => parseFloat(a['save/install']) - parseFloat(b['save/install']),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '分享/日活',
      dataIndex: 'share/dau',
      key: 'share/dau',
      width: 120,
      sorter: (a, b) => parseFloat(a['share/dau']) - parseFloat(b['share/dau']),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '分享/新增',
      dataIndex: 'share/install',
      key: 'share/install',
      width: 120,
      sorter: (a, b) => parseFloat(a['share/install']) - parseFloat(b['share/install']),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '保存（pv）',
      dataIndex: 'save_cnt',
      key: 'save_cnt',
      width: 100,
      sorter: (a, b) => parseFloat(a.save_cnt) - parseFloat(b.save_cnt),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '分享（pv）',
      dataIndex: 'share_cnt',
      key: 'share_cnt',
      width: 100,
      sorter: (a, b) => parseFloat(a.share_cnt) - parseFloat(b.share_cnt),
      render: text => (text ? Number(text) : 0),
    },
    {
      title: '人均制作（pv/uv）',
      dataIndex: 'make_button_click_cnt/template_make_dvc_cnt',
      key: 'make_button_click_cnt/template_make_dvc_cnt',
      width: 120,
      sorter: (a, b) => parseFloat(a['make_button_click_cnt/template_make_dvc_cnt']) - parseFloat(b['make_button_click_cnt/template_make_dvc_cnt']),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '人均保存（pv/uv）',
      dataIndex: 'save_cnt/save_dvc_cnt',
      key: 'save_cnt/save_dvc_cnt',
      width: 120,
      sorter: (a, b) => parseFloat(a['save_cnt/save_dvc_cnt']) - parseFloat(b['save_cnt/save_dvc_cnt']),
      // render: text => (text ? Number(text) : 0),
    },
    {
      title: '人均分享（pv/uv）',
      dataIndex: 'share_dvc_cnt/share_cnt',
      key: 'share_dvc_cnt/share_cnt',
      width: 120,
      sorter: (a, b) => parseFloat(a['share_dvc_cnt/share_cnt']) - parseFloat(b['share_dvc_cnt/share_cnt']),
      // render: text => (text ? Number(text) : 0),
    },
  ];
  return (
    <div className={styles.wrapper}>
      <Query search={search} onSearch={onSearch} />
      <div>
        <Radio.Group value={dayType} onChange={e => setDayType(e.target.value)}>
          <Radio.Button value="1" key="1">
          日
          </Radio.Button>
          <Radio.Button value="2" key="2">
          月
          </Radio.Button>
        </Radio.Group>
        <DownLoadButton filename="模板汇总数据" columns={columns} data={dataList} />
        <Table columns={columns} dataSource={dataList} loading={spinning} scroll={{ x: 2000 }}/>
      </div>
      {/* <div /> */}
    </div>
  );
};

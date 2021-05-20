import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Tooltip, Icon } from 'antd';
import Query from './components/Query';
import styles from './styles/index.less';
import { getData } from '../../../utils/request';
import {
  installAllSQL,
  installBarSQL,
  installLineSQL,
  saleAllSQL,
  saleBarSQL,
  costAllSQL,
  costBarSQL,
  costLineSQL,
  saleLineSQL,
  adIncomeTotalAllSQL,
  adIncomeTotalBarSQL,
  adIncomeTotalLineSQL,
  allDauBarSQL,
  vidDauLineSQL,
  allDauLineSQL,
  vidDauBarSQL,
  noVidDauBarSQL,
} from './components/sqlTemplate';
import { chartLineRender } from '../../common/chartFunc/chartLineRender';
import { productMapping, productTypeMapping, typeProductMapping } from './const';
import { pieChartRender } from './components/chartRender';

export default () => {
  const [search, setSearch] = useState({
    product: '',
    platform: '',
    countryOpt: 'in',
    countries: [],
    startDate: moment().subtract(31, 'days'),
    endDate: moment().subtract(1, 'days'),
  });
  const [allInstall, setAllInstall] = useState(0);
  const [allSale, setAllSale] = useState(0);
  const [allCost, setAllCost] = useState(0);
  const [adIncomeTotal, setAdIncomeTotal] = useState(0);
  const [dauTotal, setDauTotal] = useState(0);
  const newLineChart = useRef([]);
  const costLineChart = useRef([]);
  const saleFirstLineChart = useRef([]);
  const adIncomeTotalLineChart = useRef([]);
  const dauTotalLineChart = useRef([]);

  const onSearch = async (params) => {
    setSearch(params);
  };

  const getWhere = () => {
    let where = ' where 1=1 ';
    where += ` and ds >='${moment(search.startDate).format('YYYYMMDD')}'`;
    where += ` and ds <='${moment(search.endDate).format('YYYYMMDD')}'`;

    if (search.product) {
      where += ` and product_id in ('${search.product}')`;
    }

    if (search.platform) {
      where += ` and platform in ('${search.platform}')`;
    }

    if (search.countries.length > 0) {
      where += ` and country_name ${search.countryOpt} (${search.countries
        .flat()
        .map(v => `'${v}'`)
        .join()})`;

      // 国家搜索条件为不包含时需要把is null的国家也统计进去
      if (search.countryOpt === 'not in') {
        where += ' and country_name is null';
      }
    }

    return where;
  };

  const getDauWhere = () => {
    let where = ' where 1=1 ';
    where += ` and bizdate >='${moment(search.startDate).format('YYYYMMDD')}'`;
    where += ` and bizdate <='${moment(search.endDate).format('YYYYMMDD')}'`;

    if (search.product) {
      where += ` and type in ('${productTypeMapping[search.product]}')`;
    }

    if (search.platform) {
      where += ` and platform in ('${search.platform}')`;
    }

    if (search.countries.length > 0) {
      where += ` and country ${search.countryOpt} (${search.countries
        .flat()
        .map(v => `'${v}'`)
        .join()})`;

      // 国家搜索条件为不包含时需要把is null的国家也统计进去
      if (search.countryOpt === 'not in') {
        where += ' and country is null';
      }
    }
    let where2 = ' where 1=1 ';
    where2 += ` and ds >='${moment(search.startDate).format('YYYYMMDD')}'`;
    where2 += ` and ds <='${moment(search.endDate).format('YYYYMMDD')}'`;

    return { where1: where, where2 };
  };

  // 获取新增
  const getInstall = async () => {
    const where = getWhere('install');

    const all = await getData(installAllSQL.replace(/#where#/, where));
    setAllInstall(all[0] && Number(all[0].install));

    const bar = await getData(installBarSQL.replace(/#where#/, where));
    pieChartRender(
      (bar || []).map(v => ({
        value: ~~v.install,
        type: productMapping[v.product_id],
      })),
      'installBarChart',
      600,
    );

    const line = await getData(installLineSQL.replace(/#where#/, where));
    newLineChart.current = newLineChart.current.concat(
      (line || []).map(v => ({
        day: moment(String(v.ds), 'YYYYMMDD').format('YYYY-MM-DD'),
        value: ~~v.install,
        type: '新增',
      })),
    );
  };

  // 获取销售额
  const getSale = async () => {
    const where = getWhere('sale');

    const all = await getData(saleAllSQL.replace(/#where#/, where));
    setAllSale(all[0] && Number(all[0].sale));

    const bar = await getData(saleBarSQL.replace(/#where#/, where));
    pieChartRender(
      (bar || []).map(v => ({
        value: ~~v.sale,
        type: productMapping[v.product_id],
      })),
      'saleBarChart',
      600,
    );

    const line = await getData(saleLineSQL.replace(/#where#/, where));
    saleFirstLineChart.current = saleFirstLineChart.current.concat(
      (line || []).map(v => ({
        day: moment(String(v.ds), 'YYYYMMDD').format('YYYY-MM-DD'),
        value: ~~v.sale,
        type: '销售额',
      })),
    );
  };

  // 获取广告花费
  const getCost = async () => {
    const where = getWhere('cost');

    const all = await getData(costAllSQL.replace(/#where#/, where));
    setAllCost(all[0] && Number(all[0].cost));

    const bar = await getData(costBarSQL.replace(/#where#/, where));
    pieChartRender(
      (bar || []).map(v => ({
        value: ~~v.cost,
        type: productMapping[v.product_id],
      })),
      'costBarChart',
      600,
    );

    const line = await getData(costLineSQL.replace(/#where#/, where));
    saleFirstLineChart.current = saleFirstLineChart.current.concat(
      (line || []).map(v => ({
        day: moment(String(v.ds), 'YYYYMMDD').format('YYYY-MM-DD'),
        value: ~~v.new_pay_total,
        type: '首购销售额',
      })),
    );
    costLineChart.current = costLineChart.current.concat(
      (line || []).map(v => ({
        day: moment(String(v.ds), 'YYYYMMDD').format('YYYY-MM-DD'),
        value: ~~v.cost,
        type: '广告花费',
      })),
    );
  };

  // 获取广告花费
  const getAdIncomeTotal = async () => {
    const where = getWhere('ad_income_total');

    const all = await getData(adIncomeTotalAllSQL.replace(/#where#/, where));
    setAdIncomeTotal(all[0] && Number(all[0].ad_income_total));

    const bar = await getData(adIncomeTotalBarSQL.replace(/#where#/, where));
    console.log('bar', bar);
    pieChartRender(
      (bar || []).map(v => ({
        value: ~~v.ad_income_total,
        type: productMapping[v.product_id],
      })),
      'adIncomeTotalBar',
      600,
    );

    const line = await getData(adIncomeTotalLineSQL.replace(/#where#/, where));
    console.log('line', line);
    adIncomeTotalLineChart.current = adIncomeTotalLineChart.current.concat(
      (line || []).map(v => ({
        day: moment(String(v.ds), 'YYYYMMDD').format('YYYY-MM-DD'),
        value: ~~v.ad_income_total,
        type: '广告变现',
      })),
    );
    // console.log('adIncomeTotalLineChart', adIncomeTotalLineChart);
  };

  const sortAllData = (list) => {
    const all = [];
    const productlist = ['10', '15', '16', '18', '2', '3', '33', '35', '36', '39', '41', '42', '43', '44', '50', '51', '6'];
    for (let index = 0; index < productlist.length; index++) {
      const element = productlist[index];
      for (let n = 0; n < list.length; n++) {
        const item = list[n];
        if (item.product === element) {
          all.push(item);
        }
      }
    }
    return all;
  };

  // 获取DAU
  const getDauIncomeTotal = async () => {
    const { where1, where2 } = getDauWhere();
    // console.log('where', where1);
    // console.log('search', search);

    if (search.product === '6') {
      const all = await getData(vidDauBarSQL.replace(/#where2#/, where2));
      // setAdIncomeTotal(all[0] && Number(all[0].ad_income_total));
      let dau = 0;
      all.forEach((item) => {
        dau += item.dau;
        item.product = typeProductMapping[item.type];
      });
      setDauTotal(dau);
      // all = all.sort(a => a.product);
      // console.log('allallall', all);
      // const bar = await getData(adIncomeTotalBarSQL.replace(/#where#/, where));
      // console.log('bar', bar);
      pieChartRender(
        (sortAllData(all) || []).map(v => ({
          value: ~~v.dau,
          type: v.type,
        })),
        'dauBarChart',
        600,
      );
      const line = await getData(vidDauLineSQL.replace(/#where2#/, where2));
      // console.log('line', line);
      dauTotalLineChart.current = dauTotalLineChart.current.concat(
        (line || []).map(v => ({
          day: moment(String(v.ds), 'YYYYMMDD').format('YYYY-MM-DD'),
          value: ~~v.dau,
          type: 'dau',
        })),
      );
    } else if (search.product === '') {
      const all = await getData(allDauBarSQL.replace(/#where1#/, where1).replace(/#where2#/, where2));
      // setAdIncomeTotal(all[0] && Number(all[0].ad_income_total));
      // console.log('searchsearch', search);
      if (search.countries.length > 0 && !search.countries.flat().includes('印度')) {
        // console.log('111');
        all.map((item, index) => {
          // console.log('item.product', item);
          if (item.type === 'vid') {
            // console.log('2222');
            all.splice(index, 1);
          }
        });
      }
      let dau = 0;
      all.forEach((item) => {
        dau += item.dau;
        item.product = typeProductMapping[item.type];
      });

      setDauTotal(dau);
      // console.log('allallall', all);
      // const bar = await getData(adIncomeTotalBarSQL.replace(/#where#/, where));
      // console.log('bar', bar);
      pieChartRender(
        (sortAllData(all) || []).map(v => ({
          value: ~~v.dau,
          type: v.type,
        })),
        'dauBarChart',
        600,
      );
      const line = await getData(allDauLineSQL.replace(/#where1#/, where1));
      const viDline = await getData(vidDauLineSQL.replace(/#where2#/, where2));
      const allLine = [];
      for (let index = 0; index < line.length; index++) {
        const element = line[index];
        const data = {
          ds: element.ds,
          dau: element.dau,
        };
        for (let n = 0; n < viDline.length; n++) {
          const item = viDline[n];
          if (String(item.ds) === element.ds) {
            data.dau += item.dau;
          }
        }
        allLine.push(data);
      }
      // console.log('line', line);
      // console.log('viDline', viDline);
      // console.log('allLine', allLine);
      dauTotalLineChart.current = dauTotalLineChart.current.concat(
        (allLine || []).map(v => ({
          day: moment(String(v.ds), 'YYYYMMDD').format('YYYY-MM-DD'),
          value: ~~v.dau,
          type: 'dau',
        })),
      );
    } else {
      const all = await getData(noVidDauBarSQL.replace(/#where1#/, where1).replace(/#where2#/, where2));
      // setAdIncomeTotal(all[0] && Number(all[0].ad_income_total));
      let dau = 0;
      all.forEach((item) => {
        dau += item.dau;
      });
      setDauTotal(dau);
      // console.log('allallall', all);
      // const bar = await getData(adIncomeTotalBarSQL.replace(/#where#/, where));
      // console.log('bar', bar);
      pieChartRender(
        (all || []).map(v => ({
          value: ~~v.dau,
          type: v.type,
        })),
        'dauBarChart',
        600,
      );
      const line = await getData(allDauLineSQL.replace(/#where1#/, where1));
      // console.log('line', line);
      dauTotalLineChart.current = dauTotalLineChart.current.concat(
        (line || []).map(v => ({
          day: moment(String(v.ds), 'YYYYMMDD').format('YYYY-MM-DD'),
          value: ~~v.dau,
          type: 'dau',
        })),
      );
    }
    // console.log('adIncomeTotalLineChart', adIncomeTotalLineChart);
  };

  const drawLineChart = () => {
    chartLineRender(newLineChart.current, document.getElementById('newChart'), undefined, undefined, ['#14abef']);
    chartLineRender(saleFirstLineChart.current, document.getElementById('saleFirstChart'));
    chartLineRender(costLineChart.current, document.getElementById('costChart'), undefined, undefined, ['#FF7F50']);
    chartLineRender(adIncomeTotalLineChart.current, document.getElementById('adIncomeTotalChart'), undefined, undefined, ['#9661BC']);
    chartLineRender(dauTotalLineChart.current, document.getElementById('dauChart'), undefined, undefined, ['#9661BC']);
  };

  const getAll = async () => {
    saleFirstLineChart.current = [];
    newLineChart.current = [];
    costLineChart.current = [];
    adIncomeTotalLineChart.current = [];
    dauTotalLineChart.current = [];
    await Promise.all([getInstall(), getSale(), getCost(), getAdIncomeTotal(), getDauIncomeTotal()]).then(() => {
      drawLineChart();
    });
  };

  useEffect(() => {
    getAll();
  }, [search]);

  return (
    <div className={styles.body}>
      <Query search={search} onSearch={onSearch} />
      <div className={styles.total}>
        <div>
          <span>总计</span>
          <Tooltip
            overlayStyle={{ maxWidth: 265 }}
            overlay={
              <div>
                <span>
                  1. 新增为服务端新增
                  <br />
                </span>
                <span>
                  2.总销售额已减掉退款
                  <br />
                </span>
                <span>
                  3.首购销售额未减掉退款
                  <br />
                </span>
              </div>
            }
          >
            <Icon style={{ fontSize: 18, marginLeft: 8 }} type="question-circle" />
          </Tooltip>
        </div>
        <div className={styles.totalContent}>
          <div>
            <p>DAU</p>
            <span>{dauTotal > 10000 ? `${(dauTotal / 10000).toFixed(2)}万` : dauTotal.toFixed(2)}</span>
          </div>
          <div>
            <p>总新增</p>
            <span>{allInstall > 10000 ? `${(allInstall / 10000).toFixed(2)}万` : allInstall.toFixed(2)}</span>
          </div>
          <div>
            <p>总销售额</p>
            <span>${allSale > 10000 ? `${(allSale / 10000).toFixed(2)}万` : allSale.toFixed(2)}</span>
          </div>
          <div>
            <p>广告花费</p>
            <span>${allCost > 10000 ? `${(allCost / 10000).toFixed(2)}万` : allCost.toFixed(2)}</span>
          </div>
          <div>
            <p>广告变现</p>
            <span>${adIncomeTotal > 10000 ? `${(adIncomeTotal / 10000).toFixed(2)}万` : adIncomeTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <div>
          <p>dau</p>
          <div id="dauBarChart" />
        </div>
        <div>
          <p>新增</p>
          <div id="installBarChart" />
        </div>
        <div>
          <p>销售额</p>
          <div id="saleBarChart" />
        </div>
        <div>
          <p>广告花费</p>
          <div id="costBarChart" />
        </div>
        <div>
          <p>广告变现</p>
          <div id="adIncomeTotalBar" />
        </div>
      </div>
      <div className={styles.lineChartWrapper}>
        <div>
          <p>DAU</p>
          <div id="dauChart" />
        </div>
        <div>
          <p>新增趋势</p>
          <div id="newChart" />
        </div>
        <div>
          <p>花费趋势</p>
          <div id="costChart" />
        </div>
        <div>
          <p>销售趋势</p>
          <div id="saleFirstChart" />
        </div>
        <div>
          <p>广告变现</p>
          <div id="adIncomeTotalChart" />
        </div>
      </div>
    </div>
  );
};

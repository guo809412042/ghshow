/* eslint-disable no-return-assign */
import moment from 'moment';
import intl from 'react-intl-universal';


export function getSQL(SQL, startDate, endDate, operatorName = [], language = [], dateFormat = 'YYYYMMDD', platform = undefined) {
  let languageList = '';
  let operatorNameList = '';
  operatorName.forEach((i, index) => {
    operatorNameList += `'${i}'`;
    index !== (operatorName.length - 1) && (operatorNameList += ',');
  });
  language.forEach((i, index) => {
    languageList += `'${i}'`;
    index !== (language.length - 1) && (languageList += ',');
  });
  const sql = SQL.replace(/#startDate#/g, moment(startDate)
    .format(dateFormat))
    .replace(/#endDate#/g, moment(endDate)
      .format(dateFormat))
    .replace(/#operator_name#/, operatorNameList ? `and operator_name in (${operatorNameList})` : '')
    .replace(/#language#/, languageList ? `and language in (${languageList})` : '')
    .replace(/#platform#/, platform ? `and platform = '${platform}'` : '');
  return sql;
}

export function sum(data, type) {
  let num = 0;
  data.forEach(v => (v[type] ? num += v[type] : num += 0));
  return parseFloat((num).toFixed(2));
}

export function returnDateFormat(date) {
  return moment(date)
    .format('YYYYMMDD');
}


export function getTableData2(data, startDate, endDate) {
  const dataSource2 = [];
  data.forEach((i) => {
    i.install && dataSource2.push({
      day: `${returnDateFormat(startDate)}-${returnDateFormat(endDate)}`,
      language: i.language,
      install: (i.install).toFixed(2),
      spend: (i.spend).toFixed(2),
      cpi: i.install ? (i.spend / i.install).toFixed(3) : 0,
    });
  });
  return dataSource2;
}

export function getTableData1(data, startDate, endDate, platform) {
  const operators = [];
  const dataSource1 = [];
  let totalInstall = 0;
  let totalSpend = 0;
  for (const i of data) {
    !operators.includes(i.operator_name) && operators.push(i.operator_name);
    totalInstall += i.install;
    totalSpend += i.spend;
  }
  dataSource1.push({
    day: `${returnDateFormat(startDate)}-${returnDateFormat(endDate)}`,
    agent: 'Total',
    language: 'Total',
    install: (totalInstall).toFixed(2),
    spend: (totalSpend).toFixed(2),
    cpi: totalInstall ? (totalSpend / totalInstall).toFixed(3) : 0,
    platform: platform || intl.get('put.all').defaultMessage('全部'),
  });
  for (const i of operators) {
    const list = data.filter(v => v.operator_name === i);
    let spend = 0;
    let install = 0;
    const languages = [];
    list.forEach((v) => {
      spend += v.spend;
      install += v.install;
      !languages.includes(i.language) && languages.push(i.language);
    });
    dataSource1.push({
      day: `${returnDateFormat(startDate)}-${returnDateFormat(endDate)}`,
      agent: i,
      language: 'Total',
      install: (install).toFixed(2),
      spend: (spend).toFixed(2),
      cpi: install ? (spend / install).toFixed(3) : 0,
      platform: platform || intl.get('put.all').defaultMessage('全部'),
    });
  }
  for (const i of data) {
    i.install && dataSource1.push({
      day: `${returnDateFormat(startDate)}-${returnDateFormat(endDate)}`,
      agent: i.operator_name,
      language: i.language,
      install: (i.install).toFixed(2),
      spend: (i.spend).toFixed(2),
      cpi: i.install ? (i.spend / i.install).toFixed(3) : 0,
      platform: i.platform,
    });
  }
  return dataSource1;
}

export const commomColumns = [
  {
    title: 'Language',
    key: 'language',
    dataIndex: 'language',
  },
  {
    title: 'Total Installs',
    key: 'install',
    dataIndex: 'install',
  },
  {
    title: 'Total Spend',
    key: 'spend',
    dataIndex: 'spend',
  },
  {
    title: 'CPI',
    key: 'cpi',
    dataIndex: 'cpi',
  }];

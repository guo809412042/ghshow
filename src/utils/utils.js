/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import moment from 'moment';
import { get } from 'fast-levenshtein';
import xFetch from './xFetch';
import { getConditionValue, getData } from './request';

export const getLang = () => localStorage.getItem('lang') || 'zh-CN';
export function rawCondition(platform) {
  let appVersion = 'Android_AppVersion';
  let channel = 'Android_Channel';
  if (platform === 2) {
    appVersion = 'Ios_AppVersion';
    channel = 'Ios_Channel';
  }
  const country = 'country';
  return { appVersion, channel, country };
}
/**
 * 对对象数组去重，重复条件通过对象的指定 key 判断
 * @param {array} arr 需要去重的数组
 * @param {string} key 去重的依据
 */
export function removeDuplication(arr, key) {
  const temp = [];
  arr.forEach((item) => {
    let flag = true;
    for (let i = 0; i < temp.length; i++) {
      const e = temp[i];
      if (e[key] === item[key]) {
        flag = false;
        break;
      }
    }
    if (flag) {
      temp.push(item);
    }
  });
  return temp;
}
/**
 * 日期格式转换
 * @param {string} dateString 日期字符串
 * @param {string} format 日期格式，默认格式 YYYY-MM-DD
 */
export function dateFormat(dateString, format = 'YYYY-MM-DD') {
  return moment(dateString, 'YYYYMMDD').format(format);
}
/**
 * 获取地区渠道版本
 * @param product 产品
 * @param platform android 1 ios 2
 */
export const getCountryAndAppVersionAndChannel = async (platform, product) => {
  const { country, appVersion, channel } = rawCondition(Number(platform));
  // 获取地区下拉列表选项
  const countryList = await getConditionValue(country, product);
  // 获取版本下拉列表选项
  let appVersionList = await getConditionValue(appVersion, product);
  // 获取渠道下拉列表选项
  const channelList = await getConditionValue(channel, product);
  appVersionList = appVersionList.filter(v => Number(v.key) !== 100298);
  return {
    countryList: removeDuplication(countryList, 'value'),
    appVersionList: removeDuplication(appVersionList, 'value'),
    channelList: removeDuplication(channelList, 'value'),
  };
};

export const selectAttr = {
  showSearch: true,
  allowClear: true,
  optionFilterProp: 'children',
  notFoundContent: '无法找到',
  style: { width: 150, marginRight: '8px' },
};
export const selectAttr1 = {
  showSearch: true,
  allowClear: true,
  optionFilterProp: 'children',
  notFoundContent: '无法找到',
  style: { width: 100, marginRight: '8px' },
};

export const createSql = (sql, startDate, endDate, product, platform) => {
  const fetchSql = sql
    .replace(/#startDate#/g, moment(startDate).format('YYYYMMDD'))
    .replace(/#endDate#/g, moment(endDate).format('YYYYMMDD'))
    .replace(/#product#/g, product)
    .replace(/#platform#/g, platform);
  return fetchSql;
};
export function getBeforeWeek(d, n = 7) {
  d = new Date(d);
  d = +d - 1000 * 60 * 60 * 24 * n;
  d = new Date(d);
  const year = d.getFullYear();
  const mon = d.getMonth() + 1;
  const day = d.getDate();
  const s = `${year}${mon < 10 ? `0${mon}` : mon}${day < 10 ? `0${day}` : day}`;
  return s;
}

export function versionNumber(a) {
  const b = a.replace(/[a-zA-Z]/g, '').replace(/'/, '');
  const num = b.split('.');
  let val = '';
  num.map((i, index) => {
    val += i;
    if ((num.length - 1) !== index) val += '0';
  });
  return Number(val);
  // return parseInt(num[0] * 10000, 10) + parseInt(num[1] * 100, 10) + parseInt(num[2], 10);
}

export function numberTVersion(a) {
  a += '';
  const b = a.replace(/[a-zA-Z]/g, '').replace(/'/g, '');
  // eslint-disable-next-line no-mixed-operators
  let version;
  if (b.length === 7) {
    version = `${parseInt(b / 1000000, 10)}.${parseInt((b % 1000000) / 10000, 10)}.${parseInt(((b % 1000000) % 10000) / 100, 10)}.${parseInt(((b % 1000000) % 10000) % 100, 10)}`;
  } else {
    version = `${parseInt(b / 10000, 10)}.${parseInt((b % 10000) / 100, 10)}.${parseInt((b % 10000) % 100, 10)}`;
  }
  return version;
}

export const getNumber = (a, b, suffix = true, num = 2) => (a && b ? Number(((a * (suffix ? 100 : 1)) / b).toFixed(num)) : 0);

export const getPrecision = (a, b, num = 2) => (a * 1 && b * 1 && a * 1 - b * 1 ? (((a - b) * 100) / b).toFixed(num) : 0);

export const getFixed = (number, num = 2) => Number(Number(number || 0).toFixed(num));

export const createSqlWhere = ({
  sql,
  startDate,
  endDate,
  where,
  day,
  type,
  database,
  denominator,
  molecular,
  product,
  order,
  country,
  platform,
  state,
  dateFormat = 'YYYYMMDD',
  select,
  yestoday = moment().subtract(1, 'days'),
  weekday = moment().subtract(7, 'days'),
  otherWhere = '',
  group,
  query,
  productId,
}) => {
  const fetchSql = sql
    .replace(/#startDate#/g, moment(startDate).format(dateFormat))
    .replace(/#endDate#/g, moment(endDate).format(dateFormat))
    .replace(/#yestoday#/g, moment(yestoday).format(dateFormat))
    .replace(/#weekday#/g, moment(weekday).format(dateFormat))
    .replace(/#where#/g, where)
    .replace(/#database#/g, database)
    .replace(/#product#/g, product)
    .replace(/#denominator#/g, denominator)
    .replace(/#molecular#/g, molecular)
    .replace(/#day#/g, day)
    .replace(/#country#/g, country)
    .replace(/#order#/g, order)
    .replace(/#platform#/g, platform)
    .replace(/#state#/g, state)
    .replace(/#select#/g, select)
    .replace(/#otherWhere#/g, otherWhere)
    .replace(/#group#/g, group)
    .replace(/#type#/g, type)
    .replace(/#query#/g, query)
    .replace(/#product_id#/g, productId);
  return fetchSql;
};

export const getDistincetSQLData = async (name, database, where = '') => {
  const sql = `SELECT DISTINCT(${name})  FROM ${database} where ${name} is not null and ${name} <> '' ${where}`;
  const res = await getData(sql);
  return res;
};
export function sqlDataFormat(sql, startDate, endDate) {
  return sql
    .replace(/#startDate#/g, moment(startDate).format('YYYYMMDD'))
    .replace(/#endDate#/g, moment(endDate).format('YYYYMMDD'));
}

export function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}

export function saveAs(obj, fileName) {
  // 当然可以自定义简单的下载文件实现方式
  const tmpa = document.createElement('a');
  tmpa.download = fileName || '下载';
  tmpa.href = URL.createObjectURL(obj); // 绑定a标签
  tmpa.click(); // 模拟点击实现下载
  setTimeout(() => {
    // 延时释放
    URL.revokeObjectURL(obj); // 用URL.revokeObjectURL()来释放这个object URL
  }, 100);
}

export const dict2List = (dict) => {
  const res = Object.keys(dict).map(item => ({
    value: item,
    label: dict[item],
  }));
  return res;
};

/**
 * 简易的过滤为空的对象，由于util中封装的方法会过滤Symbol
 * @param {Object} obj 需要过滤的对象
 * @param {Array} filterType 过滤类型
 * @param {Array} fieldKeys 对象中特定的key不进行过滤
 */
export const filterEmptyObj = (obj, filterType = [undefined, ''], fieldKeys = []) => {
  const newObj = {};
  for (const key in obj) {
    const v = obj[key];
    if (!filterType.includes(v) || fieldKeys.includes(key)) {
      newObj[key] = v;
    }
  }
  return newObj;
};

const filterKey = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  in: 'IN',
  notIn: 'NOT IN',
  not: '!=',
};
const CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g; // eslint-disable-line no-control-regex
const CHARS_ESCAPE_MAP = {
  '\0': '\\0',
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
  '\x1a': '\\Z',
  '"': '\\"',
  '\'': '\\\'',
  '\\': '\\\\',
};

const myType = (params) => {
  let ty = 'undefined';
  // try {
  ty = Object.prototype.toString.call(params);
  // } catch (error) {
  // return ty;
  // }
  const res = {
    '[object Object]': 'object',
    '[object Array]': 'array',
    '[object String]': 'string',
    '[object Null]': 'null',
    '[object Number]': 'number',
    '[object Undefined]': 'undefined',
    '[object Function]': 'function',
    '[object AsyncFunction]': 'function',
    '[object AsyncGeneratorFunction]': 'function',
    '[object GeneratorFunction]': 'function',
    '[object Boolean]': 'boolean',
    '[object Date]': 'date',
    '[object Location]': 'browser',
    '[object Navigator]': 'browser',
    '[object Window]': 'browser',
    '[object History]': 'browser',
    '[object Screen]': 'browser',
    // '[object HTMLDocument]': 'htmldocument',
    // '[object HTMLDivElement]': 'htmldiv',
    // '[object HTMLCollection]': 'htmltagname',
    // '[object HTMLAnchorElement]': 'htmla',
  };
  // global window
  if (/HTML/.test(ty)) return 'html';
  if (res[ty] !== 'number') return res[ty];
  return (
    {
      Infinity: 'infinity',
      NaN: 'nan',
    }[params.toString()] || res[ty]
  );
};

/**
 * 替换参数中的潜在注入危险字符
 * @param {}
 * @retrun {}
 */
function escapeString(val) {
  // eslint-disable-next-line no-multi-assign
  let chunkIndex = (CHARS_GLOBAL_REGEXP.lastIndex = 0);
  let escapedVal = '';
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = CHARS_GLOBAL_REGEXP.exec(val))) {
    escapedVal += val.slice(chunkIndex, match.index) + CHARS_ESCAPE_MAP[match[0]];
    chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;
  }

  if (chunkIndex === 0) {
    // Nothing was escaped
    return val;
  }

  if (chunkIndex < val.length) {
    return escapedVal + val.slice(chunkIndex);
  }

  return escapedVal;
}

/**
 * where sql 拼接
 * @param {Object} where
 */
function whereStr(where) {
  let { condition, value } = where;
  const { wherefield, column, tablename } = where;
  if (myType(value) === 'undefined') return '';
  // in， not in需要将参数转为数组形式
  if (condition === 'NOT IN') {
    // not in空，等价于1=1
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    if (!Array.isArray(value)) {
      value = [value];
    }
  }
  if (condition === 'IN') {
    // in空，等价于1!=1
    if (typeof value === 'undefined' || value === null) {
      return '1 != 1';
    }
    if (!Array.isArray(value)) {
      value = [value];
    } else if (value.length === 0) {
      return '1 != 1';
    }
  }
  if (Array.isArray(value)) {
    let inString = '';
    // in条件值为空数组时，sql条件也为空
    if (value.length === 0) {
      return inString;
    }
    if (myType(value[0]) !== 'number') {
      value.map((d) => {
        inString = `${inString}'${escapeString(d)}',`;
      });
      inString = `(${inString.substring(0, inString.length - 1)})`;
    } else {
      value.map((d) => {
        inString = `${inString}${escapeString(d)},`;
      });
      inString = `(${inString.substring(0, inString.length - 1)})`;
    }
    if (condition === '=') {
      condition = 'IN';
    }
    value = `${inString}`;
  } else if (myType(value) !== 'number') {
    if (value === null || typeof value === 'undefined') {
      condition = 'IS';
      value = 'NULL';
    } else {
      // 如果条件带列名，表示字段比较，否则是值比较
      value = column ? `\`${value}\`` : `'${escapeString(value)}'`;
    }
  }
  // TODO 整数判断
  return `${tablename ? `${tablename}.` : ''}\`${wherefield}\` ${condition} ${value}`;
}

/**
 * 获取where sql
 * @param {Object} where
 */
export const whereSql = (where) => {
  if (Object.prototype.toString.call(where) !== '[object Object]') {
    return '';
  }
  const whereSqlList = [];
  Object.keys(where).map((index) => {
    // eslint-disable-next-line prefer-const
    let [wherefield, condition, column] = index.split('__');
    condition = filterKey[condition] || '=';
    const sqlStr = whereStr({
      wherefield,
      condition,
      value: where[index],
      column,
    });
    if (sqlStr) {
      whereSqlList.push(sqlStr);
    }
  });
  return whereSqlList.join(' AND ');
};

export function filterString(filterStr, dataList, dataFilterKey) {
  const resultList = [];
  dataList.forEach((e) => {
    const targetStr = e[dataFilterKey].toLowerCase();
    const searchStr = filterStr.toLowerCase();
    const index = targetStr.indexOf(searchStr);
    if (index >= 0) {
      const distance = get(targetStr, searchStr);
      resultList.push({ sim: distance + index * 1000, data: e });
      console.log(distance + index * 1000, e);
    }
  });
  resultList.sort((a, b) => (a.sim > b.sim ? 1 : -1));
  return resultList.map(e => e.data);
}

export function sortStringBySim(filterStr, dataList) {
  const resultList = [];
  dataList.forEach((e) => {
    const targetStr = e.toLowerCase();
    const searchStr = filterStr.toLowerCase();
    const index = targetStr.indexOf(searchStr);
    const distance = get(targetStr, searchStr);
    if (index >= 0) {
      resultList.push({ sim: distance + index * 1000, data: e });
    } else {
      resultList.push({ sim: distance, data: e });
    }
  });
  resultList.sort((a, b) => (a.sim > b.sim ? 1 : -1));
  return resultList.map(e => e.data);
}

/**
 * 单独获取appversion
 * @param product 产品
 * @param platform android 1 ios 2
 */
export const getAppVersion = async (platform, product) => {
  // 获取地区下拉列表选项
  const appVersionList = await xFetch(`https://reports.quvideo.com/appinfo/${platform}?product=${product || 2}`);
  return appVersionList;
};

// 根据url 查找product
export const getProductIdFoURl = () => {
  const index = window.location.href.lastIndexOf('/');
  return window.location.href.slice(index + 1);
};

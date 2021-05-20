import fetch from 'isomorphic-fetch';
import qs from 'qs';
import cookie from 'js-cookie';

/**
 * 生成RequestId
 */
function randomStr() {
  return (
    Math.random()
      .toString(36)
      .slice(7) + Date.now()
  );
}

/**
 * json格式化
 * @param {*} response
 */
function parseJSON(response) {
  if (response.json) {
    return response.json();
  }
  return response;
}

/**
 * 登录校验
 * @param {*} response
 */
function checkLogin(response) {
  if (response.code === 40001) {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`;
  }
  return response;
}

/**
 * 生成 url 签名
 */
const urlSignStr = ({ playload, token, openid }) => {
  const queryDoc = {
    token,
    openid,
    nonce_str: randomStr(),
    timestamp: Date.now(),
    playload,
  };

  let str = '';
  const signObj = window.signOAuth(queryDoc, true);
  queryDoc.sign = signObj.sign;
  ['token', 'playload'].map((item) => {
    delete queryDoc[item];
  });

  Object.keys(queryDoc).map((item) => {
    str += `&${item}=${queryDoc[item]}`;
  });
  str = str.slice(1);
  return str;
};

/**
 * 判断输入数据类型
 * @param {any} params
 */
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
 * 判断是否是空数据 {}, [], Null, '', undefind, Boolean
 * @param {*} obj any
 */
const isEmpty = (obj) => {
  const type = myType(obj);
  // 约定：传入boolean类型，说明实际是有值的
  if (type === 'boolean') return false;
  if (type === 'string') return obj.length === 0;
  if (type === 'nan') return true;
  // if (type === 'array') return obj.length === 0;
  if (type === 'object') return Object.keys(obj).length === 0;
  if (['date', 'html', 'browser', 'number', 'infinity', 'function'].includes(type)) return false;
  if (!obj) return true;
  // return false;
};

/**
 * 检查 obj 中 key 值为空的数据并删除，返回 object
 * @param {Object} obj
 */
const checkObjValue = (obj = {}) => {
  const param = {};
  if (isEmpty(obj) || myType(obj) !== 'object') return param;

  // for in  => Non-enumeration attribute
  // ckObjValue#for-of x 310, 613 ops / sec ±1.00 % (85 runs sampled)
  // ckObjValue#map x 318, 321 ops / sec ±0.50 % (87 runs sampled)
  // Fastest is ckObjValue#map
  // for-of 与 map 效率差不多 (keys arr 缓存与否都一样)

  Object.keys(obj).map((key) => {
    const item = obj[key];
    if (myType(item) === 'object') {
      // deprecated arguments.callee
      param[key] = checkObjValue(item);
    } else if (!isEmpty(item)) {
      param[key] = item;
    }
  });

  return param;
};

const signstr = data => urlSignStr({
  playload: data,
  token: cookie.get('openid'),
  openid: cookie.get('openid'),
});

const urlParams = (url) => {
  const index = url.indexOf('?');
  if (index === -1) {
    return {};
  }

  const str = url.slice(index + 1);
  if (!str) return {};
  const param = qs.parse(str);
  // 筛除空字段
  const filterData = checkObjValue(param);
  return filterData;
};
/**
 * 请求
 * @param {*} url
 * @param {*} opts
 */
export const request = (url, opts) => {
  let headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Request-Id': randomStr(),
  };
  if (opts && opts.headers) {
    headers = Object.assign({}, headers, opts.headers);
  }
  const options = {
    credentials: 'same-origin',
    ...opts,
    headers,
  };
  const method = (options.method || 'GET').toLocaleUpperCase();
  // 声明query & body
  let query = '';
  let body = null;
  let data = options.body || options.data;
  if (myType(data) === 'string') {
    data = qs.parse(data);
  }
  let filterData = checkObjValue(data);

  // 设置query&body
  if (method === 'GET' || method === 'DELETE') {
    const index = url.indexOf('?');
    if (index > -1) {
      filterData = urlParams(url);
      url = url.slice(0, index);
    }
    query = qs.stringify(filterData);
  } else {
    body = filterData;
    options.body = JSON.stringify(body);
    if (options.headers['Content-Type'] !== 'application/json; charset=UTF-8') {
      options.body = qs.stringify(body);
    }
  }
  url = `${url}?${query}&${signstr(filterData)}`;
  return fetch(url, options)
    .then(parseJSON)
    .then(checkLogin);
};

export default request;

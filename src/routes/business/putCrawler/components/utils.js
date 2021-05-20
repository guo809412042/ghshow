/* eslint-disable no-lonely-if */
/* eslint-disable no-cond-assign */
/* eslint-disable no-multi-assign */
/* eslint-disable prefer-const */
import assert from 'assert';

const filterKey = {
  eq: '=', gt: '>', gte: '>=', lt: '<', lte: '<=', in: 'IN', notIn: 'NOT IN', not: '!=',
};
const conditionConf = ['>', '<', '=', '>=', '<=', 'IN', 'NOT IN', '!='];

// eslint-disable-next-line no-useless-escape
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

/**
 * 替换参数中的潜在注入危险字符
 * @param {}
 * @retrun {}
 */
export function escapeString(val) {
  let chunkIndex = (CHARS_GLOBAL_REGEXP.lastIndex = 0);
  let escapedVal = '';
  let match;

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
  let res = {
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
 * where sql 拼接
 * @param {Object} where
 */
export function whereStr(where) {
  let {
    wherefield, condition, value, column, tablename,
  } = where;
  assert.ok(conditionConf.includes(condition), `condition 条件只支持 ${conditionConf.toString()}`);
  assert.ok(wherefield, 'sql字段名不能为空');
  assert(typeof wherefield !== 'symbol', 'sql字段名不能为 Symbol 类型');
  assert(typeof value !== 'symbol', 'sql字段值不能为 Symbol 类型');
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
      if (column) {
        value = `\`${value}\``;
      } else {
        value = `'${escapeString(value)}'`;
      }
    }
  }
  // TODO 整数判断
  return `${tablename ? `${tablename}.` : ''}\`${wherefield}\` ${condition} ${value}`;
}

/**
 * 获取where sql
 * @param {Object} where
 */
export function whereSql(where) {
  if (Object.prototype.toString.call(where) !== '[object Object]') {
    return '';
  }
  const whereSqlList = [];
  Object.keys(where).map((index) => {
    let [wherefield, condition, column] = index.split('__');
    assert(wherefield !== '', 'sql字段名不能为空');
    condition = filterKey[condition] || '=';
    const sqlStr = whereStr({
      wherefield, condition, value: where[index], column,
    });
    if (sqlStr) {
      whereSqlList.push(sqlStr);
    }
  });
  return whereSqlList.join(' AND ');
}

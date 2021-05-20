import moment from 'moment';
export const handleDate = (mapKey, value) => {
  if (!value) {
    return '';
  }
  const [ startDate, endDate ] = value;
  let where = '';
  if (startDate && endDate) {
    const st = moment(startDate).startOf('d').format('YYYYMMDD');
    const et = moment(endDate).endOf('d').format('YYYYMMDD');
    where = ` and ${mapKey} >= "${st}" and ${mapKey} <= "${et}"`;
  }
  return where;
};

export const handleContain = (mapKey, value) => {
  if (!value || !value.length) {
    return '';
  }
  let inStr = '(';
  value.forEach(l => {
    inStr += `'${l}',`;
  })
  inStr = inStr.slice(0, -1) + ')';
  return ` and ${mapKey} in ${inStr}`;
};

export const handleCommon = (list) => {
  if (!list || !list.length) {
    return '';
  }
  let where = ''
  list.forEach(l => {
    const { mapKey, value, } = l;
    if (value && mapKey) {
      where += ` and ${mapKey} = "${value}"`;
    }
  })
  return where;
};

export const handleExpect = (mapKey, value, expect) => {
  if (!value || !mapKey) {
    return '';
  }
  let where = ''
  if (value === expect) {
    where += ` and ${mapKey} = ${expect}`;
  } else {
    where += ` and ${mapKey} <> ${expect}`;
  }
  return where
};

export const formatWhere = (list) => {
  let where = ''
  if (!list || !list.length) {
    return where;
  }

  list.forEach(l => {
    const { key, value, mapKey, list, expect, } = l;
    switch(key) {
      case 'dateRange':
        where += handleDate(mapKey, value);
        break;
      case 'in':
        where += handleContain(mapKey, value);
        break;
      case 'expect':
        where += handleExpect(mapKey, value, expect);
        break;
      default:
        where += handleCommon(list || [{ mapKey, value }]);
    }
  })
  return where;
};

/*
 * @Date: 2021-03-11 15:21:46
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-06 17:07:12
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
const platformList = [
  {
    value: 'iOS',
    label: 'iOS',
  },
  {
    value: 'Android',
    label: 'Android',
  },
  {
    value: 'Android/iOS',
    label: 'Android/iOS',
  },
];

const platformMap = {
  0: 'iOS',
  1: 'Android',
  2: '不限平台',
};

export {
  platformList,
  platformMap,
};

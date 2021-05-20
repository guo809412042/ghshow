/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-08 10:41:56
 * @LastEditTime: 2020-10-10 16:16:35
 * @LastEditors: ssssslf
 */

export const cardList = [
  {
    id: '1',
    title: 'DAU',
    molecular: 'dau',
  },
  {
    id: '2',
    title: 'Android-DAU',
    molecular: 'dau',
    otherWhere: ' and platform = 1',
  },
  {
    id: '3',
    title: 'iOS-DAU',
    molecular: 'dau',
    otherWhere: ' and platform = 2',
  },
  {
    id: '4',
    title: '新增-DAU',
    molecular: 'dau_new_1d',
  },
  {
    id: '5',
    title: 'Android新增-DAU',
    molecular: 'dau_new_1d',
    otherWhere: ' and platform = 1',
  },
  {
    id: '6',
    title: 'iOS新增-DAU',
    molecular: 'dau_new_1d',
    otherWhere: ' and platform = 2',
  },

];

export const MAU_DATA = [
  {
    id: '7',
    title: 'MAU',
    molecular: 'mau',
  },
  {
    id: '71',
    title: 'MAU-国内',
    molecular: 'mau',
    otherWhere: ' and country = \'中国\'',
  },
  {
    id: '72',
    title: 'MAU-海外',
    molecular: 'mau',
    otherWhere: ' and country != \'中国\'',
  },
  {
    id: '8',
    title: 'Android-MAU',
    molecular: 'mau',
    otherWhere: ' and platform = 1',
  },
  {
    id: '9',
    title: 'iOS-MAU',
    molecular: 'mau',
    otherWhere: ' and platform = 2',
  },
];

/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/1/29
 * Time: 上午10:33
 *
 */
import _ from 'lodash';

export const COUNTRY = {
  text: '地区',
  value: 'country_name',
};

export const CHANNEL = {
  text: '渠道',
  value: 'channel',
};

export const VERSION = {
  text: '版本',
  value: 'app_version',
};

export const orderList = [COUNTRY, CHANNEL, VERSION];

export class OrderText {
  static findText(value) {
    const find = _.find(orderList, item => item.value === value);
    if (!find) return null;
    return find.text;
  }

  get orderList() {
    return orderList;
  }
}

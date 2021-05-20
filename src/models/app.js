/*
 * @Date: 2020-03-25 09:51:11
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-01-22 09:38:41
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import cookie from 'js-cookie';
import { getGHData, getData } from '../utils/request';

export default {
  namespace: 'app',
  state: {
    user: JSON.parse(cookie.get('user') || localStorage.getItem('user')),
    product: cookie.get('PRODUCT_ID') || localStorage.getItem('PRODUCT_ID'),
    ghProduct: cookie.get('GH_PRODUCT_ID') || localStorage.getItem('GH_PRODUCT_ID'),
    ghPlatform: cookie.get('GH_PLATFORM') || localStorage.getItem('GH_PLATFORM'),
    graphDefinition: [],
    kpCountryType: [],
  },
  subscriptions: {
    setup({ dispatch }) {
      if (!cookie.get('GH_PRODUCT_ID')) {
        dispatch({
          type: 'setProductAndPlatform',
        });
      }
      dispatch({
        type: 'queryReportsGraphDefinition',
      });
      dispatch({
        type: 'queryKpCountryType',
      });
    },
  },
  effects: {
    * setProductAndPlatform(actions, { put }) {
      cookie.set('GH_PRODUCT_ID', '2');
      cookie.set('GH_PLATFORM', '1');
      yield put({
        type: 'save',
        payload: { ghProduct: '2', ghPlatform: '1' },
      });
    },
    * queryReportsGraphDefinition(actions, { put, call }) {
      const sql = 'select graph_name,graph_definition from reports_graph_definition;';
      const data = yield call(getGHData, { sql });
      yield put({
        type: 'save',
        payload: { graphDefinition: data },
      });
    },
    * queryKpCountryType(actions, { put, call }) {
      const sql = 'select kp_country_type from ads_pub_cld_sale_order_total_df group by kp_country_type';
      const data = yield call(getData, sql);
      console.log('data', data);
      yield put({
        type: 'save',
        payload: { kpCountryType: data },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

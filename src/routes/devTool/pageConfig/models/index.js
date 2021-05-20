/*
 * @Date: 2020-04-23 11:06:01
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2020-04-23 17:56:46
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import { message } from 'antd';
import {
  // eventManage,
  // getEventOption,
  // getappdev,
  getEventModuleConfig,
  // getAllCollectionEvent,
} from '../service';
// import { getConditionValue } from '../../../../utils/request';

// import {
//   defaultProduct,
// } from '../const';

export default {
  namespace: 'pageConfig',

  state: {
    formFields: {
      product: null,
      type: '',
    },

    listData: [],
    listLoading: false,

    classList: [],
    versionList: [],
    appVersionList: [],
    moduleList: [],
    moduleListAll: [],
    tagList: [],

    androidDevList: [],
    iosDevList: [],
    myEventList: [],
  },

  subscriptions: {},

  effects: {
    * listInit(actions, { put, call, select }) {
      yield put({ type: 'showListLoading' });
      const STORE = yield select(state => state.pageConfig);
      try {
        // if (STORE.formFields.collection === 'all') {
        const { data } = yield call(getEventModuleConfig, { ...STORE.formFields });
        yield put({
          type: 'saveData',
          payload: { listData: data },
        });
        // } else {
        //   const { data } = yield call(getAllCollectionEvent, { ...STORE.formFields });
        //   yield put({
        //     type: 'saveData',
        //     payload: { listData: data },
        //   });
        // }
      } catch (err) {
        message.error(err);
      } finally {
        yield put({ type: 'hideListLoading' });
      }
    },
  },

  reducers: {
    saveData(state, action) {
      return { ...state, ...action.payload };
    },
    saveFormFields(state, action) {
      return { ...state, formFields: { ...state.formFields, ...action.payload.data } };
    },
    showListLoading(state) {
      return { ...state, listLoading: true };
    },
    hideListLoading(state) {
      return { ...state, listLoading: false };
    },
  },
};

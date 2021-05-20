import { message } from 'antd';
import {
  eventManage,
  getEventOption,
  // getappdev,
  getAllMyCollectionEvent,
  // getAllCollectionEvent,
} from '../service';
import { getEventModuleConfig } from '../../pageConfig/service';
import { query } from '../../appDeveloper/service';
import { getConditionValue } from '../../../../utils/request';
import {
  getEventTaskEmployeeList,
} from '../../../eventTask/services';

// import {
//   defaultProduct,
// } from '../const';

export default {
  namespace: 'devToolEvent',

  state: {
    formFields: {
      product: null,
      collection: 'all',
    },

    listData: [],
    listLoading: false,

    classList: [],
    versionList: [],
    appVersionList: [],
    moduleList: [],
    moduleListAll: [],
    tagList: [],

    devList: [],
    androidDevList: [],
    iosDevList: [],
    myEventList: [],
    IDpageDict: {},
    IDmoduleDict: {},
    IDcontrolDict: {},
    IDactionDict: {},
    IDpageList: [],
    IDmoduleList: [],
    IDcontrolList: [],
    IDactionList: [],
    employee: [],
  },

  subscriptions: {},

  effects: {
    * initOnce(actions, { put, select, call }) {
      const STORE = yield select(state => state.devToolEvent);
      const { product } = STORE.formFields;
      const { data: devList } = yield call(query, { product });
      const iosDevList = devList.filter(item => item.platform === 2);
      const androidDevList = devList.filter(item => item.platform === 1);
      const ee = yield call(getEventTaskEmployeeList);
      // if (ee.code === 20000) {
      //   setEmployee(ee.data);
      // }
      // const [
      //   {
      //     androidDevList,
      //     iosDevList,
      //   },
      // ] = yield Promise.all([
      //   query({product}),
      // ]);
      const [{ data: IDpage }, { data: IDmodule }, { data: IDcontrol }, { data: IDaction }] = yield Promise.all([getEventModuleConfig({ type: 1, product }), getEventModuleConfig({ type: 2, product }), getEventModuleConfig({ type: 3, product }), getEventModuleConfig({ type: 4, product })]);
      console.log('IDpage', IDpage);
      const IDpageDict = {};
      const IDpageList = IDpage.map((item) => {
        IDpageDict[item.module_key] = item.module_name;
        item.value = item.module_key;
        item.label = item.module_name;
        return item;
      });
      const IDmoduleDict = {};
      const IDmoduleList = IDmodule.map((item) => {
        IDmoduleDict[item.module_key] = item.module_name;
        item.value = item.module_key;
        item.label = item.module_name;
        return item;
      });
      const IDcontrolDict = {};
      const IDcontrolList = IDcontrol.map((item) => {
        IDcontrolDict[item.module_key] = item.module_name;
        item.value = item.module_key;
        item.label = item.module_name;
        return item;
      });
      const IDactionDict = {};
      const IDactionList = IDaction.map((item) => {
        IDactionDict[item.module_key] = item.module_name;
        item.value = item.module_key;
        item.label = item.module_name;
        return item;
      });
      yield put({
        type: 'saveData',
        payload: {
          androidDevList,
          devList,
          iosDevList,
          IDpageDict,
          IDpageList,
          IDmoduleDict,
          IDmoduleList,
          IDcontrolDict,
          IDcontrolList,
          IDactionDict,
          IDactionList,
          employee: ee.data,
        },
      });
    },
    * getMyEvent(actions, { put, call }) {
      const { data } = yield call(getAllMyCollectionEvent);
      yield put({
        type: 'saveData',
        payload: { myEventList: data },
      });
    },
    * initOtherData(actions, { put, select }) {
      const STORE = yield select(state => state.devToolEvent);
      const { product } = STORE.formFields;
      const [
        classList,
        versionList,
        moduleList,
        tagList,
        appVersionList,
      ] = yield Promise.all([
        getEventOption('class_name', product),
        getEventOption('version', product),
        getEventOption('module_name', product),
        getEventOption('tag', product),
        getConditionValue('Android_AppVersion', product),
      ]);
      yield put({
        type: 'saveData',
        payload: {
          classList: classList ? classList.data : [],
          versionList: versionList ? versionList.data : [],
          moduleList: moduleList ? moduleList.data : [],
          moduleListAll: moduleList ? moduleList.data : [],
          tagList: tagList ? tagList.data : [],
          appVersionList: appVersionList || [],
        },
      });
    },
    * listInit(actions, { put, call, select }) {
      yield put({ type: 'showListLoading' });
      const STORE = yield select(state => state.devToolEvent);
      try {
        // if (STORE.formFields.collection === 'all') {
        const { data } = yield call(eventManage, { ...STORE.formFields });
        // 需要区分新增还是修改
        const insertData = [];
        const modifyData = [];
        data.forEach((item) => {
          if (item.data_type === 0) {
            insertData.push(item);
          } else if (item.data_type === 1) {
            modifyData.push(item);
          }
        });
        yield put({
          type: 'saveData',
          payload: { listData: data, insertData, modifyData },
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

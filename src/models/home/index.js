import moment from 'moment';

export default {
  namespace: 'home',
  state: {
    currentDate: moment().subtract(1, 'days'),
    product: '2',
  },
  effects: {},
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

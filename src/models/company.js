import { queryCompany, queryAllCompany } from '../services/company';

export default {
  namespace: 'company',

  state: {
    data: [],
    loading: true,
    list: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCompany, payload);
      if (callback) callback(response);
      // response = response.filter(re => !!re.companyIndex);
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchAll({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAllCompany, payload);
      if (callback) callback(response);
      // response = response.filter(re => !!re.companyIndex);
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getlist(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};

import {
  fetchList,
  fetchGroupList,
  fetchRisk,
  fetchGroupRisk,
  saveGroupRisk,
  saveRisk,
  delRisk,
  delImportRisk,
  delImportRisks,
  delGroupRisk,
  uploadFile,
  downloadModel,
  fetchImportList,
  saveImportRisk,
  updateImportRisk,
  fetchImportRisk,
  fetchRiskList,
  updateScenegroup,
  removeScenegroup,
  fetchScenegroup,
  fetchScenegroupDetail,
  fetchSingleList,
  fetchSingleRisk,
  saveSingleRisk,
  delSingleRisk,
  getModel
} from '../services/model';

export default {
  namespace: 'riskmodel',

  state: {
    companyList: [],
    loading: false,
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchRiskList({ payload, callback }, { call }) {
      const response = yield call(fetchRiskList, payload);
      if (callback) callback(response);
    },
    *fetchImportList({ payload, callback }, { call }) {
      const response = yield call(fetchImportList, payload);
      if (callback) callback(response);
    },
    *fetchGroupList({ payload, callback }, { call, put }) {
      const response = yield call(fetchGroupList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchSingleList({ payload, callback }, { call }) {
      const response = yield call(fetchSingleList, payload);
      if (callback) callback(response);
    },
    *fetchRisk({ payload, callback }, { call }) {
      const response = yield call(fetchRisk, payload);
      if (callback) callback(response);
    },
    *fetchImportRisk({ payload, callback }, { call }) {
      const response = yield call(fetchImportRisk, payload);
      if (callback) callback(response);
    },
    *fetchGroupRisk({ payload, callback }, { call, put }) {
      const response = yield call(fetchGroupRisk, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *saveRisk({ payload, callback }, { call }) {
      const response = yield call(saveRisk, payload);
      if (callback) callback(response);
    },
    *saveImportRisk({ payload, callback }, { call }) {
      const response = yield call(saveImportRisk, payload);
      if (callback) callback(response);
    },
    *updateImportRisk({ payload, callback }, { call }) {
      const response = yield call(updateImportRisk, payload);
      if (callback) callback(response);
    },
    *delRisk({ payload, callback }, { call }) {
      const response = yield call(delRisk, payload);
      if (callback) callback(response);
    },
    *delImportRisk({ payload, callback }, { call }) {
      const response = yield call(delImportRisk, payload);
      if (callback) callback(response);
    },
    *delImportRisks({ payload, callback }, { call }) {
      const response = yield call(delImportRisks, payload);
      if (callback) callback(response);
    },
    *saveGroupRisk({ payload, callback }, { call, put }) {
      const response = yield call(saveGroupRisk, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *delGroupRisk({ payload, callback }, { call }) {
      const response = yield call(delGroupRisk, payload);
      if (callback) callback(response);
    },
    *uploadFile({ payload, callback }, { call }) {
      const response = yield call(uploadFile, payload);
      if (callback) callback(response);
    },
    *downloadModel({ payload, callback }, { call }) {
      const response = yield call(downloadModel, payload);
      if (callback) callback(response);
    },
    *fetchScenegroup({ payload, callback }, { call }) {
      const response = yield call(fetchScenegroup, payload);
      if (callback) callback(response);
    },
    *updateScenegroup({ payload, callback }, { call }) {
      const response = yield call(updateScenegroup, payload);
      if (callback) callback(response);
    },
    *removeScenegroup({ payload, callback }, { call }) {
      const response = yield call(removeScenegroup, payload);
      if (callback) callback(response);
    },
    *fetchScenegroupDetail({ payload, callback }, { call }) {
      const response = yield call(fetchScenegroupDetail, payload);
      if (callback) callback(response);
    },
    *getModel({ payload, callback }, { call }) {
      const response = yield call(getModel, payload);
      if (callback) callback(response);
    },
    *fetchSingleRisk({ payload, callback }, { call, put }) {
      const response = yield call(fetchSingleRisk, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *saveSingleRisk({ payload, callback }, { call, put }) {
      const response = yield call(saveSingleRisk, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *delSingleRisk({ payload, callback }, { call }) {
      const response = yield call(delSingleRisk, payload);
      if (callback) callback(response);
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

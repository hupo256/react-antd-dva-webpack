import {
  fetchList,
  fetchBatchId,
  saveBatchId,
  exportSample,
  upload,
  checkUpload,
  deleteBatch,
  deleteFile,
  getBatchDetail,
  checkRisk,
  runRisk,
  exportRisk,
  checkRiskStatus,
  fetchRiskList,
  fetchRiskDetail,
  submitFeedback,
  getDruidData
} from '../services/riskControl';

export default {
  namespace: 'riskControl',

  state: {
    loading: false,
  },

  effects: {
    *fetchList({ payload, callback }, { call }) {
      const response = yield call(fetchList, payload);
      if (callback) callback(response);
    },
    *fetchBatchId({ callback }, { call }) {
      const response = yield call(fetchBatchId);
      if (callback) callback(response);
    },
    *saveBatchId({ payload, callback }, { call }) {
      const response = yield call(saveBatchId, payload);
      if (callback) callback(response);
    },
    *getBatchDetail({ payload, callback }, { call }) {
      const response = yield call(getBatchDetail, payload);
      if (callback) callback(response);
    },
    *exportSample({ callback }, { call }) {
      const response = yield call(exportSample);
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call }) {
      const response = yield call(upload, payload);
      if (callback) callback(response);
    },
    *checkUpload({ payload, callback }, { call }) {
      const response = yield call(checkUpload, payload);
      if (callback) callback(response);
    },
    *deleteBatch({ payload, callback }, { call }) {
      const response = yield call(deleteBatch, payload);
      if (callback) callback(response);
    },
    *deleteFile({ payload, callback }, { call }) {
      const response = yield call(deleteFile, payload);
      if (callback) callback(response);
    },
    *checkRisk({ payload, callback }, { call }) {
      const response = yield call(checkRisk, payload);
      if (callback) callback(response);
    },
    *checkRiskStatus({ payload, callback }, { call }) {
      const response = yield call(checkRiskStatus, payload);
      if (callback) callback(response);
    },
    *runRisk({ payload, callback }, { call }) {
      const response = yield call(runRisk, payload);
      if (callback) callback(response);
    },
    *exportRisk({ payload, callback }, { call }) {
      const response = yield call(exportRisk, payload);
      if (callback) callback(response);
    },
    *fetchRiskList({ payload, callback }, { call }) {
      const response = yield call(fetchRiskList, payload);
      if (callback) callback(response);
    },
    *fetchRiskDetail({ payload, callback }, { call }) {
      const response = yield call(fetchRiskDetail, payload);
      if (callback) callback(response);
    },
    *submitFeedback({ payload, callback }, { call }) {
      const response = yield call(submitFeedback, payload);
      if (callback) callback(response);
    },
    *getDruidData({ payload, callback }, { call }) {
      const response = yield call(getDruidData, payload);
      if (callback) callback(response);
    },
  },
};

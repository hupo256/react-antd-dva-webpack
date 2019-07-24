import { routerRedux } from 'dva/router';
// import { stringify } from 'qs';
import { accountLogin, accountLogout } from '@/services/user';
import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
// import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {

    *login({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(accountLogin, payload);
      if (callback) callback(response);
      yield put({
        type: 'changeLoginStatus',
        payload: {...response, name: response.code==='000000'?['审核员']:[]},
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    // *login({ payload }, { call, put }) {
    //   const response = yield call(fakeAccountLogin, payload);
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: response,
    //   });
    //   // Login successfully
    //   if (response.status === 'ok') {
    //     reloadAuthorized();
    //     const urlParams = new URL(window.location.href);
    //     const params = getPageQuery();
    //     let { redirect } = params;
    //     if (redirect) {
    //       const redirectUrlParams = new URL(redirect);
    //       if (redirectUrlParams.origin === urlParams.origin) {
    //         redirect = redirect.substr(urlParams.origin.length);
    //         if (redirect.match(/^\/.*#/)) {
    //           redirect = redirect.substr(redirect.indexOf('#') + 1);
    //         }
    //       } else {
    //         window.location.href = redirect;
    //         return;
    //       }
    //     }
    //     yield put(routerRedux.replace(redirect || '/'));
    //   }
    // },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },
    *logout({ payload }, { call, put }) {
      yield call(accountLogout, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {name: []},
      });
      yield put(routerRedux.push('/user/login'));
    },
    // *logout(_, { put }) {
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: {
    //       status: false,
    //       currentAuthority: 'guest',
    //     },
    //   });
    //   reloadAuthorized();
    //   yield put(
    //     routerRedux.push({
    //       pathname: '/user/login',
    //       search: stringify({
    //         redirect: window.location.href,
    //       }),
    //     })
    //   );
    // },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.name);
      return {
        ...state,
        token: payload.data,
        success: payload.message,
        status: payload.code==='000000',
        type: 'account',
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};

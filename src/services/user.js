import request from '@/utils/request';

// 登入登出
export async function accountLogin(params) {
  return request('/gw/num/login', {
    method: 'POST',
    body: params,
  });
}

export async function accountLogout() {
  return request('/gw/num/logout', {
    method: 'POST',
  });
}

// 修改用户信息
export async function userEdit(params) {
  return request('/gw/num/login/password', {
    method: 'POST',
    body: params,
  });
}

// 查询现有用户信息
export async function queryCurrent() {
  return request('/gw/num/user/userInfo', {
    method: 'GET',
  });
}

// 查询现有用户菜单权限
export async function fetchCurrentPermissions() {
  return request('/gw/num/permission/user/list', {
    method: 'GET',
  });
}

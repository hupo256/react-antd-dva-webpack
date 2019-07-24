import request from '../utils/request';

export async function queryCompany(params) {
  return request('/gw/num/company/companies', {
    method: 'POST',
    body: params,
  });
}

export async function queryAllCompany(params) {
  return request('/gw/num/company/companies/all', {
    method: 'POST',
    body: params,
  });
}

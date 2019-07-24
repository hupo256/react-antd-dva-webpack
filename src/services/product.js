/* eslint-disable import/prefer-default-export */

// import { stringify } from 'qs';
import request from '@/utils/request';

// 公司列表
export async function getCompanyList() {
  return request('/drag/product/companies');
}

// 查询险种列表
export async function queryInsuranceList(params) {
  return request('/drag/insurancetype/templates', {
    method: 'POST',
    body: params,
  });
}

// 查询单个险种
export async function queryInsuranceItem(params) {
  return request(`/drag/insurancetype/template?templateid=${params.templateid}`, {
    method: 'GET',
  });
}

// 查询险种配置字段
export async function queryInsuranceConfigFields(params) {
  return request('/drag/pageconfig/pageitems', {
    method: 'POST',
    body: params,
  });
}
// 查询责任配置字段
export async function queryDutyConfigFields(params) {
  return request('/drag/pageconfig/pageitems', {
    method: 'POST',
    body: params,
  });
}

// 保存产品配置
export async function saveInsuranceItem(params) {
  return request('/drag/insurancetype/template', {
    method: 'POST',
    body: params,
  });
}

// 以下是个单产品配置相关接口

// 个单产品列表
export async function getSingleProductList(params) {
  return request('/drag/product/personalconfigs/page', {
    method: 'POST',
    body: params,
  });
}

// 获取个单单个产品信息
export async function getSingleProductItem(params) {
  return request(`/drag/product/personalconfig?productid=${params.product_id}`, {
    method: 'GET',
  });
}

// 保存个单单个产品
export async function saveSingleProductItem(params) {
  return request('/drag/product/personalconfig', {
    method: 'POST',
    body: params,
  });
}

// 团单相关接口

// 团单产品列表
export async function getGroupProductList(params) {
  return request('/drag/group/organization/page', {
    method: 'POST',
    body: params,
  });
}

// 获取团单单个产品信息
export async function getGroupProductItem(params) {
  return request(`/drag/group/organization?groupid=${params.group_id}`, {
    method: 'GET',
  });
}

// 保存团单单个产品
export async function saveGroupProductItem(params) {
  return request('/drag/group/organization', {
    method: 'POST',
    body: params,
  });
}

// 自定义字段
export async function getCustomFieldList(params) {
  return request('/drag/pageconfig/pageitems/page', {
    method: 'POST',
    body: params,
  });
}

// 获取自定义字段
export async function getFieldItemById(params) {
  return request(`/drag/pageconfig/pageitem?item_id=${params.item_id}`, {
    method: 'GET',
  });
}

// 编辑自定义字段
export async function editFieldItem(params) {
  return request('/drag/pageconfig/pageitem', {
    method: 'POST',
    body: params,
  });
}

// 检测险种代码是否已存在
export async function checkTemplateCode(params) {
  return request('/drag/insurancetype/checktemplate', {
    method: 'POST',
    body: params,
  });
}

// 检测产品代码
export async function checkProductcode(params) {
  return request('/drag/product/checkproductcode', {
    method: 'POST',
    body: params,
  });
}

// 检查团单保单号唯一性
export async function checkPolicyId(params) {
  return request('/drag/group/checkpolicyid', {
    method: 'POST',
    body: params,
  });
}

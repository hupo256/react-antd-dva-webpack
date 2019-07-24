/* eslint-disable import/prefer-default-export */

// import { stringify } from 'qs';
import request from '@/utils/request';

export async function fetchList(params) {
  return request('/cs/risk/findByWhere', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fetchRiskList() {
  return request('/cs/importinsuranceduty/riskscene/list');
}

export async function fetchImportList(params) {
  return request('/cs/importinsuranceduty/findByWhere', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fetchGroupList(params) {
  return request('/cs/organizationrisk/findByWhere', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fetchSingleList(params) {
  return request('/cs/personalrisk/findByWhere', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fetchGroupRisk(params) {
  return request(`/cs/organizationrisk/id/${params}`);
}

export async function fetchSingleRisk(params) {
  return request(`/cs/personalrisk/id/${params}`);
}

export async function fetchRisk(params) {
  return request(`/cs/risk/id/${params}`);
}

export async function fetchImportRisk(params) {
  return request(`/cs/importinsuranceduty/insuranceCode/${params.id}?companyCode=${params.companyCode}`);
}

export async function saveRisk(params) {
  return request('/cs/risk/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function saveImportRisk(params) {
  return request('/cs/importinsuranceduty/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateImportRisk(params) {
  return request('/cs/importinsuranceduty/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function saveGroupRisk(params) {
  return request('/cs/organizationrisk/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function saveSingleRisk(params) {
  return request('/cs/personalrisk/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delRisk(params) {
  return request(`/cs/risk/delete?id=${params}`);
}

export async function delImportRisk(params) {
  return request(`/cs/importinsuranceduty/delete?insuranceCode=${params.id}&companyCode=${params.companyCode}`);
}

export async function delImportRisks(params) {
  return request('/cs/importinsuranceduty/deleteByDutyIds', {
    method: 'POST',
    body: params,
  });
}

export async function delGroupRisk(params) {
  return request(`/cs/organizationrisk/delete?id=${params}`);
}

export async function delSingleRisk(params) {
  return request(`/cs/personalrisk/delete?id=${params}`);
}

export async function downloadModel() {
  return request('/cs/importinsuranceduty/exceltemplatedown');
}

export async function fetchScenegroupDetail(params) {
  return request(`/cs/scenegroup/id/${params}`);
}

export async function removeScenegroup(params) {
  return request(`/cs/scenegroup/delete?id=${params}`);
}

export async function updateScenegroup(params) {
  return request('/cs/scenegroup/save', {
    method: 'POST',
    body: params,
  });
}

export async function fetchScenegroup(params) {
  return request('/cs/scenegroup/findByWhere', {
    method: 'POST',
    body: params,
  });
}

export async function getModel() {
  return request('/cs/model/modellist');
}

function getCookie() {
  const cookie = ` ${document.cookie}`;
  const search = ' access-token=';
  let setStr = null;
  let offset = 0;
  if (cookie.length > 0) {
    offset = cookie.indexOf(search);
    if (offset !== -1) {
      setStr = cookie.substring(offset + 14, offset + 32 + 14);
    }
  }
  return setStr;
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sendHcp', window.location.href.includes('dev'));
  return new Promise(resolve => {
    // eslint-disable-line
    const xmlrequest = new XMLHttpRequest();
    const callback = () => {
      if (xmlrequest.readyState === 4 && xmlrequest.status === 200) {
        resolve(JSON.parse(xmlrequest.response));
      }
    };
    xmlrequest.onreadystatechange = callback;
    xmlrequest.open('POST', `/cs/importinsuranceduty/excelimport`);
    xmlrequest.setRequestHeader('x-um-user-token', getCookie());
    xmlrequest.send(formData);
  });
}

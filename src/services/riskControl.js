import request from '@/utils/request';

export async function fetchList(params) {
  return request('/rc/entrance/batch/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteFile(params) {
  return request('/rc/entrance/batch/delete_file', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteBatch(params) {
  return request('/rc/entrance/batch/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fetchBatchId() {
  return request('/rc/entrance/batch/claim/batch_no');
}

export async function getBatchDetail(payload) {
  return request(
    `/rc/entrance/batch/file/list?companyCode=${payload.companyCode}&batchId=${payload.batchId}`
  );
}

export async function checkUpload(payload) {
  return request(
    `/rc/entrance/status/claim/import/status?companyCode=${payload.companyCode}&batchId=${
      payload.batchId
    }&fileName=${payload.fileName}`
  );
}

export async function checkRiskStatus(payload) {
  return request(
    `/rc/entrance/status/claim/risk/status?batchId=${payload.batchId}`
  );
}

export async function saveBatchId(params) {
  return request('/rc/entrance/batch/claim/batch_info', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function checkRisk(payload) {
  return request(`/rc/entrance/check_risk?batchId=${payload}`);
}

export async function runRisk(params) {
  return request('/rc/entrance/risk', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function exportRisk(params) {
  return request('/rc/entrance/export/risk_report/export', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function exportSample() {
  return request('/rc/entrance/export/template/export', {
    method: 'POST',
  });
}

export async function fetchRiskList(params) {
  return request('/rc/entrance/index/list', {
    method: 'POST',
    body: params,
  });
}

export async function fetchRiskDetail(params) {
  return request('/rc/entrance/index/detail', {
    method: 'POST',
    body: params,
  });
}

export async function submitFeedback(params) {
  return request('/rc/entrance/feedback', {
    method: 'POST',
    body: params,
  });
}

export async function getDruidData(params) {
  return request('/druid', {
    method: 'POST',
    body: params,
  });
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

export async function upload(query) {
  const formData = new FormData();
  formData.append('file', query.file);
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
    xmlrequest.open(
      'POST',
      `/rc/entrance/import/claim/import?batchId=${query.batchId}&companyCode=${
        query.companyCode
      }&fileSize=${query.fileSize}`
    );
    xmlrequest.setRequestHeader('x-um-user-token', getCookie());
    xmlrequest.send(formData);
  });
}

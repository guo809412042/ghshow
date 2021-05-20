import xFetch from '../../../utils/xFetch';
import config from '../../../utils/config';

export { eventManage } from '../../devTool/event/service';

const url = window.location.href.includes('vcm.quvideo.vip')
  ? '//vcm.quvideo.vip/gh/api'
  : '//vcm-qa.quvideo.vip/gh/api';

// const url = `http://0.0.0.0:6090/api`;

export async function getParam() {
  return xFetch(`${url}/event-task/param`, {
    method: 'GET',
  });
}

export async function deleteParam(paramId) {
  return xFetch(`${url}/event-task/param/${paramId}`, {
    method: 'DELETE',
  });
}

export async function addParam(params) {
  return xFetch(`${url}/event-task/param`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function updateParam(id, params) {
  return xFetch(`${url}/event-task/param/${id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function getAlarm() {
  return xFetch(`${url}/event-task/alarm`, {
    method: 'GET',
  });
}

export async function deleteAlarm(id) {
  return xFetch(`${url}/event-task/alarm/${id}`, {
    method: 'DELETE',
  });
}

export async function addAlarm(params) {
  return xFetch(`${url}/event-task/alarm`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getEventTask() {
  return xFetch(`${url}/event-task/task`, {
    method: 'GET',
  });
}

export async function getEventTaskDetail(taskId) {
  return xFetch(`${url}/event-task/task/${taskId}`, {
    method: 'GET',
  });
}

export async function addEventTask(params) {
  return xFetch(`${url}/event-task/task`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function nextEventTaskStatus(taskId) {
  return xFetch(`${url}/event-task/task/${taskId}`, {
    method: 'PUT',
  });
}

export async function getProductListValid() {
  return xFetch(`${url}/dataset/product-info`, {
    method: 'GET',
  }).then((res) => {
    const data = [];
    const ids = [];
    res.data.forEach((item) => {
      if (!ids.includes(item.product_id)) {
        data.push(item);
        ids.push(item.product_id);
      }
    });

    res.data = data;
    return res;
  });
}

export async function getProductVersion(product) {
  const res = await xFetch(`${config.domain}/eventManageSelect/version/?product=${product}`);
  return res;
}

export async function updateEventTask(taskInfo) {
  return xFetch(`${url}/event/updata-event`, {
    method: 'PUT',
    body: JSON.stringify(taskInfo),
  });
}

export async function deleteEventTask(id) {
  return xFetch(`${url}/event-task/task/${id}`, {
    method: 'delete',
  });
}

// 埋点任务-人员管理
export async function getEventTaskEmployeeList() {
  return xFetch(`${url}/event-task/employee`, {
    method: 'GET',
  });
}

export async function addEventTaskEmployee(params) {
  return xFetch(`${url}/event-task/employee`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function deleteEventTaskEmployee(id, params) {
  return xFetch(`${url}/event-task/employee/${id}`, {
    method: 'DELETE',
  });
}

// 产品信息
export async function getProductList() {
  return xFetch(`${url}/dataset/product-info`, {
    method: 'GET',
  });
}

export async function getProductInfo(id) {
  return xFetch(`${url}/dataset/product-info/${id}`, {
    method: 'GET',
  });
}

export async function addProductInfo(params) {
  return xFetch(`${url}/dataset/product-info`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function updateProductInfo(productId, params) {
  return xFetch(`${url}/dataset/product-info/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 审核
export async function getApproveList(id) {
  return xFetch(`${url}/dataset/product-approve/${id}`, {
    method: 'GET',
  });
}

// 审核记录
export async function getApproveRecord(approveId) {
  return xFetch(`${url}/dataset/product-approve-record/${approveId}`, {
    method: 'GET',
  });
}

// 产品线信息
export async function getProductLineList() {
  return xFetch(`${url}/dataset/product-line`, {
    method: 'GET',
  });
}

export async function addProductLine(params) {
  return xFetch(`${url}/dataset/product-line`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function updateProductLine(id, params) {
  return xFetch(`${url}/dataset/product-line/${id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 员工信息
export async function getEmployeeList() {
  return xFetch(`${url}/dataset/employee`, {
    method: 'GET',
  });
}

export async function updateEmployeeList(id, params) {
  return xFetch(`${url}/dataset/employee/${id}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

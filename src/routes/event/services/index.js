import xFetch from '../../../utils/xFetch';


const url = window.location.href.includes('vcm.quvideo.vip')
  ? '//vcm.quvideo.vip/gh/api'
  : '//vcm-qa.quvideo.vip/gh/api';
// const url='//vcm.quvideo.vip/gh/api'
// const url = 'http://0.0.0.0:6090/api';
export async function getEventNameList() {
  return xFetch(`${url}/rel_event_name/list`, {
    method: 'GET',
  });
}


export async function updateName(params) {
  return xFetch(`${url}/rel_event_name/update`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

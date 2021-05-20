/*
 * @Date: 2020-08-25 17:56:47
 * @LastEditors: Neal
 * @LastEditTime: 2020-08-26 20:00:46
 * @Email: feng.chen@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import xFetch from '../../../../utils/xFetch';
import config from '../../../../utils/config';


export function getClass(productId) {
  return xFetch(`${config.domainVcmGh}/api/gpkeyword/class?productId=${productId}`);
}

export function deleteClass(dataId) {
  return xFetch(`${config.domainVcmGh}/api/gpkeyword/class/${dataId}`, {
    method: 'DELETE',
  });
}

export function saveClass(data) {
  return xFetch(`${config.domainVcmGh}/api/gpkeyword/saveclass`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

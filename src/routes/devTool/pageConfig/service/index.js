import qs from 'qs';
import xFetch from '../../../../utils/xFetch';
import { getGHData } from '../../../../utils/request';
import config from '../../../../utils/config';

export async function getEventOption(parmas, product) {
  const res = await xFetch(`${config.domain}/eventManageSelect/${parmas}/?product=${product}`);
  return res;
}

export async function eventManage(option) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/query-event`, {
  // const res = await xFetch('http://10.0.24.196:6090/api/event/query-event', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return res;
}

export async function getappdev() {
  const sqlAndroid = 'SELECT * FROM app_developer WHERE state = 1 AND platform = \'1\'';
  const sqlios = 'SELECT * FROM app_developer WHERE state = 1 AND platform = \'2\'';
  const androidDevList = await getGHData(sqlAndroid);
  const iosDevList = await getGHData(sqlios);
  return {
    androidDevList,
    iosDevList,
  };
}

export async function addEvent(option) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/add-event`, {
  // const res = await xFetch('http://10.0.24.196:6090/api/event/add-event', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return res;
}

export async function removeEvent(parmas) {
  const res = await xFetch(`${config.domain}/removeEvent/${parmas}`);
  return res;
}

export async function getEventModuleConfig(parmas) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/get-event-module-config?${qs.stringify(parmas)}`);
  // const res = await xFetch(`${config.domain}/api/event/get-event-module-config?product=${product}`);
  return res;
}

export async function updataEventModuleConfig(option) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/update-event-module-config`, {
  // const res = await xFetch('http://10.0.24.196:6090/api/event/updata-event', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return res;
}

export async function deleteEventModuleConfig(option) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/delete-event-module-config`, {
  // const res = await xFetch('http://10.0.24.196:6090/api/event/updata-event', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return res;
}

export async function createEventModuleConfig(option) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/create-event-module-config`, {
  // const res = await xFetch('http://10.0.24.196:6090/api/event/updata-event', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return res;
}

export async function updataEvent(option) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/updata-event`, {
  // const res = await xFetch('http://10.0.24.196:6090/api/event/updata-event', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return res;
}

export async function getAllCollectionEvent() {
  const res = await xFetch(`${config.domainVcmGh}/api/event/get-collection-event`);
  // const res = await xFetch('http://10.0.24.196:6090/api/event/get-collection-event');
  return res;
}

export async function getAllMyCollectionEvent() {
  const res = await xFetch(`${config.domainVcmGh}/api/event/get-mycollection-event`);
  // const res = await xFetch('http://10.0.24.196:6090/api/event/get-mycollection-event');
  return res;
}

export async function collectionEvent(option) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/collection-event`, {
  // const res = await xFetch('http://10.0.24.196:6090/api/event/collection-event', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return res;
}

export async function removeCollectionEvent(option) {
  const res = await xFetch(`${config.domainVcmGh}/api/event/remove-collection-event`, {
  // const res = await xFetch('http://10.0.24.196:6090/api/event/remove-collection-event', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return res;
}


export function getDBTable(tableName) {
  return xFetch(`${config.domain}/setting/${tableName}`);
}

export function editTable(sql) {
  const option = { sql };
  return xFetch(`${config.domain}/setting/edit_table`, {
    method: 'POST',
    body: JSON.stringify(option),
  });
}


export function updataHistroyEvent(option) {
  return xFetch(`${config.domain}/updataHistroyEvent/`, {
    method: 'POST',
    body: JSON.stringify(option),
  });
}


export async function getHistroyEvent(event_id, product) {
  const res = await xFetch(`${config.domain}/getHistroyEvent/${event_id}?product=${product}`);
  return res;
}

export function getAllCacheInstance() {
  const sql = 'SELECT cache_template_instance.id as id,'
    + ' cache_template_instance.name as name,'
    + ' cache_template_sql.name as template,'
    + ' cache_template_instance.description as description,'
    + ' `condition`'
    + ' FROM cache_template_instance, cache_template_sql'
    + ' WHERE template_id = cache_template_sql.id'
    + ' ORDER BY id DESC';
  const option = { sql };
  return xFetch(`${config.domain}/setting/edit_table`, {
    method: 'POST',
    body: JSON.stringify(option),
  });
}
export function insertCacheInstance({
  name,
  templateId,
  description,
  condition,
}) {
  const sqlTemplate = `
  INSERT INTO cache_template_instance (name, template_id, description, \`condition\`)
  VALUES ('#name#', '#template_id#', '#description#', '#condition#')
  `;
  const sql = sqlTemplate
    .replace(/#name#/, name)
    .replace(/#template_id#/, templateId)
    .replace(/#description#/, description)
    .replace(/#condition#/, condition);

  const option = { sql };
  return xFetch(`${config.domain}/setting/edit_table`, {
    method: 'POST',
    body: JSON.stringify(option),
  });
}
export function removeCacheInstance(id) {
  const sql = `DELETE FROM cache_template_instance WHERE id = ${id}`;
  const option = { sql };
  return xFetch(`${config.domain}/setting/edit_table`, {
    method: 'POST',
    body: JSON.stringify(option),
  });
}
export function getAllEventSegs() {
  const sql = 'SELECT * FROM event_segment';
  const option = { sql };
  return xFetch(`${config.domain}/setting/edit_table`, {
    method: 'POST',
    body: JSON.stringify(option),
  });
}

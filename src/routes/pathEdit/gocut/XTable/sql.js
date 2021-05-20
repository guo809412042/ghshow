import { formatWhere } from '../../../templateAnalysis/mast/utils';
import { productId } from '../const';

export const getAllCountryListSql = () => {
  return `
    SELECT country fROM ads_pub_log_funnel_event_py_1d
    where product_id = ${productId} and country is not null
    group by country
  `
};

export const getAllVersionListSql = (params) => {
  const { platform = 1, } = params || {};

  return `
    SELECT app_version fROM ads_pub_log_funnel_event_py_1d
    where platform = '${platform}' and product_id = ${productId}
    group by app_version
    order by app_version desc
  `
}

export const getAllMediaSourceListSql = () => {
  return `
    SELECT DISTINCT(media_source) fROM ads_pub_log_funnel_event_py_1d
    where media_source is not null
    and product_id = ${productId}
  `
}

export const getDataSql = (params) => {
  const { date, platform = 1, country, app_version, media_source, new_user } = params || {};
  let funnel_id = 201;
  if (+platform === 2) {
    funnel_id = 202;
  }
  const pList = [
    {
      key: 'dateRange',
      value: date,
      mapKey: 'ds',
    },
    {
      key: 'in',
      value: country,
      mapKey: 'country',
    },
    {
      key: 'in',
      value: app_version,
      mapKey: 'app_version',
    },
    {
      key: 'in',
      value: media_source,
      mapKey: 'media_source',
    },
    {
      key: 'expect',
      value: new_user,
      mapKey: 'new_user',
      expect: 1,
    }
  ];
  const sqlWhere = formatWhere(pList);

  return `
  /*+engine=mpp*/
  SELECT  ds
    ,${platform} as platform
    ,event_name
    ,step
    ,sum(total) as total
  FROM  ads_pub_log_funnel_event_py_1d
  WHERE funnel_id = ${funnel_id} and product_id = ${productId} and platform = '${platform}'
  ${sqlWhere}
  GROUP BY ds,event_name,step
  order by ds desc ,step asc
  ;
  `
};

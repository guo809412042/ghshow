import { formatWhere } from '../../../templateAnalysis/mast/utils';

export const getAllCountryListSql = () => {
  return `
    SELECT country fROM gocut_template_log_statis_1d
    where country is not null
    group by country
  `
};

export const getAllVersionListSql = (params) => {
  const { platform = 1, } = params || {};

  return `
    SELECT app_version fROM gocut_template_log_statis_1d
    where platform = '${platform}'
    group by app_version
    order by app_version desc
  `
}

export const getAllMediaSourceListSql = () => {
  return `
    SELECT DISTINCT(media_source) fROM gocut_template_log_statis_1d
    where media_source is not null
  `
}

export const getDataSql = (params) => {
  const { date, platform, country, app_version, media_source, new_user } = params || {};
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
    ,platform
    ,country
    ,ttid
    ,sum(home_view_dvc_cnt) as home_view_dvc_cnt
    ,sum(home_click_dvc_cnt) as home_click_dvc_cnt
    ,sum(template_view_dvc_cnt) as template_view_dvc_cnt
    ,sum(make_button_click_dvc_cnt) as make_button_click_dvc_cnt
    ,sum(gallery_view_dvc_cnt) as gallery_view_dvc_cnt
    ,sum(template_make_dvc_cnt) as template_make_dvc_cnt
    ,sum(export_dvc_cnt) as export_dvc_cnt
    ,sum(share_dvc_cnt) as share_dvc_cnt
    ,sum(share_cnt) as share_cnt
    ,round(sum(home_click_dvc_cnt) / sum(home_view_dvc_cnt) * 100, 2) as home_click_dvc_cnt_uv_rate
    ,round(sum(make_button_click_dvc_cnt) / sum(template_view_dvc_cnt) * 100, 2) as template_view_dvc_usage_rate
    ,round(sum(template_make_dvc_cnt) / sum(gallery_view_dvc_cnt) * 100, 2) as export_dvc_rate
    ,round(sum(template_make_dvc_cnt) / sum(home_view_dvc_cnt) * 100, 2) as done_rate
    ,round(sum(share_dvc_cnt) / sum(template_make_dvc_cnt) * 100, 2) as share_dvc_rate
    ,round(sum(share_dvc_cnt) / sum(home_view_dvc_cnt) * 100, 2) as share_dvc_rate_total
  FROM gocut_template_log_statis_1d
  WHERE platform = ${platform}
  ${sqlWhere}
  group by ds, platform, country, ttid
  order by ds desc, ttid desc
  limit 5000
  ;
  `
};

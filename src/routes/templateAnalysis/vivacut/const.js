export const coutryList = [
  {
    name: '所有国家',
    value: '',
  },
  {
    name: '美加英澳',
    value: '美加英澳',
  },
  {
    name: '中国',
    value: '中国',
  },
  {
    name: '其他国家',
    value: '其他',
  },
];

export const listView = [
  {
    title: '展示量',
    molecular: 'show_pv',
    suffix: false,
  },
  {
    title: '展示设备数',
    molecular: 'show_uv',
    suffix: false,
  },
  {
    title: '导出量',
    molecular: 'exp_pv',
    suffix: false,
  },
  {
    title: '分享量',
    molecular: 'shr_pv',
    suffix: false,
  },
  {
    title: '分享率',
    molecular: 'shr_pv',
    denominator: 'exp_pv',
    suffix: true,
  },
];

export const chartSql = `
/*self_plus engine=mpp*/
SELECT ds, category, sum(show_pv) AS show_pv, sum(show_uv) AS show_uv
FROM (
  SELECT ds, category
, if(anly_type = 'show', uv, 0) AS show_uv
, if(anly_type = 'show', pv, 0) AS show_pv
FROM dws_vivacut_log_tmpl_cnt_1d
WHERE ds >= #startDate#  AND ds <= #endDate# AND project_id='all' AND category<>'all' #where#
) t
GROUP BY ds, category
`;

export const cardListSql = `
/*self_plus engine=mpp*/
SELECT ds, sum(show_pv) AS show_pv, sum(show_uv) AS show_uv, sum(exp_pv) AS exp_pv, sum(shr_pv) AS shr_pv, sum(shr_uv) AS shr_uv
FROM (
  SELECT ds
, if(anly_type = 'show', uv, 0) AS show_uv
, if(anly_type = 'show', pv, 0) AS show_pv
, if(anly_type = 'exp', uv, 0) AS exp_uv
, if(anly_type = 'exp', pv, 0) AS exp_pv
, if(anly_type = 'shr', uv, 0) AS shr_uv
, if(anly_type = 'shr', pv, 0) AS shr_pv
FROM dws_vivacut_log_tmpl_cnt_1d
WHERE ds >= #startDate#  AND ds <= #endDate# AND project_id='all' AND category='all' #where#
) t
GROUP BY ds
ORDER BY ds DESC 
`;

export const detailPvSql = `
/*self_plus engine=mpp*/
SELECT video_url, project_id, publish_time, category
, is_pro, advertise_lock, order_no, #country# #new_user#
 platform, SUM(exp_pv) AS exp_pv, sum(detail_clk_pv) AS detail_clk_pv
, sum(tub_clk_pv) AS tub_clk_pv, sum(dwnl_pv) AS dwnl_pv, sum(shr_pv) AS shr_pv
, round(SUM(exp_pv) / sum(detail_clk_pv) * 100, 2) AS mk_ratio
, round(SUM(detail_clk_pv) / sum(tub_clk_pv) * 100, 2) AS clk_ratio
, round(SUM(dwnl_pv) / sum(detail_clk_pv) * 100, 2) AS dwnl_ratio
, round(SUM(exp_pv) / sum(dwnl_pv) * 100, 2) AS exp_ratio
, round(SUM(shr_pv) / sum(exp_pv) * 100, 2) AS shr_ratio
FROM (
SELECT ds, video_url, project_id, publish_time, category
, is_pro, advertise_lock, order_no, #new_user# #country#
 platform
, if(anly_type = 'exp', uv, 0) AS exp_uv
, if(anly_type = 'exp', pv, 0) AS exp_pv
, if(anly_type = 'detail_clk', uv, 0) AS detail_clk_uv
, if(anly_type = 'detail_clk', pv, 0) AS detail_clk_pv
, if(anly_type = 'tub_clk', uv, 0) AS tub_clk_uv
, if(anly_type = 'tub_clk', pv, 0) AS tub_clk_pv
, if(anly_type = 'shr', uv, 0) AS shr_uv
, if(anly_type = 'shr', pv, 0) AS shr_pv
, if(anly_type = 'dwnl', uv, 0) AS dwnl_uv
, if(anly_type = 'dwnl', pv, 0) AS dwnl_pv
FROM dws_vivacut_log_tmpl_cnt_1d
WHERE ds >= #startDate#  AND ds <= #endDate# AND project_id <> 'all' #where#
) t
GROUP BY video_url, project_id, publish_time, category, is_pro, advertise_lock, order_no, #country# #new_user# platform
ORDER BY exp_pv DESC 
`;

export const detailUvSql = `
/*self_plus engine=mpp*/
SELECT video_url, project_id, publish_time, category
, is_pro, advertise_lock, order_no, #country# #new_user#
 platform, SUM(exp_uv) AS exp_pv, sum(detail_clk_uv) AS detail_clk_pv
, sum(tub_clk_uv) AS tub_clk_pv, sum(dwnl_uv) AS dwnl_pv, sum(shr_uv) AS shr_pv
, round(SUM(exp_uv) / sum(detail_clk_uv) * 100, 2) AS mk_ratio
, round(SUM(detail_clk_uv) / sum(tub_clk_uv) * 100, 2) AS clk_ratio
, round(SUM(dwnl_uv) / sum(detail_clk_uv) * 100, 2) AS dwnl_ratio
, round(SUM(exp_uv) / sum(dwnl_uv) * 100, 2) AS exp_ratio
, round(SUM(shr_uv) / sum(exp_pv) * 100, 2) AS shr_ratio
FROM (
SELECT ds, video_url, project_id, publish_time, category
, is_pro, advertise_lock, order_no, #new_user# #country#
 platform
, if(anly_type = 'exp', uv, 0) AS exp_uv
, if(anly_type = 'exp', pv, 0) AS exp_pv
, if(anly_type = 'detail_clk', uv, 0) AS detail_clk_uv
, if(anly_type = 'detail_clk', pv, 0) AS detail_clk_pv
, if(anly_type = 'tub_clk', uv, 0) AS tub_clk_uv
, if(anly_type = 'tub_clk', pv, 0) AS tub_clk_pv
, if(anly_type = 'shr', uv, 0) AS shr_uv
, if(anly_type = 'shr', pv, 0) AS shr_pv
, if(anly_type = 'dwnl', uv, 0) AS dwnl_uv
, if(anly_type = 'dwnl', pv, 0) AS dwnl_pv
FROM dws_vivacut_log_tmpl_cnt_1d
WHERE ds >= #startDate#  AND ds <= #endDate# AND project_id <> 'all' #where#
) t
GROUP BY video_url, project_id, publish_time, category, is_pro, advertise_lock, order_no, #country# #new_user# platform
ORDER BY exp_pv DESC 
`;

export const getCategory = 'select category from dws_vivacut_log_tmpl_cnt_1d group by category';

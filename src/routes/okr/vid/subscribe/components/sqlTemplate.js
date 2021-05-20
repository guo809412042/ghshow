/*
 * @Author: zhoutao
 * @Date: 2020-10-09 13:36:22
 * @Copyright(c) QuVideo F2E Team
 * @Email: tao.zhou@quvideo.com
 */

export const subSQL = (isPv = true, groupBy = true) => (`
SELECT 
${
  groupBy ? 'ds,' : ''
  }
sum(${isPv ? 'dau_pv' : 'dau_uv'}) as dau_v,
sum(${isPv ? 'subscribe_pv' : 'subscribe_uv'}) as subscribe_v,
sum(${isPv ? 'click_pv' : 'click_uv'}) as click_v,
sum(${isPv ? 'pchs_pv' : 'pchs_uv'}) as pchs_v,
sum(${isPv ? 'year_pchs_pv' : 'year_pchs_uv'}) as year_pchs_v,
sum(${isPv ? 'month_pchs_pv' : 'month_pchs_uv'}) as month_pchs_v,
sum(${isPv ? 'other_pchs_pv' : 'other_pchs_uv'}) as other_pchs_v
FROM rpt_vid_log_subcp_cnt_1d
WHERE ds >= '#startDate#' and ds <= '#endDate#' #where#
${groupBy ? `
GROUP by ds
ORDER by ds desc
` : ''
  }
`
);

export const fromSourceSQL = `
SELECT from_source
FROM rpt_vid_log_subcp_cnt_1d 
group by from_source`;

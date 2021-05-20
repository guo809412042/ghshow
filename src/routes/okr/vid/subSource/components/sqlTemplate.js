export const getPchsSQL = `
/*self_plus engine=mpp*/
SELECT from_source AS type, pchs_uv1 AS value, 
  ROUND(100 * pchs_uv1 / pchs_uv_all, 2) AS ratio
FROM (
SELECT from_source, SUM(pchs_uv) AS pchs_uv1
FROM rpt_vid_log_subcp_cnt_1d
WHERE ds >= '#startDate#' and ds <= '#endDate#' and from_source <> 'all' #where#
GROUP BY from_source
) t1
LEFT JOIN (
SELECT SUM(pchs_uv) AS pchs_uv_all
FROM rpt_vid_log_subcp_cnt_1d
WHERE ds >= '#startDate#' and ds <= '#endDate#' and from_source <> 'all' #where#
) t2
ON 1 = 1
`;

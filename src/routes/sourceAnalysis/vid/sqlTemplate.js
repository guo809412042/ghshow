// -- 各渠道行为数据
export const channelActionSql = `
SELECT media_source,
SUM( uv)   as uv,
SUM(dau_uv)  as dau_uv,
SUM(community_dau_uv)  as community_dau_uv,
SUM(community_consume_uv)  as community_consume_uv,
SUM(community_shr_uv)  as community_shr_uv,
SUM(describe_uv)  as describe_uv,
SUM(tmpl_dau_uv)  as tmpl_dau_uv,
SUM(tmpl_exp_uv)  as tmpl_exp_uv,
SUM(tmpl_shr_uv)  as tmpl_shr_uv
  FROM rpt_vid_log_dp_cnt_1d
  where   ds >= #startDate#
  and     ds <= #endDate#
   and share_type= 'ALL'
   and media_source<> 'ALL'
#where#
 group by media_source
`;

// -- 各campaign行为数据
export const campaignActionSql = `
SELECT 
campaign,
SUM(uv)  as uv,
SUM(dau_uv)  as dau_uv,
SUM(community_dau_uv)  as community_dau_uv,
SUM(community_consume_uv)  as community_consume_uv,
SUM(community_shr_uv)  as community_shr_uv,
SUM(describe_uv)  as describe_uv,
SUM(tmpl_dau_uv)  as tmpl_dau_uv,
SUM(tmpl_exp_uv)  as tmpl_exp_uv,
SUM(tmpl_shr_uv)  as tmpl_shr_uv
FROM rpt_vid_log_dp_cnt_1d
where  ds >= #startDate#
and   ds <= #endDate#
and share_type= 'ALL'
and media_source<> 'ALL'
#where#
group by campaign
`;

export const RetentionSQL = `
SELECT  media_source
        ,campaign
        ,stay_num
        ,reg_num
        ,round(stay_num*100/reg_num,4) AS stay_ratio
        ,stay_seq
        ,DAY
        ,share_type
FROM    vivashow_user_stay
WHERE   DAY >= #startDate#
AND     DAY <= #endDate#
AND     share_type = 'ALL'
AND     CAST(stay_seq AS INT ) >= 1
AND     CAST(stay_seq AS INT ) <= 30
#where#
ORDER BY DAY
         ,stay_seq DESC
LIMIT   1000
`;

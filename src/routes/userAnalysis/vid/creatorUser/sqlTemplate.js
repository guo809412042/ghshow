// (除次日留存及流失率）
export const allSQL = `
/*self_plus engine=MPP*/
  select  total_creator_cnt
          ,dau
          ,pub_creator_cnt
          ,new_creator_cnt
          ,pub_return_creator_cnt
      ,pub_cnt_creator_cnt
      ,super_creator_cnt
      ,original_creator_cnt
      ,publish_count
      ,watermark_vc*100/publish_count as watermark_vc_publish_count
      ,qualified_v_cnt
      ,exp_v_cnt
      ,exposure_count
      ,play_3s_count
      ,download_count
      ,play_3s_count*100/exposure_count as play_3s_count_exposure_count
      ,download_count*100/exposure_count as download_count_exposure_count
      ,reward_cost
      ,reward_user_cnt
      ,reward_v_cnt
      ,withdraw_user_cnt
      ,day
  from    vivashow_creator_daily_monitor_summary
  where   day >= #startDate#
  and     day <= #endDate#
  order by day
  limit   10000
  ;
`;

// （次日留存及流失率）

export const allSQL2 = `
/*self_plus engine=MPP*/
  select  ret_cnt*100/pub_creator_cnt as ret_cnt_pub_creator_cnt
          ,lost_cnt*100/total_creator_cnt as lost_cnt_total_creator_cnt
        ,DAY
  from    vivashow_creator_daily_monitor_retention_ads
  where   day >= #startDate#
  and     day <= #endDate#
  order by day
  limit   10000
  ;
`;


export const levelSQL = `
SELECT  t1.DAY
        ,t1.total_creator_cnt
        ,t1.dau
        ,t1.pub_creator_cnt
        ,t1.new_creator_cnt
        ,t1.pub_return_creator_cnt
        ,t1.pub_cnt_creator_cnt
        ,t1.super_creator_cnt
        ,t1.original_creator_cnt
        ,t2.ret_cnt*100/t2.pub_creator_cnt
        ,t2.lost_cnt*100/t2.pub_creator_cnt
        ,t1.publish_count
        ,t1.watermark_vc*100/t1.publish_count
        ,t1.qualified_v_cnt
        ,t1.exp_v_cnt
        ,t1.exposure_count
        ,t1.play_3s_count
        ,t1.download_count
        ,t1.play_3s_count*100/t1.exposure_count
        ,t1.download_count*100/t1.exposure_count
        ,t1.reward_cost
        ,t1.reward_user_cnt
        ,t1.reward_v_cnt
        ,t1.withdraw_user_cnt
FROM    vivashow_creator_daily_monitor_summary t1 LEFT
JOIN    (
            SELECT  *
            FROM    vivashow_creator_daily_monitor_retention_ads
            WHERE   DAY >= #startDate#
            AND     DAY <= #endDate#
        ) t2
ON      t1.DAY = t2.DAY
WHERE   t1.DAY >= #startDate#
AND     t1.DAY <= #endDate#
ORDER BY t1.DAY desc
LIMIT   1000
;
`;

export const userSql = `
/*self_plus engine=MPP*/
select  auid
        ,sum(if(publish_count>0,publish_count,0)) as publish_count
        ,sum(watermark_vc) as watermark_vc
        ,sum(exposure_count) as exposure_count
        ,sum(play_3s_count) as play_3s_count
        ,sum(download_count) as download_count
        ,level
        ,state
        ,original
        ,sum(exposure_vc) as exposure_vc
        ,sum(publish_all_total) as publish_all_total
        ,sum(play_3s_vc) as play_3s_vc
        ,sum(download_vc) as download_vc
        ,sum(coin) as coin
from    vivashow_creator_performance
where   day >= #startDate#
and     day <= #endDate# #where#
group by auid
         ,level
         ,original
         ,state
order by publish_count desc
limit   10000
;`;

export const videoSql = `
/*self_plus engine=MPP*/
select  auid
        ,puid
        ,sum(exposure_count) as exposure_count
        ,sum(play_count) as play_count
        ,sum(download_count) as download_count
        ,sum(coin) as coin
        ,lang
        ,video_type
        ,is_watermark
from    vivashow_user_video_single_day
where   day >= #startDate#
and     day <= #endDate# #where#
 group by auid,puid,lang,video_type,is_watermark
order by exposure_count desc
limit 10000;
`;
export const remainIncomeSQL = `
/*self_plus engine= MPP*/
SELECT  t1.type
      ,SUM(t1.ret_cnt) as ret_cnt
      ,SUM(case when t1.type='未获得收益' then  t1.active_user_cnt_d else t1.total_user_cnt end) as active_user_cnt
      ,SUM(t1.active_user_cnt_d) as active_user_cnt_d
  ,SUM(t2.total_cnt) AS total_cnt 
      ,t1.DAY
FROM    vivashow_creator_daily_monitor_user_type t1 LEFT
JOIN    (
          SELECT  SUM(active_user_cnt_d) AS total_cnt
                  ,DAY
          FROM    vivashow_creator_daily_monitor_user_type
          WHERE   DAY >= #startDate#
          AND     DAY <= #endDate#
          AND     user_type = 'income'
          GROUP BY DAY
      ) t2
ON      t1.DAY = t2.DAY
WHERE   t1.DAY >= #startDate#
AND     t1.DAY <= #endDate#
AND     t1.user_type = 'income'
GROUP BY t1.type
       ,t1.DAY
Order by t1.DAY
`;
export const remainCreateUserStateSQL = `
SELECT  t1.type
      ,SUM(t1.ret_cnt) AS ret_cnt
  ,SUM(t1.active_user_cnt_d) AS active_user
      ,SUM(t1.active_user_cnt_d) AS active_user_cnt_d
  ,SUM(t2.total_cnt) AS total_cnt
      ,t1.DAY
FROM    vivashow_creator_daily_monitor_user_type t1 LEFT
JOIN    (
          SELECT  SUM(active_user_cnt_d) AS total_cnt
                  ,DAY
          FROM    vivashow_creator_daily_monitor_user_type
          WHERE   DAY <= #endDate#
          AND     DAY >= #startDate#
          AND     user_type = 'normal_creator'
          GROUP BY DAY
      ) t2
ON      t1.DAY = t2.DAY
WHERE   t1.DAY <= #endDate#
AND     t1.DAY >= #startDate#
AND     t1.user_type = 'normal_creator'
GROUP BY t1.type
       ,t1.DAY
       Order by t1.DAY
         `;

export const remainSuperCreateUserStateSQL = `
SELECT  t1.type
      ,SUM(t1.ret_cnt) AS ret_cnt
  ,SUM(t1.active_user_cnt_d) AS active_user
      ,SUM(t1.active_user_cnt_d) AS active_user_cnt_d
  ,SUM(t2.total_cnt) AS total_cnt
      ,t1.DAY
FROM    vivashow_creator_daily_monitor_user_type t1 LEFT
JOIN    (
          SELECT  SUM(active_user_cnt_d) AS total_cnt
                  ,DAY
          FROM    vivashow_creator_daily_monitor_user_type
          WHERE   DAY <= #endDate#
          AND     DAY >= #startDate#
          AND     user_type = 'super'
          GROUP BY DAY
      ) t2
ON      t1.DAY = t2.DAY
WHERE   t1.DAY <= #endDate#
AND     t1.DAY >= #startDate#
AND     t1.user_type = 'super'
GROUP BY t1.type
       ,t1.DAY
       Order by t1.DAY
`;

export const remainOriginalStateSQL = `
SELECT  t1.type
      ,SUM(t1.ret_cnt) AS ret_cnt
  ,SUM(t1.active_user_cnt_d) AS active_user
      ,SUM(t1.active_user_cnt_d) AS active_user_cnt_d
  ,SUM(t2.total_cnt) AS total_cnt
      ,t1.DAY
FROM    vivashow_creator_daily_monitor_user_type t1 LEFT
JOIN    (
          SELECT  SUM(active_user_cnt_d) AS total_cnt
                  ,DAY
          FROM    vivashow_creator_daily_monitor_user_type
          WHERE   DAY <= #endDate#
          AND     DAY >= #startDate#
          AND     user_type = 'original'
          GROUP BY DAY
      ) t2
ON      t1.DAY = t2.DAY
WHERE   t1.DAY <= #endDate#
AND     t1.DAY >= #startDate#
AND     t1.user_type = 'original'
GROUP BY t1.type
       ,t1.DAY
       Order by t1.DAY
`;
export const remainFLowSQL = `
SELECT  t1.type
      ,SUM(t1.ret_cnt) AS ret_cnt
  ,SUM(t1.active_user_cnt_d) AS active_user
      ,SUM(t1.active_user_cnt_d) AS active_user_cnt_d
  ,SUM(t2.total_cnt) AS total_cnt
      ,t1.DAY
FROM    vivashow_creator_daily_monitor_user_type t1 LEFT
JOIN    (
          SELECT  SUM(active_user_cnt_d) AS total_cnt
                  ,DAY
          FROM    vivashow_creator_daily_monitor_user_type
          WHERE   DAY <= #endDate#
          AND     DAY >= #startDate#
          AND     user_type = 'upper_level'
          GROUP BY DAY
      ) t2
ON      t1.DAY = t2.DAY
WHERE   t1.DAY <= #endDate#
AND     t1.DAY >= #startDate#
AND     t1.user_type = 'upper_level'
GROUP BY t1.type
       ,t1.DAY
       Order by t1.DAY
`;

export const remainGoldSQL = `
SELECT  t1.type
      ,SUM(t1.ret_cnt) AS ret_cnt
  ,SUM(t1.active_user_cnt_d) AS active_user
      ,SUM(t1.active_user_cnt_d) AS active_user_cnt_d
  ,SUM(t2.total_cnt) AS total_cnt
      ,t1.DAY
FROM    vivashow_creator_daily_monitor_user_type t1 LEFT
JOIN    (
          SELECT  SUM(active_user_cnt_d) AS total_cnt
                  ,DAY
          FROM    vivashow_creator_daily_monitor_user_type
          WHERE   DAY <= #endDate#
          AND     DAY >= #startDate#
          AND     user_type = 'coin_range'
          GROUP BY DAY
      ) t2
ON      t1.DAY = t2.DAY
WHERE   t1.DAY <= #endDate#
AND     t1.DAY >= #startDate#
AND     t1.user_type = 'coin_range'
GROUP BY t1.type
       ,t1.DAY
       Order by t1.DAY
`;
export const publishSQL = `
SELECT  DAY
      ,user_type
      ,type
      ,SUM(active_user_cnt_d) AS active_user_cnt_d
      ,SUM(pub_v_cnt) AS pub_v_cnt
      ,SUM(pub_w_v_cnt) AS pub_w_v_cnt
FROM    vivashow_creator_daily_monitor_user_type

WHERE   DAY >= #startDate#
AND     DAY <= #endDate#
AND     user_type = '#type#'
GROUP BY DAY
       ,user_type
       ,type
       ORDER BY DAY
         `;
export const consumeSQL = `
SELECT  DAY
      ,user_type
      ,type
      ,SUM(pub_v_cnt) AS pub_v_cnt
      ,SUM(hot_exp_v_cnt) AS hot_exp_v_cnt
  ,SUM(exposure_count) AS exposure_count
  ,SUM(play3s_count) AS play3s_count
  ,SUM(download_count) AS download_count
  ,SUM(exp_v_cnt) AS exp_v_cnt
  ,SUM(play3s_v_cnt) AS play3s_v_cnt
  ,SUM(download_v_cnt) AS download_v_cnt
  ,SUM(like_v_cnt) AS like_v_cnt
  ,SUM(pop_3_v_cnt) AS pop_3_v_cnt
FROM    vivashow_creator_daily_monitor_user_type
WHERE   DAY >= #startDate#
AND     DAY <= #endDate#
AND     user_type = '#type#'
GROUP BY DAY
       ,user_type
       ,type
       ORDER BY DAY
         `;

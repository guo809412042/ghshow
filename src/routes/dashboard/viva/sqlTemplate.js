// android DAU
export const DAU = `
SELECT SUM(active_device_num) AS active_device_num
, ds
FROM vcm_app_comm_dau_add_dvc_ads
WHERE ds >= #startDate# AND ds <= #endDate# AND platform = #product#  
#quersql# #querytype# and product_type = '#product_type#'
GROUP BY ds
ORDER BY ds
LIMIT 1000;
`;

// android - 次日留存
export const stayRegSQL = `
SELECT SUM(stay_num) AS stay_num,
SUM(reg_num) AS reg_num
, ds
FROM vcm_app_comm_usr_stay_ads
WHERE ds >= #startDate# AND ds <= #endDate# AND platform = #product#  and type=1   #quersql#
and product_type = '#product_type#'
GROUP BY ds
ORDER BY ds
LIMIT 1000;
`;

// dashboard- 老用户留存
export const olStayRegSQL = `
SELECT SUM(stay_num) AS stay_num,
SUM(reg_num) AS reg_num
, ds
FROM vcm_app_comm_usr_stay_ads
WHERE ds >= #startDate# AND ds <= #endDate#
 AND platform = #product#  
and type=3 and user_type = 'active_user'
and new_user = #selectValue#   #quersql#
and product_type = '#product_type#'
GROUP BY ds
ORDER BY ds
LIMIT 1000;
`;

// dashboard-新增设备数
export const deviceAdditionSQL = `
SELECT SUM(active_new_device_num) AS active_new_device_num
, ds
FROM vcm_app_comm_dau_add_dvc_ads
WHERE ds >= #startDate# AND ds <= #endDate# AND platform = #product# #quersql#
and product_type = '#product_type#'
GROUP BY ds
ORDER BY ds
LIMIT 1000;
`;

// dashboard-新增账号数
export const auidAdditionSQL = `
SELECT SUM(active_new_usr_num) AS active_new_usr_num
, ds
FROM vcm_app_comm_dau_add_dvc_ads
WHERE ds >= #startDate# AND ds <= #endDate# AND platform = #product#  #quersql#
and product_type = '#product_type#'
GROUP BY ds
ORDER BY ds
LIMIT 1000;
`;

// dashboard-工具用户次留
export const toolUserStaySQL = `
SELECT SUM(stay_num) AS stay_num,
SUM(reg_num) AS reg_num
, ds
FROM vcm_app_comm_usr_stay_ads
WHERE ds >= #startDate# AND ds <= #endDate# AND platform = #product#  and type=2   #quersql#
and product_type = '#product_type#'
GROUP BY ds
ORDER BY ds
LIMIT 1000;
`;

// dashboard-push点击
export const pushClickSQL = `
SELECT SUM(#radioValue#) AS #radioValue#, day
FROM push_click_count_day
WHERE product = #product#
AND day >= #startDate#
AND day <= #endDate#
#quersql#
GROUP BY day
ORDER BY day
LIMIT 1000;
`;

// 服务端1天留存
export const Server1StaySQL = `
SELECT sum(reg_num) as reg_num
,sum(stay_num) as stay_num
,ds
FROM vcm_pub_dp_serusr_stay_real_1d
where product_id=#product_type#
AND ds>=#startDate#
AND ds <=#endDate#
AND stay_seq=1
#quersql#
#radioValue#
group by ds
order by ds
limit 1000;
`;

// 服务端3天留存
export const Server2StaySQL = `
SELECT sum(reg_num) as reg_num
,sum(stay_num) as stay_num
,ds
FROM vcm_pub_dp_serusr_stay_real_1d
where product_id=#product_type#
AND ds>=#startDate#
AND ds <=#endDate#
AND stay_seq=2
#quersql#
#radioValue#
group by ds
order by ds
limit 1000;
`;

// 服务端7天留存
export const Server6StaySQL = `
SELECT sum(reg_num) as reg_num
,sum(stay_num) as stay_num
,ds
FROM vcm_pub_dp_serusr_stay_real_1d
where product_id=#product_type#
AND ds>=#startDate#
AND ds <=#endDate#
AND stay_seq=6
#quersql#
#radioValue#
group by ds
order by ds
limit 1000;
`;

// dashboard 导出平均速率
export const exportAvgRateSQL = `
SELECT export_size_total,export_cost_time,ds
FROM (
  SELECT SUM(export_size_total) as export_size_total,
  SUM(export_cost_time) AS export_cost_time
  ,ds
  FROM ads_viva_exp_size_time_cnt_df
  WHERE event_name = '#selectValue#'
  AND ds >= #startDate#
  AND ds <= #endDate#
  AND product = #product#
  #quersql#
  GROUP BY ds
  )t
  order by ds
  `;

// dashboard 导出平均时长
export const exportAvgTimeSQL = `
SELECT export_cost_time,export_cost_count,ds
FROM (
  Select SUM(export_cost_time) AS export_cost_time,
  SUM(export_cost_count) AS export_cost_count
  ,ds
  FROM ads_viva_exp_size_time_cnt_df
  WHERE event_name = '#selectValue#'
  AND ds >= #startDate#
  AND ds <= #endDate#
  AND product = #product#
  #quersql#
  GROUP BY ds
  )t
  order by ds
  `;

// dashboard 导出成功率
export const exportSuccessRateSQL = `
  SELECT t1.total_export_done, t2.total_export_start
, t1.ds
FROM (
SELECT SUM(total) AS total_export_done, ds
FROM holo_viva_log_event_count
WHERE event_name IN ('Share_Export_Done_modify', 'Share_Export_Done_Modify_HD', 'Share_Export_Done_modify_HD', 'Share_Export_Done_New', 'HD_Export_Success')
AND product = #product#
AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
AND ds >= '#startDate#'
AND ds <= '#endDate#'
#quersql#
GROUP BY ds
) t1
JOIN (
SELECT SUM(total_export_start) AS total_export_start, ds
FROM (
SELECT SUM(total) AS total_export_start, app_version, ds
FROM holo_viva_log_event_count
WHERE event_name IN ('Share_Export_Start_modify', 'Share_Export_Start_Modify_HD', 'Share_Export_Start_modify_HD', 'Share_Export_New2', 'HD_Export_Start')
  AND product = #product#
  #quersql#
  AND ds >= '#startDate#'
AND ds <= '#endDate#'
  AND app_version < '5.9.0'
GROUP BY app_version, 
  ds
UNION ALL
SELECT SUM(total) AS total_export_start, app_version, ds
FROM holo_viva_log_event_count
WHERE event_name IN ('Share_Export_Start_modify', 'Share_Export_Start_Modify_HD', 'Share_Export_Start_modify_HD', 'HD_Export_Start')
  AND product = #product#
  AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
  #quersql#
  AND ds >= '#startDate#'
  AND ds <= '#endDate#'
  AND app_version >= '5.9.0'
GROUP BY app_version, 
  ds
) t

GROUP BY ds
) t2
ON t1.ds = t2.ds
ORDER BY ds
LIMIT 1000;
`;
// dashboard 导出闪退率

export const exportExitRateSQL = `
SELECT t2.total_export_start,
t1.total_export_fail, t1.ds
FROM (
SELECT SUM(total) AS total_export_fail, ds
FROM holo_viva_log_event_count
WHERE ((product = 1
    AND event_name IN (
      'Share_Export_Done_modify', 
      'Share_Export_Cancel_Modify', 
      'Share_Export_Fail_Modify', 
      'Share_Export_Done_Modify_HD', 
      'Share_Export_Cancel_Modify_HD', 
      'Share_Export_Fail_Modify_HD'
    ))
  OR (product = 2
    AND event_name IN (
      'Share_Export_Done_modify', 
      'Share_Export_Cancel_modify', 
      'Share_Export_Fail_modify', 
      'Share_Export_Done_modify_HD', 
      'Share_Export_Cancel_modify_HD', 
      'Share_Export_Fail_modify_HD'
    )))
AND product = #product#
AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
AND ds >= '#startDate#'
AND ds <= '#endDate#'
#quersql#
GROUP BY ds
) t1
JOIN (
SELECT SUM(total_export_start) AS total_export_start, ds
FROM (
SELECT SUM(total) AS total_export_start, ds
FROM holo_viva_log_event_count
WHERE event_name IN ('Share_Export_Start_modify', 'Share_Export_Start_Modify_HD', 'Share_Export_Start_modify_HD')
  AND product = #product#
  AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
  AND ds >= '#startDate#'
  AND ds <= '#endDate#'
#quersql#
GROUP BY ds
) t
GROUP BY ds
) t2
ON t1.ds = t2.ds
ORDER BY ds
LIMIT 1000;

`;

// dashboard APP导出失败率
export const exportAppFailRateSQL = `
SELECT t1.total_export_fail,t2.total_export_start, t1.ds
FROM (
SELECT SUM(total) AS total_export_fail, ds
FROM holo_viva_log_event_count
WHERE event_name IN ('Share_Export_Fail_Modify', 'Share_Export_Fail_Modify_HD','Share_Export_Fail_modify', 'Share_Export_Fail_modify_HD')
AND product = #product#
AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
AND ds >= '#startDate#'
AND ds <= '#endDate#'
#quersql#
GROUP BY ds
) t1
JOIN (
SELECT SUM(total_export_start) AS total_export_start, ds
FROM (
SELECT SUM(total) AS total_export_start, ds
FROM holo_viva_log_event_count
WHERE event_name IN ('Share_Export_Start_modify', 'Share_Export_Start_Modify_HD', 'Share_Export_Start_modify_HD')
AND product = #product#
AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
AND ds >= '#startDate#'
AND ds <= '#endDate#'
GROUP BY ds ) t
GROUP BY ds ) t2
ON t1.ds = t2.ds
ORDER BY ds
LIMIT 1000;
`;

// dashboard 真实导出失败率
export const exportFailRateSQL = `
SELECT t1.total_export_fail, t2.total_export_start
, t1.ds
FROM (
SELECT SUM(total) AS total_export_fail, ds
FROM holo_viva_log_event_key_count
WHERE ((product = 1
    AND event_name IN ('Share_Export_Fail_Modify', 'Share_Export_Fail_Modify_HD')
    AND key_name = 'isBackground'
    AND param_value <> 'background')
  OR (product = 2
    AND event_name IN ('Share_Export_Fail_modify', 'Share_Export_Fail_modify_HD')
    AND key_name = 'errCode'
    AND param_value NOT IN ('EnterBackgroundDuringExporting', 'IsInBackgroundBeforeExporting', 'DiskSpaceNotEnough')))
AND product = #product#
AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
AND ds >= '#startDate#'
AND ds <= '#endDate#'
#quersql#
GROUP BY ds
) t1
JOIN (
SELECT SUM(total_export_start) AS total_export_start, ds
FROM (
SELECT SUM(total) AS total_export_start, ds
FROM holo_viva_log_event_count
WHERE event_name IN ('Share_Export_Start_modify', 'Share_Export_Start_Modify_HD', 'Share_Export_Start_modify_HD')
  AND product = #product#
  AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
  AND ds >= '#startDate#'
  AND ds <= '#endDate#'
  #quersql#
GROUP BY ds
) t
GROUP BY ds
) t2
ON t1.ds = t2.ds
ORDER BY ds
LIMIT 1000;

`;

// dahsboard导出取消率
export const exportCancleRateSQL = `
SELECT t1.total_export_fail  , t2.total_export_start 
, t1.ds
FROM (
SELECT SUM(total) AS total_export_fail, ds
FROM holo_viva_log_event_count
WHERE ((product = 1
    AND event_name IN (
      'Share_Export_Cancel_Modify',
      'Share_Export_Cancel_Modify_HD'
    ))
  OR (product = 2
    AND event_name IN (
      'Share_Export_Cancel_modify', 
      'Share_Export_Cancel_modify_HD'
    )))
AND product = #product#
AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
AND ds >= '#startDate#'
AND ds <= '#endDate#'
#quersql#
GROUP BY ds
) t1
JOIN (
SELECT SUM(total_export_start) AS total_export_start, ds
FROM (
SELECT SUM(total) AS total_export_start, ds
FROM holo_viva_log_event_count
WHERE event_name IN ('Share_Export_Start_modify', 'Share_Export_Start_Modify_HD', 'Share_Export_Start_modify_HD')
  AND product = #product#
  AND (product=2 and app_version not in ('6.1.5','6.1.6', '6.1.7') or product=1)
  AND ds >= '#startDate#'
  AND ds <= '#endDate#'
  #quersql#
  
GROUP BY ds
) t
GROUP BY ds
) t2
ON t1.ds = t2.ds
ORDER BY ds
LIMIT 1000;
`;

// dashboard app登录成功率
export const appLoginSuccessRateSQL = `
SELECT t1.failed_total,t2.total ,
       t1.ds
  FROM(
SELECT SUM(total) AS failed_total, ds
  FROM holo_viva_log_event_key_count
 WHERE param_value= 'success'
   AND ds >=  '#startDate#'
   AND ds <= '#endDate#'
   AND event_name IN('Login_Inter_Result', 'Login_Domestic_Result')
   AND key_name= 'result'
   AND product= 1 
 GROUP BY ds) t1 JOIN(
SELECT SUM(total) AS total, ds
  FROM holo_viva_log_event_key_count
 WHERE  ds >= '#startDate#'
 AND ds <= '#endDate#'
   AND event_name IN('Login_Inter_Result', 'Login_Domestic_Result')
   AND key_name= 'result'
   AND product= #product#
   #quersql#
 GROUP BY ds) t2 ON t1.ds= t2.ds
 ORDER BY ds
 LIMIT 1000;
 `;

// dashboard APP登录失败率
export const appLoginFailRateSQL = `
 SELECT t1.failed_total, t2.total , t1.ds
 FROM (
 SELECT SUM(total) AS failed_total, ds
 FROM holo_viva_log_event_key_count
 WHERE param_value = 'failed'
 AND ds >= '#startDate#'
 AND ds <= '#endDate#'
 AND event_name IN ('Login_Inter_Result', 'Login_Domestic_Result')
 AND key_name = 'result'
 AND product = #product# #quersql#
 GROUP BY ds
 ) t1
 JOIN (
 SELECT SUM(total) AS total, ds
 FROM holo_viva_log_event_key_count
 WHERE ds >= '#startDate#'
 AND ds <= '#endDate#'
 AND event_name IN ('Login_Inter_Result', 'Login_Domestic_Result')
 AND key_name = 'result'
 AND product = #product# #quersql#
 GROUP BY ds
 ) t2
 ON t1.ds = t2.ds
 ORDER BY ds
 LIMIT 1000;
 `;

// dashbaord 上传失败率
export const uploadFailRateSQL = `
 SELECT t1.failed_total , t2.total , t1.ds, t1.product
 FROM (
 SELECT failed_total, ds, product
 FROM (
  SELECT SUM(total) AS failed_total, ds, product
  FROM holo_viva_log_event_count
  WHERE ds >= '#startDate#'
    AND ds <= '#endDate#'
    AND (event_name = 'Dev_Event_Share_Upload_Fail'
      AND product = 1 and app_version>='6.2.8')
      AND product = #product# and app_version >= '6.2.8'
      #quersql#
  GROUP BY ds, 
    product
UNION ALL
SELECT SUM(total) AS failed_total, ds, product
FROM holo_viva_log_event_key_count
WHERE ds >= '#startDate#'
  AND ds <= '#endDate#'
  AND (event_name = 'Share_Upload_Fail'
    AND param_value <> '5'
    AND key_name= 'ErrorCode'
    AND product = 2)
    AND product = #product# and app_version >= '6.2.8'
    #quersql#
GROUP BY ds, 
 product
) a
) t1
JOIN (
SELECT SUM(total) AS total, ds, product
FROM (
SELECT SUM(total) AS total, ds, product
FROM holo_viva_log_event_count
WHERE ds >= '#startDate#'
  AND ds <= '#endDate#'
  AND ((event_name IN ('Dev_Event_Share_Upload_Done', 'Dev_Event_Share_Upload_Fail')
      AND product = 1 and app_version>='6.2.8')
    OR (event_name IN ('Share_Upload_Done')
      AND product = 2))
      AND product = #product# and app_version >= '6.2.8'
      #quersql#
GROUP BY ds, 
  product
UNION ALL
SELECT SUM(total) AS total, ds, product
FROM holo_viva_log_event_key_count
WHERE ds >= '#startDate#'
  AND ds <= '#endDate#'
  AND (event_name IN ('Share_Upload_Fail')
    AND param_value <> '5'
    AND key_name = 'ErrorCode'
    AND product = 2)
    AND product = #product# and app_version >= '6.2.8'
    #quersql#
GROUP BY ds, 
  product
) t
GROUP BY ds, 
product
) t2
ON t1.ds = t2.ds
AND t1.product = t2.product
ORDER BY ds
LIMIT 1000;

 `;
// dashbaord上传取消率
export const uploadCancelRateSQL = `
SELECT t1.cancel_total , t2.total , t1.ds, t1.product
FROM (
SELECT cancel_total, ds, product
FROM (


  SELECT SUM(total) AS cancel_total, ds, product
  FROM holo_viva_log_event_count
  WHERE ds >= '#startDate#'
  AND ds <= '#endDate#'
    AND (event_name = 'Share_Upload_Cancel'
      AND product = 1)
      AND product = #product#
  #quersql#
    
  GROUP BY ds, 
    product
UNION ALL

SELECT SUM(total) AS cancel_total, ds, product
FROM holo_viva_log_event_key_count
WHERE ds >= '#startDate#'
AND ds <= '#endDate#'
  AND (event_name = 'Share_Upload_Fail'
    AND param_value in ( '5','499')
    AND key_name= 'ErrorCode'
    AND product = 2)
    AND product = #product#
#quersql#
  
GROUP BY ds, 
  product
) t
) t1
JOIN (
SELECT SUM(total) AS total, ds, product
FROM holo_viva_log_event_count
WHERE ds >= '#startDate#'
AND ds <= '#endDate#'
AND ((event_name IN ('Dev_Event_Share_Upload_Done', 'Dev_Event_Share_Upload_Fail', 'Share_Upload_Cancel')
    AND product = 1)
  OR (event_name IN ('Share_Upload_Done', 'Share_Upload_Fail')
    AND product = 2))
    AND product = #product#
#quersql#

GROUP BY ds, 
product
) t2
ON t1.ds = t2.ds
AND t1.product = t2.product
ORDER BY ds
LIMIT 1000;

`;

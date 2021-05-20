export const CountryListSQL = `
SELECT DISTINCT(\`country_name\`) AS country  FROM ads_pub_trd_trial_usr_cnt_1d;
`;

export const SkuListSQL = `
SELECT DISTINCT(\`sku_id\`) AS sku  FROM ads_pub_trd_trial_usr_cnt_1d ? ;
`;

/**
 * 试用转化按日
 */
export const ConvertDayListSQL = `
/*+engine=mpp*/
SELECT a.ds ,
ifnull(a.dau, 0) AS dau,
ifnull(b.pay_dvc_cnt_1d, 0) AS pay_dvc_cnt_1d,
ifnull(b.trial_dvc_cnt_1d, 0) AS trial_dvc_cnt_1d,
ifnull(b.trial_pay_dvc_cnt_1d, 0) AS trial_pay_dvc_cnt_1d,
ifnull(round(100*b.trial_dvc_cnt_1d/a.dau, 2), 0) AS trial_rate,
ifnull(round(100*b.trial_pay_dvc_cnt_1d/b.trial_dvc_cnt_1d, 2), 0) AS trial_convert_rate,
ifnull(round(100*b.pay_dvc_cnt_1d/ a.dau, 2), 0) AS pay_rate,
ifnull(round(100*b.trial_pay_dvc_cnt_1d/a.dau, 2), 0) AS trial_pay_rate
FROM(
    SELECT ds,SUM(dvc_cnt_1d) as dau
    FROM(
        SELECT      platform
                    ,country_name
                    ,new_user
                    ,media_source
                    ,dvc_cnt_1d
                    ,product_id
                    ,ds
        FROM ads_pub_trd_trial_usr_cnt_1d
        ?
        GROUP BY platform
                    ,country_name
                    ,new_user
                    ,media_source
                    ,dvc_cnt_1d
                    ,product_id
                    ,ds
    )s GROUP BY  ds
)a LEFT JOIN (
    SELECT ds,
        SUM(pay_dvc_cnt_1d)  AS pay_dvc_cnt_1d,
        SUM(trial_dvc_cnt_1d)  AS trial_dvc_cnt_1d,
        SUM(trial_pay_dvc_cnt_1d)  AS trial_pay_dvc_cnt_1d
    FROM ads_pub_trd_trial_usr_cnt_1d
    #
    GROUP BY ds
)b on a.ds = b.ds 
ORDER BY a.ds desc
`;

/**
 * 试用转化按月
 */
export const ConvertMonthListSQL = `
/*+engine=mpp*/
SELECT left(a.ds,6)  as ds , SUM(a.dau) as dau, SUM(b.pay_dvc_cnt_1d) as pay_dvc_cnt_1d, SUM(b.trial_dvc_cnt_1d) as trial_dvc_cnt_1d,SUM(b.trial_pay_dvc_cnt_1d) as trial_pay_dvc_cnt_1d
        ,round(100*SUM(b.trial_dvc_cnt_1d)/SUM(a.dau),2) AS trial_rate,
        round(100*SUM(b.trial_pay_dvc_cnt_1d)/SUM(b.trial_dvc_cnt_1d),2) AS trial_convert_rate,
        round(100*SUM(b.pay_dvc_cnt_1d)/ SUM(a.dau),2) AS pay_rate,
        round(100*SUM(b.trial_pay_dvc_cnt_1d)/SUM(a.dau), 2) AS trial_pay_rate
FROM(
    SELECT ds,SUM(dvc_cnt_1d) as dau
    FROM(
        SELECT      platform
                    ,country_name
                    ,new_user
                    ,media_source
                    ,dvc_cnt_1d
                    ,product_id
                    ,ds
        FROM ads_pub_trd_trial_usr_cnt_1d
        ?
        GROUP BY platform
                    ,country_name
                    ,new_user
                    ,media_source
                    ,dvc_cnt_1d
                    ,product_id
                    ,ds
    )s GROUP BY  ds
)a LEFT JOIN (
    SELECT ds,
        SUM(pay_dvc_cnt_1d)  AS pay_dvc_cnt_1d,
        SUM(trial_dvc_cnt_1d)  AS trial_dvc_cnt_1d,
        SUM(trial_pay_dvc_cnt_1d)  AS trial_pay_dvc_cnt_1d
    FROM ads_pub_trd_trial_usr_cnt_1d
    # 
    GROUP BY ds
)b on a.ds = b.ds 
GROUP BY left(a.ds,6)
ORDER BY ds desc;
`;

/**
 * 新用户试用率
 */
export const UserTrialRateListSQL = `
/*+engine=mpp*/
select 
      a.ds,
       a.new_usr_cnt_1d,
       b.interval_day,
       b.trial_dvc_cnt_1d,
       b.trial_pay_dvc_cnt_1d

  from(

      SELECT  ds
              ,sum(new_usr_cnt_1d) as new_usr_cnt_1d
        FROM(
            SELECT   platform,country_name,media_source,product_id,ds ,new_usr_cnt_1d
            FROM    ads_pub_trd_newusr_trial_usr_cnt_1d
            ? 
            GROUP BY  platform,country_name,media_source,product_id,ds ,new_usr_cnt_1d
      )t GROUP BY ds

 ) a
  LEFT JOIN(

          SELECT ds ,interval_day, sum(trial_dvc_cnt_1d) as trial_dvc_cnt_1d, sum(trial_pay_dvc_cnt_1d) as trial_pay_dvc_cnt_1d
          FROM ads_pub_trd_newusr_trial_usr_cnt_1d
          # and interval_day is not null
          GROUP BY ds, interval_day
  ) b on a.ds= b.ds
  order by a.ds desc,b.interval_day;
;
`;

/**
 * 新用户试用转付费
 */
export const UserToPayListSQL = `
/*+engine=mpp*/
select a.ds,
       a.new_usr_cnt_1d,
       b.interval_day,
       b.trial_dvc_cnt_1d,
       b.trial_pay_dvc_cnt_1d
  from(

      SELECT  ds
              ,sum(new_usr_cnt_1d) as new_usr_cnt_1d
        FROM(
            SELECT   platform,country_name,media_source,product_id,ds ,new_usr_cnt_1d
            FROM    ads_pub_trd_newusr_trial_usr_cnt_1d
            ? 
            GROUP BY  platform,country_name,media_source,product_id,ds ,new_usr_cnt_1d
      )t GROUP BY ds
 ) a
  LEFT JOIN(

          SELECT ds ,interval_day, sum(trial_dvc_cnt_1d) as trial_dvc_cnt_1d, sum(trial_pay_dvc_cnt_1d) as trial_pay_dvc_cnt_1d
          FROM ads_pub_trd_newusr_trial_usr_cnt_1d
          # and interval_day is not null
          GROUP BY ds, interval_day
  ) b on a.ds= b.ds
  order by a.ds desc,b.interval_day;
`;

// CREATE TABLE quvideo_gh.`ads_pub_trd_trial_usr_cnt_1d` (
//   `platform` bigint COMMENT '1-安卓 2-IOS',
//   `country_name` varchar COMMENT '地区编码',
//   `sku_id` varchar COMMENT '商品ID',
//   `new_user` varchar COMMENT '1 当日新增 2 一周内新增 3 一个月内新增 100 一个月前新增',
//   `media_source` varchar COMMENT '广告来源',
//   `dvc_cnt_1d` bigint COMMENT '最近一天设备数',
//   `pay_dvc_cnt_1d` bigint COMMENT '最近一天付费设备数',
//   `trial_dvc_cnt_1d` bigint COMMENT '最近一天试用设备数',
//   `trial_pay_dvc_cnt_1d` bigint COMMENT '最近一天试用转化设备数',
//   `ds` bigint COMMENT '日期编码',
//   `product_id` bigint COMMENT '产品id'
// )
// PARTITION BY HASH KEY (`ds`) PARTITION NUM 100
// TABLEGROUP gh_group1
// OPTIONS (UPDATETYPE='batch')
// COMMENT '各产品试用转化汇总'

// CREATE TABLE quvideo_gh.`ads_pub_trd_newusr_trial_usr_cnt_1d` (
//   `platform` bigint COMMENT '1-安卓 2-IOS',
//   `country_name` varchar COMMENT '地区编码',
//   `sku_id` varchar COMMENT '商品ID',
//   `media_source` varchar COMMENT '广告来源',
//   `new_usr_cnt_1d` bigint COMMENT '新增设备数',
//   `trial_dvc_cnt_1d` bigint COMMENT '试用设备数',
//   `trial_pay_dvc_cnt_1d` bigint COMMENT '试用转化设备数',
//   `interval_day` bigint COMMENT '间隔时间',
//   `ds` bigint COMMENT '日期编码',
//   `product_id` bigint COMMENT '产品id'
// )
// PARTITION BY HASH KEY (`ds`) PARTITION NUM 100
// TABLEGROUP gh_group1
// OPTIONS (UPDATETYPE='batch')
// COMMENT '各产品新用户试用转化汇总'

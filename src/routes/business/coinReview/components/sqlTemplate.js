/**
 * @File: sqlTemplate.js
 * @Author: Zero
 * @Date: 2020/05/15
 * @Copyright(c) QuVideo F2E Team
 * @Email: zerong.peng@quvideo.com
 * @comment: 新用户收入来源
 */
export const countryListSQL = `
SELECT DISTINCT(\`country_name\`) AS country  FROM ads_pub_trd_coin_cnt_1d where country_name<>'中国'
`;

export const skuListSQL = `
/*+engine=mpp*/
SELECT sku 
FROM ads_pub_trd_coin_cnt_1d 
? 
group by sku
order by cast(REPLACE(sku,'金币','') as int)
`;

export const dayListSQL = `
/*+engine=mpp*/
SELECT a.ds
      ,add_dvc_cnt_1d
      ,pay_coin_usr_cnt_1d
      ,pay_coin_amt_1d
      ,new_pay_coin_usr_cnt_1d
      ,new_pay_coin_ord_cnt_1d
      ,new_pay_coin_amt_1d
      ,new_add_dvc_cnt_1d
      ,old_pay_coin_usr_cnt_1d
      ,old_pay_coin_ord_cnt_1d
      ,old_pay_coin_amt_1d
      ,old_add_dvc_cnt_1d
      ,round(100*new_pay_coin_usr_cnt_1d/add_dvc_cnt_1d,2) as new_rate
from(
    SELECT
        data_time as ds,
        sum(pay_coin_usr_cnt_1d) as pay_coin_usr_cnt_1d,
        round(sum(pay_coin_amt_1d),2) as pay_coin_amt_1d,
        sum(if(is_renew=1,pay_coin_usr_cnt_1d,0)) as new_pay_coin_usr_cnt_1d,
        sum(if(is_renew=1,pay_coin_ord_cnt_1d,0)) as new_pay_coin_ord_cnt_1d,
        round(sum(if(is_renew=1,pay_coin_amt_1d,0)),2) as new_pay_coin_amt_1d,
        sum(if(is_renew=1,add_dvc_cnt_1d,0)) as new_add_dvc_cnt_1d,
        sum(if(is_renew=0,pay_coin_usr_cnt_1d,0)) as old_pay_coin_usr_cnt_1d,
        sum(if(is_renew=0,pay_coin_ord_cnt_1d,0)) as old_pay_coin_ord_cnt_1d,
        round(sum(if(is_renew=0,pay_coin_amt_1d,0)),2) as old_pay_coin_amt_1d,
        sum(if(is_renew=0,add_dvc_cnt_1d,0)) as old_add_dvc_cnt_1d
    FROM ads_pub_trd_coin_cnt_1d
     ?
    group by data_time

)a LEFT JOIN (
  SELECT data_time as ds ,sum(add_dvc_cnt_1d) as add_dvc_cnt_1d
  FROM(
      SELECT product_id,data_time,platform,country_name,add_dvc_cnt_1d 
    from ads_pub_trd_coin_cnt_1d ?
    GROUP BY product_id,data_time,platform,country_name,add_dvc_cnt_1d
    )s GROUP BY data_time
)b on a.ds = b.ds
order by a.ds desc
`;

export const monthListSQL = `
/*+engine=mpp*/
SELECT a.ds
      ,add_dvc_cnt_1d
      ,pay_coin_usr_cnt_1d
      ,pay_coin_amt_1d
      ,new_pay_coin_usr_cnt_1d
      ,new_pay_coin_ord_cnt_1d
      ,new_pay_coin_amt_1d
      ,new_add_dvc_cnt_1d
      ,old_pay_coin_usr_cnt_1d
      ,old_pay_coin_ord_cnt_1d
      ,old_pay_coin_amt_1d
      ,old_add_dvc_cnt_1d
      ,new_rate
from(
    SELECT
        substr(data_time,1,6) as ds,
        sum(pay_coin_usr_cnt_1d) as pay_coin_usr_cnt_1d,
        round(sum(pay_coin_amt_1d),2) as pay_coin_amt_1d,
        sum(if(is_renew=1,pay_coin_usr_cnt_1d,0)) as new_pay_coin_usr_cnt_1d,
        sum(if(is_renew=1,pay_coin_ord_cnt_1d,0)) as new_pay_coin_ord_cnt_1d,
        round(sum(if(is_renew=1,pay_coin_amt_1d,0)),2) as new_pay_coin_amt_1d,
        sum(if(is_renew=1,add_dvc_cnt_1d,0)) as new_add_dvc_cnt_1d,
        sum(if(is_renew=0,pay_coin_usr_cnt_1d,0)) as old_pay_coin_usr_cnt_1d,
        sum(if(is_renew=0,pay_coin_ord_cnt_1d,0)) as old_pay_coin_ord_cnt_1d,
        round(sum(if(is_renew=0,pay_coin_amt_1d,0)),2) as old_pay_coin_amt_1d,
        sum(if(is_renew=0,add_dvc_cnt_1d,0)) as old_add_dvc_cnt_1d,
        round(100*sum(if(is_renew=1,pay_coin_amt_1d,0))/sum(add_dvc_cnt_1d),2) as new_rate
    FROM ads_pub_trd_coin_cnt_1d
     ?
    group by substr(data_time,1,6)

)a LEFT JOIN (
  SELECT substr(data_time,1,6) as ds ,sum(add_dvc_cnt_1d) as add_dvc_cnt_1d
  FROM(
      SELECT product_id,data_time,platform,country_name,add_dvc_cnt_1d 
    from ads_pub_trd_coin_cnt_1d  ?
    GROUP BY product_id,data_time,platform,country_name,add_dvc_cnt_1d
    )s GROUP BY substr(data_time,1,6)
)b on a.ds = b.ds
order by a.ds desc
`;

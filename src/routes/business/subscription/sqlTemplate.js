/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-30 15:12:40
 * @LastEditTime: 2020-06-12 13:42:25
 * @LastEditors: ssssslf
 */
export const countrySQL = `
select DISTINCT(country_name) from holo_dwd_pub_log_usr_subevt_index_info_di  where 1=1 #product#
`;
export const appVersionSQL = `
select DISTINCT(app_version) from holo_dwd_pub_log_usr_subevt_index_info_di 
 where 1=1 #product# and platform = '#platform#'
 and app_version is not null 
 order by app_version desc
`;

export const subscriptionDurationSQL = `
select DISTINCT(subscription_duration) from holo_dwd_pub_log_usr_subord_index_info_di 
 where 1=1 #product# and platform = '#platform#'
 and subscription_duration is not null 
 order by subscription_duration desc
 `;
export const skuTypeSQL = `
select DISTINCT(sku_type) from holo_dwd_pub_log_usr_subord_index_info_di 
 where 1=1 #product# and platform = '#platform#'
 and sku_type is not null 
 order by sku_type desc
 `;
export const skuIdSQL = `
select DISTINCT(sku_id) from holo_dwd_pub_log_usr_subord_index_info_di 
 where 1=1 #product# and platform = '#platform#'
 and sku_id is not null 
 order by sku_id desc
 `;

export const mediaSourceSQL = `
select DISTINCT(media_source) from holo_dwd_pub_log_usr_subevt_index_info_di 
 where 1=1 #product# and platform = '#platform#'
 and media_source is not null 
 order by media_source desc
 `;

export const campaignNameSQL = `
 select DISTINCT(campaign_name) from holo_dwd_pub_log_usr_subevt_index_info_di 
 where 1=1 #product# and platform = '#platform#'
 and campaign_name is not null 
 order by campaign_name desc
 `;
export const categorySQL = `
 select DISTINCT(category) from holo_dwd_pub_log_usr_subevt_index_info_di 
 where 1=1 #product# and platform = '#platform#'
 and category is not null 
 order by category desc
 `;
export const funtionSQL = `
 select DISTINCT(funtion) from holo_dwd_pub_log_usr_subevt_index_info_di 
 where 1=1 #product# 
 and platform = '#platform#' 
 and funtion is not null 
 order by funtion desc
 `;

export const fvalueSQL = `
 select DISTINCT(fvalue) from holo_dwd_pub_log_usr_subevt_index_info_di 
 where 1=1 #product# 
 and platform = '#platform#' 
 and fvalue is not null 
 order by fvalue desc
 `;
export const listSQLtempo = `
SELECT a.ds,a.product_id
,user_total  --?????????
,ent_home_cnt_1d as home_total --??????home????????????
,ent_pay_cnt_1d as exp_total --????????????????????????
,clk_pay_cnt_1d as click_total --?????????????????????
,sub_pay_cnt_1d as suc_total --?????????????????????
,sucs_pay_cnt_1d --??????????????????
,charged_amount  --???????????????
,net_revenue     --?????????
,refund_cnt_1d --????????????
,refund_amount  --???????????????
,old_pay_cnt_1d as sub_total --????????????
#group1#
FROM(
--?????????
SELECT ds,product_id,COUNT(DISTINCT duiddigest) as user_total --?????????
#group#
FROM holo_dwd_pub_log_usr_subevt_index_info_di 
where  ds >= '#startDate#'and ds <= '#endDate#' #where#
GROUP BY ds,product_id #group#
)a LEFT JOIN (
SELECT ds
    ,product_id
    ,SUM(ent_home_cnt_1d) as ent_home_cnt_1d --??????home????????????
    ,SUM(ent_pay_cnt_1d)  as ent_pay_cnt_1d  --????????????????????????
    ,SUM(clk_pay_cnt_1d)  as clk_pay_cnt_1d  --?????????????????????
    ,SUM(sub_pay_cnt_1d)  as sub_pay_cnt_1d  --?????????????????????
    #group#
FROM(
SELECT 
ds
,product_id
--??????home????????????
,case when event_name IN ('AppStart_V250','Home_Enter') then COUNT(DISTINCT duiddigest) END AS ent_home_cnt_1d
--????????????????????????
,case when event_name IN ('Subscription_Ads_Open_V288','Subscribe_Enter') then COUNT(DISTINCT duiddigest) END AS ent_pay_cnt_1d
--?????????????????????
,case when event_name IN ('Subscription_Freetrial_Click_V288','Subscribe_Pay_Click') then COUNT(DISTINCT duiddigest) END AS clk_pay_cnt_1d
--?????????????????????
,case when event_name IN ('Subscription_Freetrial_Success_V288','Subscribe_Pay_Success') then COUNT(DISTINCT duiddigest) END AS sub_pay_cnt_1d
#group#
FROM holo_dwd_pub_log_usr_subevt_index_info_di 
where  ds >= '#startDate#'and ds <= '#endDate#' #where#
group by ds,event_name,product_id #group#
)s GROUP BY ds,product_id #group#
)b on a.ds = b.ds and a.product_id = b.product_id #type1#

LEFT join(
--??????????????????
SELECT reg_time
        ,product_id
        ,COUNT(DISTINCT duiddigest) as sucs_pay_cnt_1d --??????????????????
        ,SUM(charged_amount)        as charged_amount  --???????????????
        ,SUM(net_revenue)           as net_revenue     --?????????
        #group#
FROM holo_dwd_pub_log_usr_subord_index_info_di 
where order_id is not null and  reg_time >= '#startDate#'and reg_time <= '#endDate#' #otherWhere#
GROUP BY reg_time,product_id #group#
)c on a.ds = c.reg_time and a.product_id = c.product_id #type2#

LEFT JOIN (
--??????
SELECT reg_time
        ,product_id
        ,COUNT(DISTINCT duiddigest) as refund_cnt_1d --????????????
        ,SUM(refund_amount)        as refund_amount  --???????????????
        #group#
FROM holo_dwd_pub_log_usr_subord_index_info_di 
where  refund_amount > 0 and  reg_time >= '#startDate#'and reg_time <= '#endDate#' #otherWhere#
GROUP BY reg_time,product_id #group#
)d on a.ds = d.reg_time and a.product_id = d.product_id #type3#
LEFT JOIN (
--??????
SELECT reg_time,product_id
,count(DISTINCT duiddigest) as old_pay_cnt_1d  --????????????
#group#
FROM holo_dwd_pub_log_usr_subord_index_info_di
where  reg_time >= '#startDate#'and reg_time <= '#endDate#' #otherWhere#  and is_renew = '0'
GROUP BY reg_time,product_id #group#
)e on a.ds = e.reg_time and a.product_id = e.product_id #type4# 
order by a.ds desc
;
`;

export const listSQLsp = `
SELECT a.ds,a.product_id
,user_total  --?????????
,ent_home_cnt_1d as home_total --??????home????????????
,ent_pay_cnt_1d as exp_total --????????????????????????
,clk_pay_cnt_1d as click_total --?????????????????????
,sub_pay_cnt_1d as suc_total --?????????????????????
,sucs_pay_cnt_1d --??????????????????
,charged_amount  --???????????????
,net_revenue     --?????????
,refund_cnt_1d --????????????
,refund_amount  --???????????????
,old_pay_cnt_1d as sub_total --????????????
#group1#
FROM(
--?????????
SELECT ds,product_id,COUNT(DISTINCT duiddigest) as user_total --?????????
#group#
FROM holo_dwd_pub_log_usr_subevt_index_info_di 
where  ds >= '#startDate#'and ds <= '#endDate#' #where#
GROUP BY ds,product_id #group#
)a LEFT JOIN (
SELECT ds
    ,product_id
    ,SUM(ent_home_cnt_1d) as ent_home_cnt_1d --??????home????????????
    ,SUM(ent_pay_cnt_1d)  as ent_pay_cnt_1d  --????????????????????????
    ,SUM(clk_pay_cnt_1d)  as clk_pay_cnt_1d  --?????????????????????
    ,SUM(sub_pay_cnt_1d)  as sub_pay_cnt_1d  --?????????????????????
    #group#
FROM(
SELECT 
ds
,product_id
--??????home????????????
,case when event_name IN ('APP_Start') then COUNT(DISTINCT duiddigest) END AS ent_home_cnt_1d
--????????????????????????
,case when event_name IN ('IAP_Subscribe_Entry') then COUNT(DISTINCT duiddigest) END AS ent_pay_cnt_1d
--?????????????????????
,case when event_name IN ('Iap_Subscribe_Pay') then COUNT(DISTINCT duiddigest) END AS clk_pay_cnt_1d
--?????????????????????
,case when event_name IN ('IAP_Subscribe_Pay_Success','Subscribe_Pay_Success') then COUNT(DISTINCT duiddigest) END AS sub_pay_cnt_1d
#group#
FROM holo_dwd_pub_log_usr_subevt_index_info_di 
where  ds >= '#startDate#'and ds <= '#endDate#' #where#
group by ds,event_name,product_id #group#
)s GROUP BY ds,product_id #group#
)b on a.ds = b.ds and a.product_id = b.product_id #type1#

LEFT join(
--??????????????????
SELECT reg_time
        ,product_id
        ,COUNT(DISTINCT duiddigest) as sucs_pay_cnt_1d --??????????????????
        ,SUM(charged_amount)        as charged_amount  --???????????????
        ,SUM(net_revenue)           as net_revenue     --?????????
        #group#
FROM holo_dwd_pub_log_usr_subord_index_info_di 
where order_id is not null and  reg_time >= '#startDate#'and reg_time <= '#endDate#' #otherWhere#
GROUP BY reg_time,product_id #group#
)c on a.ds = c.reg_time and a.product_id = c.product_id #type2#

LEFT JOIN (
--??????
SELECT reg_time
        ,product_id
        ,COUNT(DISTINCT duiddigest) as refund_cnt_1d --????????????
        ,SUM(refund_amount)        as refund_amount  --???????????????
        #group#
FROM holo_dwd_pub_log_usr_subord_index_info_di 
where  refund_amount > 0 and  reg_time >= '#startDate#'and reg_time <= '#endDate#' #otherWhere#
GROUP BY reg_time,product_id #group#
)d on a.ds = d.reg_time and a.product_id = d.product_id #type3#
LEFT JOIN (
--??????
SELECT reg_time,product_id
,count(DISTINCT duiddigest) as old_pay_cnt_1d  --????????????
#group#
FROM holo_dwd_pub_log_usr_subord_index_info_di
where  reg_time >= '#startDate#'and reg_time <= '#endDate#' #otherWhere#  and is_renew = '0'
GROUP BY reg_time,product_id #group#
)e on a.ds = e.reg_time and a.product_id = e.product_id #type4# 
order by a.ds desc
;
`;

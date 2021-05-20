/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-07-31 14:02:35
 * @LastEditTime: 2021-04-16 17:04:46
 * @LastEditors: dongqi.zhao
 */
export const AlllistSQL = `
/*+ engine= mpp*/
select
'all' as ds,
sum(subscribe_success_num) as subscribe_success_num
        ,sum(subscribe_cancal_num) as subscribe_cancal_num
        ,sum(purchase_renew_num) as purchase_renew_num
        ,sum(purchase_num) as purchase_num
        ,sum(free_purchase_num) as free_purchase_num
        ,sum(refund_num) as refund_num
        ,sum(real_revenue) as real_revenue
        ,sum(charged_amount) as charged_amount
        ,sum(refund_amount) as refund_amount
        ,sum(charged_amount2) as charged_amount2
        ,sum(refund_amount2) as refund_amount2
        ,sum(reckon_amt2) as reckon_amt2
        ,sum(subscription_views_num) as subscription_views_num
        ,sum(subscription_click_num) as subscription_click_num
        ,sum(user_num) as user_num
        ,sum(ad_cost) as ad_cost
        ,sum(reckon_amt) as reckon_amt
        ,sum(ad_revenue) as ad_revenue
from (
        /*+ engine= mpp*/
        SELECT  t1.*
        ,reckon_amt
        ,reckon_amt2
        ,ad_revenue
        FROM    (
        SELECT  sum(subscribe_success_num) AS subscribe_success_num
                ,sum(subscribe_cancal_num) AS subscribe_cancal_num
                ,sum(purchase_renew_num) AS purchase_renew_num
                ,sum(purchase_num) AS purchase_num
                ,sum(free_purchase_num) AS free_purchase_num
                ,sum(refund_num) AS refund_num
                ,sum(real_revenue) AS real_revenue
                ,sum(charged_amount) AS charged_amount
                ,sum(charged_amount2) AS charged_amount2
                ,sum(refund_amount) AS refund_amount
                ,sum(refund_amount2) AS refund_amount2
                ,sum(subscription_views_num) AS subscription_views_num
                ,sum(subscription_click_num) AS subscription_click_num
                ,sum(user_num) AS user_num
                ,sum(ad_cost) AS ad_cost
                #select#
        FROM    (
                    SELECT  subscribe_success_num
                            ,subscribe_cancal_num
                            ,purchase_renew_num
                            ,purchase_num
                            ,free_purchase_num
                            ,refund_num
                            ,real_revenue
                            ,charged_amount
                            ,charged_amount2
                            ,refund_amount
                            ,refund_amount2
                            ,subscription_views_num
                            ,subscription_click_num
                            ,user_num
                            ,ad_cost
                            ,a.ds
                            #select1#
                    FROM    (
                                SELECT  sum(subscribe_success_num) AS subscribe_success_num
                                        ,sum(subscribe_cancal_num) AS subscribe_cancal_num
                                        ,sum(purchase_renew_num) AS purchase_renew_num
                                        ,sum(purchase_num) AS purchase_num
                                        ,sum(free_purchase_num) AS free_purchase_num
                                        ,sum(refund_num) AS refund_num
                                        ,sum(real_revenue) AS real_revenue
                                        ,sum(charged_amount) AS charged_amount
                                        ,sum(charged_amount2) AS charged_amount2
                                        ,sum(refund_amount) AS refund_amount
                                        ,sum(refund_amount2) AS refund_amount2
                                        ,sum(duid_num) AS user_num
                                        ,sum(ad_cost) AS ad_cost
                                        ,ds
                                        #select2#
                                FROM    (
                                            SELECT  COUNT(
                                                        DISTINCT IF(refund_amt>0 AND renew_cnt_1d>0,NULL,a.duid)
                                                    ) AS subscribe_success_num
                                                    ,COUNT(DISTINCT IF(cancel_sub_cnt>0,a.duid,NULL)) AS subscribe_cancal_num
                                                    ,COUNT(
                                                        DISTINCT IF(renew_cnt_1d>0 AND order_amount>0,a.duid,NULL)
                                                    ) AS purchase_renew_num
                                                    ,COUNT(
                                                        DISTINCT IF(free_cnt_1d=0 AND order_amount>0 ,a.duid,NULL )
                                                    ) AS purchase_num
                                                    ,COUNT(
                                                        DISTINCT IF(free_cnt_1d>0 AND (order_amount>0 OR income>0),a.duid,NULL)
                                                    ) AS free_purchase_num
                                                    ,COUNT(DISTINCT IF(refund_amt>0,a.duid,NULL)) AS refund_num
                                                    ,sum(order_amount2)- sum(refund_amt2) AS real_revenue
                                                    ,sum(order_amount) AS charged_amount
                                                    ,sum(order_amount2) AS charged_amount2
                                                    ,sum(refund_amt) AS refund_amount
                                                    ,sum(refund_amt2) AS refund_amount2
                                                    ,0 AS duid_num
                                                    ,0 AS ad_cost
                                                    ,reg_time AS ds
                                                    #select1#
                                            FROM    (
                                                        SELECT  order_time
                                                                ,commodity_type
                                                                ,orgain_order_id
                                                                ,duid
                                                                ,reg_time
                                                                ,sum(NVL(is_cancel,0)) AS cancel_sub_cnt
                                                                ,sum(
                                                                    IF(is_free=0 AND fst_pay_time < order_time AND is_refund=0,1,0)
                                                                ) AS renew_cnt_1d
                                                                ,sum(IF(is_cancel=0 OR is_cancel IS NULL ,order_amount,0)) AS order_amount
                                                                ,sum(
                                                                    IF(is_refund=0 AND (is_cancel=0 OR is_cancel IS NULL) ,order_amount,0)
                                                                ) AS income
                                                                ,sum(
                                                                    IF(is_refund=1 AND (is_cancel=0 OR is_cancel IS NULL),order_amount,0)
                                                                ) AS refund_amt
                                                                ,sum(
                                                                        IF(is_refund=1 AND (is_cancel=0 OR is_cancel IS NULL),order_amount2,0)
                                                                    ) AS refund_amt2
                                                                    ,sum(IF(is_cancel=0 OR is_cancel IS NULL ,order_amount2,0)) AS order_amount2
                                                                ,create_order_time
                                                                #select3#
                                                        FROM    vcm_vd_sub_dvc_cnt_nd
                                                        WHERE   reg_time >= #startDate#
                                                        AND     reg_time <= #endDate#
                                                        #where#
                                                        GROUP BY order_time
                                                                 ,commodity_type
                                                                 ,duid
                                                                 ,orgain_order_id
                                                                 ,reg_time
                                                                 ,create_order_time
                                                                 #group#
                                                    ) a
                                            LEFT OUTER JOIN (
                                                                SELECT  orgain_order_id
                                                                        ,duid
                                                                        ,sum(is_free) AS free_cnt_1d
                                                                        #select3#
                                                                FROM    vcm_vd_sub_dvc_cnt_nd
                                                                WHERE   reg_time >= #startDate#
                                                                AND     reg_time <= #endDate#
                                                                #where#
                                                                GROUP BY orgain_order_id
                                                                         ,duid
                                                                         #group#
                                                            ) b
                                            ON      a.duid = b.duid
                                            AND     a.orgain_order_id = b.orgain_order_id #join#
                                            GROUP BY reg_time #select1#
                                            UNION ALL
                                            SELECT  0 AS subscribe_success_num
                                                    ,0 AS subscribe_cancal_num
                                                    ,0 AS purchase_renew_num
                                                    ,0 AS purchase_num
                                                    ,0 AS free_purchase_num
                                                    ,0 AS refund_num
                                                    ,0 AS real_revenue
                                                    ,0 AS charged_amount
                                                    ,0 AS charged_amount2
                                                    ,0 AS refund_amount
                                                    ,0 AS refund_amount2
                                                    ,sum(duid_num) AS user_num
                                                    ,sum(ad_cost) AS ad_cost
                                                    ,ds
                                                    #select55#
                                                    #select4#
                                            FROM    vcm_vd_sub_adcost_usrcnt_nd
                                            WHERE   ds >= #startDate#
                                            AND     ds <= #endDate#
                                            #otherWhere#
                                            GROUP BY ds #group1#
                                        ) a1
                                GROUP BY ds #group2#
                            ) a
                    LEFT OUTER JOIN (
                                        SELECT  SUM(subscription_views_num) AS subscription_views_num
                                                ,SUM(subscription_click_num) AS subscription_click_num
                                                ,ds
                                                #select6#
                                        FROM    (
                                                    SELECT  IF(subscription_views_num >= 1, 1, NULL) AS subscription_views_num
                                                            ,IF(subscription_click_num >= 1, 1, NULL) AS subscription_click_num
                                                            ,ds
                                                            #select6#
                                                    FROM    (
                                                                SELECT  SUM(subscription_views_num) AS subscription_views_num
                                                                        ,SUM(subscription_click_num) AS subscription_click_num
                                                                        ,ds
                                                                        #select6#
                                                                FROM    vcm_vd_trd_sub_track_detail
                                                                WHERE   ds >= #startDate#
                                                                AND     ds <= #endDate#
                                                                #otherWhere1#
                                                                GROUP BY duiddigest
                                                                         ,ds  #group3#
                                                            ) 
                                                ) 
                                        GROUP BY ds #group3#
                                    ) b
                    ON      a.ds = b.ds #join2#
                ) 
        GROUP BY #group44#
        ) t1
LEFT JOIN (
              SELECT  #select21#
                      ,SUM(reckon_amt) AS reckon_amt
                      ,SUM(reckon_amt2) AS reckon_amt2
              FROM    ads_dp_ltv_future_amt_1d
              WHERE   reg_time >= #startDate#
              AND     reg_time <= #endDate#
              #where21#
              GROUP BY #group21#
          ) t2

ON t1.ds = t2.reg_time  #join21#
LEFT JOIN ( 
        SELECT  #select31#
                ,SUM(ad_revenue) AS ad_revenue 
        FROM    vcm_pub_trd_ad_info_ow 
        WHERE   bizday >= #startDate# 
        AND     bizday <= #endDate# 
        #where31#
        GROUP BY #group31# 
    ) t3 
ON t1.ds = t3.bizday  #join31#
)
;
`;

export const listSQL = `
/*+ engine= mpp*/
SELECT  t1.*
        ,reckon_amt
        ,reckon_amt2
        ,ad_revenue
FROM    (
SELECT  sum(subscribe_success_num) AS subscribe_success_num
        ,sum(subscribe_cancal_num) AS subscribe_cancal_num
        ,sum(purchase_renew_num) AS purchase_renew_num
        ,sum(purchase_num) AS purchase_num
        ,sum(free_purchase_num) AS free_purchase_num
        ,sum(refund_num) AS refund_num
        ,sum(real_revenue) AS real_revenue
        ,sum(charged_amount) AS charged_amount
        ,sum(charged_amount2) AS charged_amount2
        ,sum(refund_amount) AS refund_amount
        ,sum(refund_amount2) AS refund_amount2
        ,sum(subscription_views_num) AS subscription_views_num
        ,sum(subscription_click_num) AS subscription_click_num
        ,sum(user_num) AS user_num
        ,sum(ad_cost) AS ad_cost
        #select#
FROM    (
            SELECT  subscribe_success_num
                    ,subscribe_cancal_num
                    ,purchase_renew_num
                    ,purchase_num
                    ,free_purchase_num
                    ,refund_num
                    ,real_revenue
                    ,charged_amount
                    ,charged_amount2
                    ,refund_amount
                    ,refund_amount2
                    ,subscription_views_num
                    ,subscription_click_num
                    ,user_num
                    ,ad_cost
                    ,a.ds
                    #select1#
            FROM    (
                        SELECT  sum(subscribe_success_num) AS subscribe_success_num
                                ,sum(subscribe_cancal_num) AS subscribe_cancal_num
                                ,sum(purchase_renew_num) AS purchase_renew_num
                                ,sum(purchase_num) AS purchase_num
                                ,sum(free_purchase_num) AS free_purchase_num
                                ,sum(refund_num) AS refund_num
                                ,sum(real_revenue) AS real_revenue
                                ,sum(charged_amount) AS charged_amount
                                ,sum(charged_amount2) AS charged_amount2
                                ,sum(refund_amount) AS refund_amount
                                ,sum(refund_amount2) AS refund_amount2
                                ,sum(duid_num) AS user_num
                                ,sum(ad_cost) AS ad_cost
                                ,ds
                                #select2#
                        FROM    (
                                    SELECT  COUNT(
                                                DISTINCT IF(refund_amt>0 AND renew_cnt_1d>0,NULL,a.duid)
                                            ) AS subscribe_success_num
                                            ,COUNT(DISTINCT IF(cancel_sub_cnt>0,a.duid,NULL)) AS subscribe_cancal_num
                                            ,COUNT(
                                                DISTINCT IF(renew_cnt_1d>0 AND order_amount>0,a.duid,NULL)
                                            ) AS purchase_renew_num
                                            ,COUNT(
                                                DISTINCT IF(free_cnt_1d=0 AND order_amount>0 ,a.duid,NULL )
                                            ) AS purchase_num
                                            ,COUNT(
                                                DISTINCT IF(free_cnt_1d>0 AND (order_amount>0 OR income>0),a.duid,NULL)
                                            ) AS free_purchase_num
                                            ,COUNT(DISTINCT IF(refund_amt>0,a.duid,NULL)) AS refund_num
                                            ,sum(order_amount2)- sum(refund_amt2) AS real_revenue
                                            ,sum(order_amount) AS charged_amount
                                            ,sum(order_amount2) AS charged_amount2
                                            ,sum(refund_amt) AS refund_amount
                                            ,sum(refund_amt2) AS refund_amount2
                                            ,0 AS duid_num
                                            ,0 AS ad_cost
                                            ,reg_time AS ds
                                            #select1#
                                    FROM    (
                                                SELECT  order_time
                                                        ,commodity_type
                                                        ,orgain_order_id
                                                        ,duid
                                                        ,reg_time
                                                        ,sum(NVL(is_cancel,0)) AS cancel_sub_cnt
                                                        ,sum(
                                                            IF(is_free=0 AND fst_pay_time < order_time AND is_refund=0,1,0)
                                                        ) AS renew_cnt_1d
                                                        ,sum(IF(is_cancel=0 OR is_cancel IS NULL ,order_amount,0)) AS order_amount
                                                        ,sum(
                                                            IF(is_refund=0 AND (is_cancel=0 OR is_cancel IS NULL) ,order_amount,0)
                                                        ) AS income
                                                        ,sum(
                                                            IF(is_refund=1 AND (is_cancel=0 OR is_cancel IS NULL),order_amount,0)
                                                        ) AS refund_amt
                                                        ,sum(
                                                                IF(is_refund=1 AND (is_cancel=0 OR is_cancel IS NULL),order_amount2,0)
                                                            ) AS refund_amt2
                                                            ,sum(IF(is_cancel=0 OR is_cancel IS NULL ,order_amount2,0)) AS order_amount2
                                                        ,create_order_time
                                                        #select3#
                                                FROM    vcm_vd_sub_dvc_cnt_nd
                                                WHERE   reg_time >= #startDate#
                                                AND     reg_time <= #endDate#
                                                #where#
                                                GROUP BY order_time
                                                         ,commodity_type
                                                         ,duid
                                                         ,orgain_order_id
                                                         ,reg_time
                                                         ,create_order_time
                                                         #group#
                                            ) a
                                    LEFT OUTER JOIN (
                                                        SELECT  orgain_order_id
                                                                ,duid
                                                                ,sum(is_free) AS free_cnt_1d
                                                                #select3#
                                                        FROM    vcm_vd_sub_dvc_cnt_nd
                                                        WHERE   reg_time >= #startDate#
                                                        AND     reg_time <= #endDate#
                                                        #where#
                                                        GROUP BY orgain_order_id
                                                                 ,duid
                                                                 #group#
                                                    ) b
                                    ON      a.duid = b.duid
                                    AND     a.orgain_order_id = b.orgain_order_id #join#
                                    GROUP BY reg_time #select1#
                                    UNION ALL
                                    SELECT  0 AS subscribe_success_num
                                            ,0 AS subscribe_cancal_num
                                            ,0 AS purchase_renew_num
                                            ,0 AS purchase_num
                                            ,0 AS free_purchase_num
                                            ,0 AS refund_num
                                            ,0 AS real_revenue
                                            ,0 AS charged_amount
                                            ,0 AS charged_amount2
                                            ,0 AS refund_amount
                                            ,0 AS refund_amount2
                                            ,sum(duid_num) AS user_num
                                            ,sum(ad_cost) AS ad_cost
                                            ,ds
                                            #select55#
                                            #select4#
                                    FROM    vcm_vd_sub_adcost_usrcnt_nd
                                    WHERE   ds >= #startDate#
                                    AND     ds <= #endDate#
                                    #otherWhere#
                                    GROUP BY ds #group1#
                                ) a1
                        GROUP BY ds #group2#
                    ) a
            LEFT OUTER JOIN (
                                SELECT  SUM(subscription_views_num) AS subscription_views_num
                                        ,SUM(subscription_click_num) AS subscription_click_num
                                        ,ds
                                        #select6#
                                FROM    (
                                            SELECT  IF(subscription_views_num >= 1, 1, NULL) AS subscription_views_num
                                                    ,IF(subscription_click_num >= 1, 1, NULL) AS subscription_click_num
                                                    ,ds
                                                    #select6#
                                            FROM    (
                                                        SELECT  SUM(subscription_views_num) AS subscription_views_num
                                                                ,SUM(subscription_click_num) AS subscription_click_num
                                                                ,ds
                                                                #select6#
                                                        FROM    vcm_vd_trd_sub_track_detail
                                                        WHERE   ds >= #startDate#
                                                        AND     ds <= #endDate#
                                                        #otherWhere1#
                                                        GROUP BY duiddigest
                                                                 ,ds  #group3#
                                                    ) 
                                        ) 
                                GROUP BY ds #group3#
                            ) b
            ON      a.ds = b.ds #join2#
        ) 
GROUP BY #group44#
) t1
LEFT JOIN (
              SELECT  #select21#
                      ,SUM(reckon_amt) AS reckon_amt
                      ,SUM(reckon_amt2) AS reckon_amt2
              FROM    ads_dp_ltv_future_amt_1d
              WHERE   reg_time >= #startDate#
              AND     reg_time <= #endDate#
              #where21#
              GROUP BY #group21#
          ) t2
ON t1.ds = t2.reg_time  #join21#
LEFT JOIN ( 
        SELECT  #select31#
                ,SUM(ad_revenue) AS ad_revenue 
        FROM    vcm_pub_trd_ad_info_ow 
        WHERE   bizday >= #startDate# 
        AND     bizday <= #endDate# 
        #where31#
        GROUP BY #group31# 
    ) t3 
ON t1.ds = t3.bizday  #join31#
order by #order# desc
;
`;

/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-26 10:32:14
 * @LastEditTime: 2020-07-28 13:33:16
 * @LastEditors: ssssslf
 */

export const listSQL = `
 select round(stay_num*100/reg_num,4) as stay_ratio
        ,stay_seq
        ,day
from    vivashow_user_stay
where   day >= #startDate#
and     day <= #endDate#
and cast(stay_seq as int ) >= 1
and cast(stay_seq as int )  <= 30
and share_type = 'ALL'
AND (media_source='ALL' OR media_source IS NULL )
order by day desc 
limit   10000
 `;

export const mastSql = `
        select round(stay_num*100/reg_num,4) as stay_ratio
                ,stay_seq
                ,day
        from    rpt_india_stay_nd
        where   day >= #startDate#
        and     day <= #endDate#
        and cast(stay_seq as int ) >= 1
        and cast(stay_seq as int )  <= 30
        and share_type = 'ALL'
        and product_id='42'
        order by product_id,day desc 
        limit   10000;
`;

/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-06 18:40:28
 * @LastEditTime: 2021-03-30 17:24:12
 * @LastEditors: dongqi.zhao
 */

export const reptileDataSql = `
/*+ engine= mpp*/
select  account_id, product_id, charge_type, sum(ad_spend) as ad_spend, media_source
from  vcm_pub_trd_adv_push_check_ow
where ds >= #startDay#  and ds <= #endDay# 
group by product_id, account_id, charge_type, media_source
;
 `;

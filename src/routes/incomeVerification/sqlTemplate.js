/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-06 18:40:28
 * @LastEditTime: 2021-03-30 11:53:08
 * @LastEditors: dongqi.zhao
 */

export const reptileDataSql = `
/*+ engine= mpp*/
SELECT
  platform_name,
  product_id,
  charge_type,
  sum(ad_revenue) as ad_revenue
from    vcm_pub_trd_adv_income_check_ow
where ds >= #startDay#  and ds <= #endDay#
group by 
  platform_name,
  product_id,
  charge_type
;
 `;

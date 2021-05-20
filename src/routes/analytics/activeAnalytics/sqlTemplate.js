/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/1/29
 * Time: 上午11:35
 *
 */
export const activeSql = `
select #order#,
sum(active_user_count) as active_user_count,
sum(active_newuser_count) as active_newuser_count,
day
from ads_gh_country_device_active_count_day
where day >= #startDate# and day <=#endDate# 
and product = #product#
and country_name = #country_name#
and channel = #channel#
and app_version = #app_version#
#country#
group by #order# ,day
order by #order# 
;
`;

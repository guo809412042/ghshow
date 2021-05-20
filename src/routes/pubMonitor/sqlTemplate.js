/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-03-19 15:57:16
 * @LastEditTime: 2021-01-04 17:24:34
 * @LastEditors: dongqi.zhao
 */
export const dataSQL = `
SELECT * FROM ads_pub_monitor_centre_table_ow where odps_table_name = #database#
and ds >= #startDate#  and ds <= #endDate# #where# and is_warning = 1`;

export const countSQL = `
select ds as day,
    sum(record_counts) as value,
    max(server_table_name) as type
    from ads_pub_monitor_centre_table_counts_ow
    where odps_table_name= #database#  and ds >= #startDate#  and ds <= #endDate# #where#
    GROUP BY day
    order by day;
;`;

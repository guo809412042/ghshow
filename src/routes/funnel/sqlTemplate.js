/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-09 11:13:38
 * @LastEditTime: 2020-04-09 11:15:39
 * @LastEditors: ssssslf
 */
export const eventNameSQL = `
select 
    DISTINCT(event_name) 
    from holo_viva_log_event_count 
    order by event_name
    `;

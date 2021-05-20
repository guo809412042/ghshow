/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-02-06 18:40:28
 * @LastEditTime: 2021-04-13 16:03:09
 * @LastEditors: dongqi.zhao
 */

export const dbsourcesql = `
/*+ engine= mpp*/
select distinct(#type#) from #db# where #type# is not null #where#;
 `;

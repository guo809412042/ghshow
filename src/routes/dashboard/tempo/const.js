// 获取tempo的投放渠道，由于历史原因从 20210127 开始
export const tempoChannelSQL = `select DISTINCT(channel) from vcm_app_comm_usr_stay_ads where product_type = 'tempo' and ds >= '20210127'`;

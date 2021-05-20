export const countryListSQL = `
SELECT DISTINCT(\`country_name\`)  FROM ads_pub_trd_usrvip_cnt_1d
`;

export const vipListSQL = `
/*+engine=mpp*/
SELECT 
ds,
sum(off_sub_usr_cnt_1d) AS off_sub_usr_cnt_1d,
sum(lose_vip_usr_cnt_1d) AS lose_vip_usr_cnt_1d,
sum(lose_vip_usr_cnt_std) AS lose_vip_usr_cnt_std,
sum(dau_usr_cnt_1d) AS dau_usr_cnt_1d,
sum(lose_vip_dau_usr_cnt_std) AS lose_vip_dau_usr_cnt_std,
round(100*(sum(lose_vip_dau_usr_cnt_std))/(sum(dau_usr_cnt_1d)),2) AS lost_dau_rate
FROM ads_pub_trd_usrvip_cnt_1d ? group by ds order by ds desc
`;

export const commodityListSQL = `
/*+engine=mpp*/
SELECT 
ds,
sum(lose_vip_free_usr_cnt_1d) AS lose_vip_free_usr_cnt_1d,
sum(lose_vip_free_pay_usr_cnt_1d) AS lose_vip_free_pay_usr_cnt_1d,
round(sum(lose_vip_free_pay_amt_1d),2) AS lose_vip_free_pay_amt_1d,
sum(lose_vip_pay_usr_cnt_1d) AS lose_vip_pay_usr_cnt_1d,
round(sum(lose_vip_pay_amt_1d),2) AS lose_vip_pay_amt_1d,
sum(lose_vip_pay_usr_cnt_std) AS lose_vip_pay_usr_cnt_std,
round(sum(lose_vip_pay_amt_std),2) AS lose_vip_pay_amt_std
 FROM ads_pub_trd_losevip_amt_std ? group by ds order by ds desc
`;

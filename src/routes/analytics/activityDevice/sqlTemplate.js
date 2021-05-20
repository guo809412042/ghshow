export const duidAuidSQL = `
SELECT SUM(duid_count) AS duid_total
  , SUM(auid_count) AS auid_total
  , day
FROM device_active_count
WHERE day >= #startDate# AND day <= #endDate# 
AND product = #product# AND type=#type# AND duration = '#duration#' #where#
GROUP BY day
ORDER BY day
LIMIT 1000;
`;

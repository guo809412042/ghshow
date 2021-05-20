export const groupSignal = (data, key) => data.reduce((prev, cur) => {
  (prev[cur[key]] = prev[cur[key]] || []).push(cur);
  return prev;
}, {});

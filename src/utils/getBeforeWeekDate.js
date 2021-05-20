/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/1/24
 * Time: 下午4:50
 *
 */
export function getBeforeWeek(d, n = 7) {
  d = new Date(d);
  d = +d - 1000 * 60 * 60 * 24 * n;
  d = new Date(d);
  const year = d.getFullYear();
  const mon = d.getMonth() + 1;
  const day = d.getDate();
  const s = `${year}${mon < 10 ? `0${mon}` : mon}${day < 10 ? `0${day}` : day}`;
  return s;
}

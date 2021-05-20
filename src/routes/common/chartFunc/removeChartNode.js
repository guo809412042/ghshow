/* eslint-disable no-undef */
/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/3/21
 * Time: 上午11:05
 *
 */

export function removeChartNode(nodeId) {
  const node = document.getElementById(nodeId);
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/* eslint-disable no-undef */
import XLSX from 'xlsx';
import { s2ab, saveAs } from './utils';

export default function exportExcelxlsx(json, downName, type = undefined, showavg) {
  const source = [].concat(JSON.parse(JSON.stringify(json)));
  if (showavg) {
    if (!(source.length > 0)) return;
    const keylist = Object.keys(source[0]);
    const obj = {};
    const objsum = {};
    for (let n = 0; n < keylist.length; n++) {
      const element = keylist[n];
      let elementSum = 0;
      for (let n = 0; n < source.length; n++) {
        elementSum += Number(source[n][element]);
      }
      obj[element] = Number((elementSum / source.length).toFixed(2))
        ? Number((elementSum / source.length).toFixed(2))
        : '';
      obj.day = '均值';
      // console.log(typeof elementSum)
      objsum[element] = typeof elementSum === 'number' ? elementSum : '';
      objsum.day = '总和';
    }
    source.push(obj);
    source.push(objsum);
  }
  const tmpWB = {
    SheetNames: [downName], // 保存的表标题
    Sheets: {},
  };
  tmpWB.Sheets[`${downName}`] = XLSX.utils.json_to_sheet(source);
  const tmpDown = new Blob(
    [
      s2ab(
        XLSX.write(
          tmpWB,
          { bookType: type === undefined ? 'xlsx' : type, bookSST: false, type: 'binary' }, // 这里的数据是用来定义导出的格式类型
        ),
      ),
    ],
    {
      type: '',
    },
  ); // 创建二进制对象写入转换好的字节流
  saveAs(tmpDown, `${downName}.xlsx`);
}

import XLSX from 'xlsx';

// 将字符串转ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}

// 将workbook装化成blob对象
function workbook2blob(workbook) {
  // 生成excel的配置项
  const wopts = {
    // 要生成的文件类型
    bookType: 'xlsx',
    // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    // 二进制类型
    type: 'binary',
  };
  const wbout = XLSX.write(workbook, wopts);
  const blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  });
  return blob;
}

function openDownloadDialog(blob, fileName) {
  if (typeof blob === 'object' && blob instanceof Blob) {
    blob = URL.createObjectURL(blob); // 创建blob地址
  }
  const aLink = document.createElement('a');
  aLink.href = blob;
  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
  aLink.download = fileName || '';
  let event;
  if (window.MouseEvent) event = new MouseEvent('click');
  //   移动端
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
  URL.revokeObjectURL(blob);
}

export const exportExcel = (data, fileName = '导出.xlsx') => {
  const sheet1 = XLSX.utils.json_to_sheet(data);
  // 创建一个新的空的workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet1, fileName.split('.')[0]);
  const workbookBlob = workbook2blob(wb);
  openDownloadDialog(workbookBlob, fileName);
};

import React from 'react';
import { message, Button, Upload } from 'antd';
import Papa from 'papaparse';
import jschardet from 'jschardet';

import { addEvent } from '../service';

class UploadTaskEventFile extends React.Component {
  constructor(props) {
    super(props);
  }

  checkEncoding = (base64Str) => {
    // 这种方式得到的是一种二进制串
    const str = atob(base64Str.split(';base64,')[1]); // atob  方法 Window 对象 定义和用法 atob() 方法用于解码使用 base-64 编码的字符
    // 要用二进制格式
    let encoding = jschardet.detect(str);
    encoding = encoding.encoding;
    // 有时候会识别错误
    if (encoding == 'windows-1252') {
      encoding = 'ANSI';
    }
    return encoding;
  };

  formatData = async (data) => {
    const { taskInfo, reFresh } = this.props;
    let count = 0;

    await Promise.all(
      data.map(async (item) => {
        const createParam = {
          event_id: item[7],
          event_name: item[6],
          product: taskInfo.product_id,
          platform: ['iOS', 'Android'][taskInfo.platform],
          version: taskInfo.version,
          tag: item[9],
          remark_desc: item[11],
          android_dev: item[12],
          ios_dev: item[13],
          tester_email: item[14],
          eventParams: item[8].split(/\r|\r\n|\n/).map((item) => {
            const obj = {};
            item.split(',').forEach((i) => {
              console.log(i);
              const [key, value] = i.replace(/'|"/g, '').split('=');
              obj[key] = value;
            });

            return obj;
          }),
          business_module: item[10],
          data_type: item[0] === '新增' ? 0 : 1,
          task_id: taskInfo.id,
        };

        const res = await addEvent(createParam);
        if (res.code === 20000) {
          count++;
        }
      }),
    );

    message.success(`添加成功 ${count} 个`);
    reFresh && reFresh();
  };

  beforeUpload = (file) => {
    console.log(this.props.taskInfo);
    const fReader = new FileReader();
    fReader.readAsDataURL(file); //  readAsDataURL 读取本地文件 得到的是一个base64值
    fReader.onload = (evt) => {
      // 读取文件成功
      const data = evt.target.result;
      const encoding = this.checkEncoding(data);
      // papaparse.js 用来解析转换成二维数组
      Papa.parse(file, {
        encoding,
        complete: (results) => {
          // UTF8 \r\n与\n混用时有可能会出问题
          const res = results.data;
          if (res[res.length - 1] === '') {
            // 去除最后的空行 有些解析数据尾部会多出空格
            res.pop();
          }
          // 当前res 就是二维数组的值 数据拿到了 那么在前端如何处理渲染 就根据需求再做进一步操作了
          console.log(res);
          // 去除首行，去除末尾无用行，删除字段中的前后空格
          this.formatData(
            res
              .slice(1)
              .filter(item => item[0].trim() !== '')
              .map(item => item.map(i => i.trim())),
          );
        },
      });
    };
    return false;
  };

  render() {
    return (
      <Upload beforeUpload={this.beforeUpload}>
        <Button onClick={this.upload} type="primary">
          {this.props.title || '上传'}
        </Button>
      </Upload>
    );
  }
}
export default UploadTaskEventFile;

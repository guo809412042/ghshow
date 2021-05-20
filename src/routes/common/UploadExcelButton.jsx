import React from 'react';
import Cookie from 'js-cookie';
import { Upload, Icon, Button } from 'antd';
import XLSX from 'xlsx';

const lang = Cookie.get('lang') !== 'en-US';
class UploadExcelButton extends React.Component {
  state = {
    iconLoading: false,
  };

  uploadfun(obj) {
    const { uploadKey } = this.props;
    if (!obj) {
      return;
    }
    const reader = new FileReader();
    reader.readAsBinaryString(obj);
    reader.onload = (e) => {
      const data = e.target.result;
      const wb = XLSX.read(data, {
        type: 'binary',
      });
      const arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const puidList = [];
      for (let index = 0; index < arr.length; index++) {
        puidList.push(arr[index][uploadKey]);
      }
      // this.setState({ iconLoading: false })
      this.setState({ iconLoading: false }, () => {
        this.props.fetchExc(puidList);
      });
    };
  }

  render() {
    const { iconLoading } = this.state;
    const ctx = this;
    const { title } = this.props;
    const Uploadprops = {
      customRequest: ({ file }) => {
        this.setState({ iconLoading: true });
        try {
          if (!file) {
            return;
          }
          ctx.uploadfun(file);
        } catch (error) {
          this.setState({ iconLoading: false });
        }
      },
      showUploadList: false,
    };
    return (
      <Upload {...Uploadprops} {...this.props}>
        <Button type="ghost" loading={iconLoading}>
          <Icon type="upload" /> {!title ? (lang ? '上传Excel查询' : 'Upload Excel') : title}
        </Button>
      </Upload>
    );
  }
}

export default UploadExcelButton;
